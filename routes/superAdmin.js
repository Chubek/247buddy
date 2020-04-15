require("dotenv").config({ path: "../.env" });
const router = require("express").Router();
const fieldEncryption = require("mongoose-field-encryption");
const ListenerSchema = require("../Models/Listener");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SuperAdminSchema = require("../Models/SuperAdmin");
const AdminSchema = require("../Models/Admin");
const CryptoJS = require("crypto-js");

//POSTs

router.post("/create", (req, res) => {
  const { isDefault, userName, email, password } = req.body;

  if (isDefault) {
    const superAdmin = new SuperAdminSchema({});

    superAdmin
      .save()
      .then(() => res.status(200).json({ superAdminCreated: true }))
      .catch((e) => console.log(e));
  } else if (!isDefault) {
    const userNameEnc = CryptoJS.AES(userName, process.env.AES_KEY);
    const emailEnc = CryptoJS.AES(email, process.env.AES_KEY);
    const passwordEnc = CryptoJS.AES(password, process.env.AES_KEY);

    const superAdmin = new SuperAdminSchema({
      userName: userNameEnc,
      email: emailEnc,
      password: passwordEnc,
    });

    superAdmin
      .save()
      .then(() => res.status(200).json({ superAdminCreated: true }))
      .catch((e) => console.log(e));
  }
});

router.post("/auth", (req, res) => {
  const { userName, email, password } = req.body;

  const userNameEnc = fieldEncryption.encrypt(
    CryptoJS.AES(userName, process.env.AES_KEY),
    process.env.MONGOOSE_ENCRYPT_SECRET
  );
  const emailEnc = fieldEncryption.encrypt(
    CryptoJS.AES(email, process.env.AES_KEY),
    process.env.MONGOOSE_ENCRYPT_SECRET
  );
  const passwordEnc = fieldEncryption.encrypt(
    CryptoJS.AES(password, process.env.AES_KEY),
    process.env.MONGOOSE_ENCRYPT_SECRET
  );

  SuperAdminSchema.findOne({
    $or: [{ userName: userNameEnc }, { email: emailEnc }],
  }).then((superDoc) => {
    if (superDoc.password === passwordEnc) {
      superDoc.userName = CryptoJS.AES.decrypt(
        fieldEncryption.decrypt(
          superDoc.userName,
          process.env.MONGOOSE_ENCRYPT_SECRET
        ),
        process.env.AES_KEY
      );
      superDoc.email = CryptoJS.AES.decrypt(
        fieldEncryption.decrypt(
          superDoc.email,
          process.env.MONGOOSE_ENCRYPT_SECRET
        ),
        process.env.AES_KEY
      );

      jwt.sign({ id: superDoc._id }, process.env.JWT_KEY, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token: token, superDoc });
      });
    }
  });
});

