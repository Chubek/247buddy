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
const _ = require("lodash");
const PairingSchema = require("../Models/Pairings");

router.post("/pairup/randomly", (req, res) => {
  const seekerNick = req.body.seekerNick;

  ListenerSchema.find({
    "status.online": true,
    "status.currentEngagedSessionId": "None",
  }).then((listenerDocs) => {
    listenerDocs = _.shuffle(listenerDocs);
    const selection = listenerDocs[_.random(0, listenerDocs.length - 1)];

    jwt.sign(
      { listenerId: selection._id },
      process.env.JWT_SECRET,
      (err, listenerToken) => {
        if (err) throw err;
        jwt.sign(
          { seekerNick: seekerNick },
          process.env.JWT_SECRET,
          (err, seekerToken) => {
            if (err) throw err;

            const pairing = new PairingSchema({
              lisnerId: selection._id,
              seekerNick: seekerNick,
            });

            pairing
              .save()
              .then((savedDoc) => {
                res.status(200).json({
                  listenerToken: listenerToken,
                  seekerToken: seekerToken,
                  savedDoc,
                });
              })
              .catch((e) => console.log(e));
          }
        );
      }
    );
  });
});
