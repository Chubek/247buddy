require("dotenv");
const mongoose = require("mongoose");
const mongooseFieldEncryption = require("mongoose-field-encryption")
  .fieldEncryption;
const Schema = mongoose.Schema;

const ListenrSchema = new Schema({
  userName: {
    type: String,
    unique: true,
  },
  dateRegistered: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  approvedStatus: {
    type: Boolean,
    approvalDate: Date,
  },
  avatar: {
    src: String,
    sha256: String,
  },
  categories: {
    minLength: 3,
    categoriesArray: [],
  },
  infractionsReported: [
    {
      sessionId: String,
      reportedNumber: String,
      reportReason: String,
      reportResult: String,
      reportDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  reportedBySeekers: [
    {
      sessionId: String,
      reporterNumber: String,
      reportReason: String,
      reportResult: String,
      reportDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  bannedStatus: {
    banned: Boolean,
    banDate: Date,
    expireDate: Date,
    formerBans: [],
  },
  sessionIds: [String],
  stati: {
    currentEngagedSessionId: String, //if disengaged, will be "None"
    online: Boolean,
  },
});

ListenrSchema.plugin(mongooseFieldEncryption, {
  fields: ["email"],
  secret: process.env.MONGOOSE_ENCRYPT_SECRET,
});

module.exports = mongoose.model("Listener", ListenrSchema);
