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
const fs = require("fs");
const randomstring = require("randomstring");
const sha256File = require("sha256-file");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

//GETs
router.get("/get/all", (req, res) => {
  ListenerSchema.find({})
    .then((listenerDocs) => {
      res.status(200).json({ listenerDocs });
    })
    .catch((e) => console.log(e));
});

router.get("/get/single/:listenerid", (req, res) => {
  const listenerId = req.params.listenerid;
  ListenerSchema.findOne({ _id: listenerId })
    .then((listenerDoc) => {
      res.status(200).json({
        listenerDoc,
      });
    })
    .catch((e) => console.log(e));
});

//POSTs

router.post("/register", (req, res) => {
  const { userName, email, number, password } = req.body;
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

  if (!number) {
    res.status(401).json({ notSent: "number" });
  }

  const indianRe = / ^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$ /;

  if (!number.match(indianRe)) {
    res.status(401).json({ numberNotIndian: true });
  }

  const encryptedEmail = fieldEncryption.encrypt(
    email,
    process.env.MONGOOSE_ENCRYPT_SECRET
  );
  const encryptedNumber = fieldEncryption.encrypt(
    number,
    process.env.MONGOOSE_ENCRYPT_SECRET
  );
  ListenerSchema.findOne({
    $or: [
      { "cell.number": encryptedNumber },
      { email: encryptedEmail },
      { userName: userName },
    ],
  }).then((listenerDoc) => {
    if (listenerDoc.email === encryptedEmail) {
      res.status(401).json({ isSame: "email" });
    } else if (listenerDoc.userName === userName) {
      res.status(401).json({ isSame: "userName" });
    } else if (
      listenerDoc.userName === userName &&
      listenerDoc.email === encryptedEmail &&
      listenerDoc.cell.number === encryptedNumber
    ) {
      res.status(401).json({ isSame: "listener" });
    } else if (listenerDoc.cell.number === encryptedNumber) {
      res.status(401).json({ isSame: "number" });
    }
  });

  bcrypt.hash(password, 12, (err, hash) => {
    if (err) throw err;
    const Listener = new ListenerSchema({
      userName: userName,
      email: email,
      password: hash,
      "cell.number": number,
      "activationStatus.activationCode":
        _.random(100, 999) + _.random(1000, 9999),
    });

    Listener.save()
      .then((savedDoc) => {
        jwt.sign({ id: savedDoc._id }, process.env.JWT_SECRET, (err, token) => {
          if (err) throw err;
          sendMail(
            email,
            "Your Registeration at 247Buddy Requires activation",
            `Your activation code is: ${savedDoc.activationStatus.activationCode}. \n Please enter the above code into the specified field in the app.`
          );
          //put SMS here
          savedDoc.email = fieldEncryption.decrypt(
            savedDoc.email,
            process.env.MONGOOSE_ENCRYPT_SECRET
          );
          res.status(200).json({
            token: token,
            listenerDoc: savedDoc,
          });
        });
      })
      .catch((e) => console.log(e));
  });
});

router.post("/auth", (req, res) => {
  const { email, userName, number, password } = req.body;
  if (!email || !userName || !number) {
    res.status(401).json({ notSent: "loginString" });
  }
  if (!password) {
    res.status(401).json({ notSent: "password" });
  }

  const emailEncrypted = fieldEncryption.encrypt(
    email,
    process.env.MONGOOSE_ENCRYPT_SECRET
  );

  const numberEncrypted = fieldEncryption.encrypt(
    number,
    process.env.MONGOOSE_ENCRYPT_SECRET
  );

  ListenerSchema.findOne({
    $or: [
      { email: emailEncrypted },
      { userName: userName },
      { "cell.number": numberEncrypted },
    ],
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
        jwt.sign(
          { id: listenerDoc._id },
          process.env.JWT_SECRET,
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token: token,
              isUser: true,
              matchPassword: true,
              listenerDoc,
            });
          }
        );
      });
    })
    .catch((e) => console.log(e));
});

//PUTs

