const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlockedNumbersSchema = Schema({
  blockedNumber: {
    type: String,
    unique: true,
  },
  dateBlocked: {
    type: Date,
    default: Date.now,
  },
  reportedMessage: String,
});

module.exports = mongoose.model("BlockedNumber", BlockedNumbersSchema);
