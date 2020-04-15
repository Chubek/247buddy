require("dotenv").config({ path: "../.env" });
const router = require("express").Router();
const fieldEncryption = require("mongoose-field-encryption");
const ListenerSchema = require("../Models/Listener");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SuperAdminSchema = require("../Models/SuperAdmin");
const AdminSchema = require("../Models/Admin");
const CryptoJS = require("crypto-js");
const SuperAdminAuth = require("../Middleware/SuperAdminAuth");
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

router.put("/edit/info", SuperAdminAuth, (req, res) => {
  const superId = req.super.id;
  const { userName, email } = req.body;

  const userNameEnc = CryptoJS.AES.encrypt(userName, process.env.AES_KEY);
  const emailEnc = CryptoJS.AES.encrypt(email, process.env.AES_KEY);

  SuperAdminSchema.findOneAndUpdate(
    { _id: superId },
    { userName: userNameEnc, email: emailEnc }
  )
    .then(() => res.status(200).json({ superUpdated: true }))
    .catch((e) => console.log(e));
});

router.put("/change/password", SuperAdminAuth, (req, res) => {
    const superId = req.super.id;
    const { oldPassword, newPassword } = req.body;

    const oldPasswordEnc = fieldEncryption.encrypt(CryptoJS.AES.encrypt(oldPassword, process.env.AES_KEY), process.env.MONGOOSE_ENCRYPT_SECRET);
    const newPasswordEnc = CryptoJS.AES.encrypt(newPassword, process.env.AES_KEY);

    SuperAdminSchema.findOne({ _id: superId })
        .then(superDoc => {
            if (superDoc.password === oldPasswordEnc) {
                SuperAdminSchema.findOneAndUpdate({ _id: superId }, { password: newPasswordEnc })
                    .then(() => res.status(200).json({ passwordChanged: true }))
                    .catch(e => console.log(e))
            } else {
                res.status(403).json({passwordChanged: false})
            }

        })
})

router.post("/create/admin", SuperAdminAuth, (req, res) => {
    const superId = req.super.id;
    const { adminUserName, adminEmail, adminPassword,  }
})

