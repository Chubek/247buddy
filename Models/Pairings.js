const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PairingSchema = new Schema({
  listenerId: String,
  seekerNick: String,
  category: String,
  seekerReason: String,
  sessionDate: {
    type: Date,
    default: Date.now,
  },
  startHour: String,
  endHour: String,
  report: {
    reportedBy: String,
    reportedMessage: String,
    reportResult: String,
  },
});

module.exports = mongoose.model("Pairing", PairingSchema);