router.put("/activate", ListenerAuth, (req, res) => {
  const listenerId = req.listener.id;
  const activationCode = req.body.activationCode;

  ListenerSchema.findOne({ _id: listenerId }).then((listenerDoc) => {
    if (listenerDoc.activationStatus.activationCode === activationCode) {
      ListenerSchema.findOneAndUpdate(
        { _id: listenerId },
        {
          "activationStatus.activated": true,
          $set: { "activationStatus.activationDate": new Date() },
        }
      )
        .then(() => res.status(200).json({ isActivated: true }))
        .catch((e) => console.log(e));
      return true;
    } else {
      res.status(403).json({ isActivated: false });
      return false;
    }
  });
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

router.put("/set/session", ListenerAuth, (req, res) => {
  const listenerId = req.listener.id;
  const session = req.body.session;

  ListenerSchema.findOneAndUpdate(
    { _id: listenerId },
    { "status.currentEngagedSessionId": session }
  )
    .then(() => {
      res.status(200).json({ session: session });
    })
    .catch((e) => console.log(e));
});

router.put("/set/avatar", ListenerAuth, (req, res) => {
  const listenerId = req.listener.id;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ filesUploaded: false });
  }

  const avatar = req.files.avatar;
  const extension = avatar.name.split(".").pop();

  const path = appRoot + "/public/img/avatars/" + listenerId;

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  const avatarFileName = "Avatar_" + randomstring(4) + "." + extension;
  const filePath = path + "/" + avatarFileName;

  avatar.mv(filePath, (err) => {
    if (err) throw err;

    async () => {
      await imagemin(filePath, {
        destination: path,
        plugins: [
          imageminJpegtran(),
          imageminPngquant({ quality: [0.5, 0.6] }),
        ],
      });
    };

    sha256File(filePath, (err, checksum) => {
      if (err) throw err;

      ListenerSchema.findOne({ _id: listenerId }).then((listenerDoc) => {
        if (listenerDoc.avatar.src) {
          fs.unlinkSync(listenerDoc.avatar.src);
        }

        ListenerSchema.findOneAndUpdate(
          { _id: listenerId },
          {
            $set: { "avatar.src": filePath, "avatar.sha256": checksum },
          }
        )
          .then(() =>
            res.status(200).json({
              avatarPath: filePath,
              avatarName: avatarFileName,
            })
          )
          .catch((e) => console.log(e));
      });
    });
  });
});

router.put("/change/email/on/activation", ListenerAuth, (req, res) => {
  const listenerId = req.listener.id;
  const email = req.body.email;
  const activationCode = _.random(100, 999) + _.random(1000, 9999);

  ListenerSchema.findOneAndUpdate(
    { _id: listenerId },
    {
      email: email,
      __enc_email: false,
      "activationStatus.activationCode": activationCode,
    }
  )
    .then(() => {
      sendMail(
        email,
        "Your Registeration at 247Buddy Requires activation",
        `Your activation code is: ${activationCode}. \n Please enter the above code into the specified field in the app.`
      );
      res.status(200).json({ emailChanged: true });
    })
    .catch((e) => console.log(e));
});

router.put("/change/email/in/use", ListenerAuth, (req, res) => {
  const listenerId = req.listener.id;
  const email = req.body.email;
  const verificationCode = _.random(100, 999) + _.random(1000, 9999);

  ListenerAuth.findOneAndUpdate(
    { _id: listenerId },
    { emailVerificationCode: verificationCode }
  ).then(() => {
    sendMail(
      email,
      "Your Email Change at 247Buddy Requires Verification",
      `Your verification code is: ${verificationCode}. \n Please enter the above code into the specified field in the app.`
    );
    res.status(200).json({ verificationEmailSent: true });
    res;
  });
});

router.put("/change/email/in/use", ListenerAuth, (req, res) => {
  const listenerId = req.listener.id;
  const email = req.body.email;

  ListenerSchema.findOneAndUpdate(
    { _id: listenerId },
    { email: email, __enc_email: false }
  )
    .then(() => res.status(200).json({ emailChanged: true }))
    .catch((e) => console.log(e));
});

router.put("/change/password", ListenerAuth, (req, res) => {
  const listenerId = req.listener.id;
  const { oldPassword, newPassword } = req.body;

  ListenerSchema.findOne({ _id: listenerId }).then((listenerDoc) => {
    bcrypt.compare(oldPassword, listenerDoc.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        bcrypt.hash(newPassword, 12, (err, hash) => {
          if (err) throw err;
          ListenerSchema.findOneAndUpdate(
            { _id: listenerId },
            { password: hash }
          )
            .then(() => res.status(200).json({ passwordChanged: true }))
            .catch((e) => console.log(e));
        });
      }
    });
  });
});


