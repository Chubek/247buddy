require("dotenv").config({ path: "../.env" });
const router = require("express").Router();
const fieldEncryption = require("mongoose-field-encryption");
const ListenerSchema = require("../Models/Listener");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminSchema = require("../Models/Admin");
const CryptoJS = require("crypto-js");
const AdminAuth = require("../Middleware/AdminAuth");
const SuperAdminAuth = require("../Middleware/SuperAdminAuth");
//GETs
router.get("/get/all", SuperAdminAuth, (req, res) => {
  AdminSchema.find({})
    .then((adminDocs) => res.status(200).json({ adminDocs }))
    .catch((e) => console.log(e));
});

router.get("/get/single/:adminid", SuperAdminAuth, (req, res) => {
  AdminSchema.findOne({ _id: req.params.adminid })
    .then((adminDoc) => {
      res.status(200).json({ adminDoc });
    })
    .catch((e) => console.log(e));
});

//POSTs

router.post("/auth", (req, res) => {
  const { userName, phoneNumber, email, password } = req.body;

  const userNameEnc = fieldEncryption.encrypt(
    CryptoJS.AES.encrypt(userName, process.env.AES_KEY),
    process.env.MONGOOSE_ENCRYPT_SECRET
  );
  const phoneNumberEnc = fieldEncryption.encrypt(
    CryptoJS.AES.encrypt(phoneNumber, process.env.AES_KEY),
    process.env.MONGOOSE_ENCRYPT_SECRET
  );
  const emailEnc = fieldEncryption.encrypt(
    CryptoJS.AES.encrypt(email, process.env.AES_KEY),
    process.env.MONGOOSE_ENCRYPT_SECRET
  );

  AdminSchema.findOne({
    $or: [
      { userName: userNameEnc },
      { email: emailEnc },
      { phoneNumber: phoneNumberEnc },
    ],
  }).then((adminDoc) => {
    if (!adminDoc) {
      res.status(404).json({ adminExists: false });
      return false;
    }

    bcrypt.compare(password, adminDoc.password, (err, isMatch) => {
      if (err) throw err;

      if (isMatch) {
        jwt.sign({ id: adminDoc._id }, process.env.JWT_SECRET, (err, token) => {
          if (err) throw err;
          res.status(200).json({ token: token, adminDoc });
        });
      } else {
        res.status(403).json({ passwordCorrect: false });
      }
    });
  });
});

//PUTs

router.put("/edit/info", AdminAuth, (req, res) => {
  const adminId = req.admin.id;
  const { email, phoneNumber, userName } = req.body;

  const userNameEnc = fieldEncryption.encrypt(
    CryptoJS.AES.encrypt(userName, process.env.AES_KEY),
    process.env.MONGOOSE_ENCRYPT_SECRET
  );
  const phoneNumberEnc = fieldEncryption.encrypt(
    CryptoJS.AES.encrypt(phoneNumber, process.env.AES_KEY),
    process.env.MONGOOSE_ENCRYPT_SECRET
  );
  const emailEnc = fieldEncryption.encrypt(
    CryptoJS.AES.encrypt(email, process.env.AES_KEY),
    process.env.MONGOOSE_ENCRYPT_SECRET
  );

  AdminSchema.findOneAndUpdate(
    { _id: adminId },
    {
      userName: userNameEnc,
      __enc_userName: false,
      phoneNumber: phoneNumberEnc,
      __enc_phoneNumber: false,
      email: emailEnc,
      __enc_email: false,
    }
  )
    .then(() => res.status(200).json({ adminEdited: true }))
    .catch((e) => console.log(e));
});

router.put("/change/password", AdminAuth, (req, res) => {
  const adminId = req.admin.id;
  const { oldPassword, newPassword } = req.body;

  AdminSchema.findOne({ _id: adminId }).then((adminDoc) => {
    bcrypt.compare(oldPassword, adminDoc.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        bcrypt.hash(newPassword, 12, (err, hash) => {
          if (err) throw err;
          AdminSchema.findOneAndUpdate({ _id: adminId }, { password: hash })
            .then(() => res.status(200).json({ passwordChanged: true }))
            .catch((e) => console.log(e));
        });
      }
    });
  });
});
