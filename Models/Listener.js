require("dotenv").config({ path: "../.env" });
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
  approvalStatus: {
    approved: {
      type: Boolean,
      default: false,
    },
    approvalDate: Date,
    approvalCode: Number,
  },
  activationStatus: {
    active: {
      type: Boolean,
      default: true,
    },
    deactivationDate: Date,
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
      reportmessage: String,
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
      reportmessage: String,
      reportDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  bannedStatus: {
    banDate: Date,
    expireDate: Date,
    formerBans: Array,
  },
  sessionIds: [String],
  status: {
    currentEngagedSessionId: String, //if disengaged, will be "None"
    online: Boolean,
  },
});

ListenrSchema.plugin(mongooseFieldEncryption, {
  fields: ["email"],
  secret: process.env.MONGOOSE_ENCRYPT_SECRET,
});

module.exports = mongoose.model("Listener", ListenrSchema);
