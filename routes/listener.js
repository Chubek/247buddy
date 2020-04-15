require("dotenv").config({ path: "../.env" });
const router = require("express").Router();
const fieldEncryption = require("mongoose-field-encryption");
const ListenerSchema = require("../Models/Listener");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../Middleware/Mailer");
const _ = require("lodash");
const ListenerAuth = require("../Middleware/ListenerAuth");
const AdminSchema = require("../Models/Admin");

//GETs
router.get("/get/all", (req, res) => {
  const ret = [];
  ListenerSchema.find({})
    .then((listenerDocs) => {
      listenerDocs.forEach((listener) => {
        ret.push({ id: listener._id, userName: listener.userName });
      });
      res.status(200).json({ listenerDocs: ret });
    })
    .catch((e) => console.log(e));
});

router.get("/get/single/:listenerid", (req, res) => {
  const listenerId = req.params.listenerid;
  ListenerSchema.findOne({ _id: listenerId })
    .then((listenerDoc) => {
      res.status(200).json({
        listenerDoc: {
          id: listenerDoc._id,
          userName: listenerDoc.userName,
          email: fieldEncryption.decrypt(
            listenerDoc.email,
            process.env.MONGOOSE_ENCRYPT_SECRET
          ),
        },
      });
    })
    .catch((e) => console.log(e));
});

//POSTs

router.post("/register", (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName) {
    res.status(401).json({ notSent: "userName" });
    return false;
  }
  if (!email) {
    res.status(401).json({ notSent: "email" });
    return false;
  }
  if (!password) {
    res.status(401).json({ notSent: "password" });
    return false;
  }

  const encryptedEmail = fieldEncryption.encrypt(
    email,
    process.env.MONGOOSE_ENCRYPT_SECRET
  );

  ListenerSchema.findOne({
    $or: [{ email: encryptedEmail }, { userName: userName }],
  }).then((listenerDoc) => {
    if (listenerDoc.email === encryptedEmail) {
      res.status(401).json({ isSame: "email" });
    } else if (listenerDoc.userName === userName) {
      res.status(401).json({ isSame: "userName" });
    } else if (
      listenerDoc.userName === userName &&
      listenerDoc.email === encryptedEmail
    ) {
      res.status(401).json({ isSame: "listener" });
    }
  });

  bcrypt.hash(password, 12, (err, hash) => {
    if (err) throw err;
    const Listener = new ListenerSchema({
      userName: userName,
      email: email,
      password: hash,
      "approvalStatus.approvalCode": _.random(100, 999) + _.random(1000, 9999),
    });

    Listener.save()
      .then((savedDoc) => {
        jwt.sign({ id: savedDoc._id }, process.env.JWT_KEY, (err, token) => {
          if (err) throw err;
          sendMail(
            email,
            "Your Registeration at 247Buddy Requires Approval",
            `Your approval code is: ${savedDoc.approvalStatus.approvalCode}. \n Please enter the above code into the specified field in the app.`
          );
          savedDoc.email = fieldEncryption.decrypt(
            savedDoc.email,
            process.env.MONGOOSE_ENCRYPT_SECRET
          );
          res.status(200).json({
            token: token,
            listenerDoc: { id: savedDoc._id, savedDoc },
          });
        });
      })
      .catch((e) => console.log(e));
  });
});

router.post("/auth", (req, res) => {
  const { email, userName, password } = req.body;
  if (!email || !userName) {
    res.status(401).json({ notSent: "loginString" });
  }
  if (!password) {
    res.status(401).json({ notSent: "password" });
  }

  const emailEncrypted = fieldEncryption.encrypt(
    email,
    process.env.MONGOOSE_ENCRYPT_SECRET
  );

  ListenerSchema.findOne({
    $or: [{ email: emailEncrypted }, { userName: userName }],
  })
    .then((listenerDoc) => {
      if (!listenerDoc) {
        res.status(404).json({ isUser: false });
        return false;
      }
      bcrypt.compare(password, listenerDoc.password, (err, match) => {
        if (err) throw err;
        if (!match) {
          res.status(403).json({ isUser: true, matchPassword: false });
          return false;
        }
        jwt.sign({ id: listenerDoc._id }, process.env.JWT_KEY, (err, token) => {
          if (err) throw err;
          listenerDoc.email = fieldEncryption.decrypt(
            listenerDoc.email,
            process.env.MONGOOSE_ENCRYPT_SECRET
          );
          res.status(200).json({
            token: token,
            isUser: true,
            matchPassword: true,
            listenerDoc,
          });
        });
      });
    })
    .catch((e) => console.log(e));
});

//PUTs

router.put("/approve", ListenerAuth, (req, res) => {
  const listenerId = req.listener.id;
  const approvalCode = req.body.approvalCode;

  ListenerSchema.findOne({ _id: listenerId }).then((listenerDoc) => {
    if (listenerDoc.approvalStatus.approvalCode === approvalCode) {
      ListenerSchema.findOneAndUpdate(
        { _id: listenerId },
        {
          "approvalStatus.approved": true,
          $set: { "approvalStatus.approvalDate": new Date() },
        }
      )
        .then(() => res.status(200).json({ isApproved: true }))
        .catch((e) => console.log(e));
      return true;
    } else {
      res.status(403).json({ isApproved: false });
      return false;
    }
  });
});

router.put("/deactivate", ListenerAuth, (req, res) => {
  const listenerId = req.listener.id;

  ListenerSchema.findOneAndUpdate(
    { _id: listenerId },
    {
      "activationStatus.active": false,
      $set: { "activationStatus.deactivationDate": new Date() },
    }
  )
    .then(() => res.status(200).json({ isDeactive: true }))
    .catch((e) => console.log(e));
});

router.put("/ban/:listenerid", AdminAuth, (req, res) => {
  const listenerId = req.params.listenerid;
  const adminId = req.admin.id;
  const endDate = req.body.endDate;

  ListenerSchema.findByIdAndUpdate(
    { _id: listenerId },
    {
      $push: {
        "bannedStatus.formerBans": {
          banDate: "bannedStatus.banDate",
          expireDate: "bannedStatus.expireDate",
        },
      },
      $set: {
        "bannedStatus.banDate": new Date(),
        "bannedStatus.expireDate": endDate,
      },
    }
  )
    .then(() => {
      AdminSchema.findOneAndUpdate(
        { _id: adminId },
        { $push: { bannedListenersId: listenerId } }
      ).then(() => res.status(200).json({ listenerBanned: true }));
    })
    .catch((e) => console.log(e));
});

router.put("/set/status", ListenerAuth, (req, res) => {
  const listenerId = req.listener.id;
  const status = req.body.status;

  ListenerSchema.findOneAndUpdate(
    { _id: listenerId },
    { "status.online": status }
  )
    .then(() => res.status(200).json({ isOnline: status }))
    .catch((e) => console.log(e));
});
