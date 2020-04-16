require("dotenv").config({ path: "../.env" });
const router = require("express").Router();
const ListenerSchema = require("../Models/Listener");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const PairingSchema = require("../Models/Pairings");
const SeekerAuth = require("../Middleware/SeekerAuth");
const auths = { SeekerAuth, ListenerAuth };

router.post("/pairup/randomly", (req, res) => {
  const seekerNumber = req.body.seekerNumber;

  ListenerSchema.find({
    "status.online": true,
    "status.currentEngagedSessionId": "None",
    categories: { $in: ["General"] },
  }).then((listenerDocs) => {
    listenerDocs = _.shuffle(listenerDocs);
    const selection = listenerDocs[_.random(0, listenerDocs.length - 1)];

    jwt.sign(
      { id: selection._id },
      process.env.JWT_SECRET,
      (err, listenerToken) => {
        if (err) throw err;
        jwt.sign(
          { number: seekerNumber },
          process.env.JWT_SECRET,
          (err, seekerToken) => {
            if (err) throw err;

            const pairing = new PairingSchema({
              lisnerId: selection._id,
              seekerNumber: seekerNumber,
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

router.post("/pairup/category", (req, res) => {
  const seekerNumber = req.body.seekerNumber;
  const categories = req.body.categories;

  ListenerSchema.find({
    "status.online": true,
    "status.currentEngagedSessionId": "None",
    categories: { $in: categories },
  }).then((listenerDocs) => {
    listenerDocs = _.shuffle(listenerDocs);
    const selection = listenerDocs[_.random(0, listenerDocs.length - 1)];

    jwt.sign(
      { id: selection._id },
      process.env.JWT_SECRET,
      (err, listenerToken) => {
        if (err) throw err;
        jwt.sign(
          { number: seekerNumber },
          process.env.JWT_SECRET,
          (err, seekerToken) => {
            if (err) throw err;

            const pairing = new PairingSchema({
              lisnerId: selection._id,
              seekerNumber: seekerNumber,
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

router.put("/disconnect", ListenerAuth, (req, res) => {
  const listenerId = req.listener.id;
  const sessionId = req.body.sessionId;

  ListenerSchema.findOne({ _id: listenerId })
    .then((listenerDoc) => {
      ListenerSchema.findOneAndUpdate(
        { _id: listenerId },
        {
          "status.currentEngagedSessionId": "None",
          $addToSet: { sessionIds: listenerDoc.status.currentEngagedSessionId },
        }
      )
        .then(() => {
          PairingSchema.findOneAndUpdate(
            { _id: sessionId },
            { seekerNumber: null }
          )
            .then(() => res.status(200).json({ disconnected: true }))
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    })
    .catch((e) => console.log(e));
});

router.put(
  "/report/by/seeker",
  [auths.ListenerAuth, auths.SeekerAuth],
  (req, res) => {
    const listenerId = req.listener.id;
    const seekerNumber = req.body.seekerNumber;
    const sessionId = req.body.sessionId;
    const message = req.body.message;

    PairingSchema.findOneAndUpdate(
      { _id: sessionId },
      {
        "report.reportedBy": seekerNumber,
        "report.reportedEntity": listenerId,
        "report.reportedMessage": message,
      }
    )
      .then(() => {
        ListenerSchema.findOneAndUpdate(
          { _id: listenerId },
          {
            $push: {
              reportedBySeekers: {
                sessionId: sessionId,
                reporterNumber: seekerNumber,
                reportedMessage: message,
                reportDate: new Date(),
              },
            },
          }
        )
          .then(() => res.status(200).json({ reported: true }))
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  }
);

router.put(
  "/report/by/listener",
  [auths.ListenerAuth, auths.SeekerAuth],
  (req, res) => {
    const listenerId = req.listener.id;
    const seekerNumber = req.body.seekerNumber;
    const sessionId = req.body.sessionId;
    const message = req.body.message;

    PairingSchema.findOneAndUpdate(
      { _id: sessionId },
      {
        "report.reportedBy": listenerId,
        "report.reportedEntity": seekerNumber,
        "report.reportedMessage": message,
      }
    )
      .then(() => {
        ListenerSchema.findOneAndUpdate(
          { _id: listenerId },
          {
            $push: {
              infractionsReported: {
                sessionId: sessionId,
                reporterNumber: seekerNumber,
                reportedMessage: message,
                reportDate: new Date(),
              },
            },
          }
        )
          .then(() => res.status(200).json({ reported: true }))
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  }
);

router.get("/get/all", (req, res) => {
  PairingSchema.find({})
    .then((sessionDocs) => res.status(200).json({ sessionDocs }))
    .catch((e) => console.log(e));
});

router.get("/get/single/:sessionid", (req, res) => {
  PairingSchema.findOne({ _id: req.params.sessionid })
    .then((sessionDoc) => res.status(200).json({ sessionDoc }))
    .catch((e) => console.log(e));
});
