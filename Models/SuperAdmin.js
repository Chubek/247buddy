require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const mongooseFieldEncryption = require("mongoose-field-encryption")
  .fieldEncryption;
const Schema = mongoose.Schema;
const CryptoJS = require("crypto-js");

const SuperAdminSchema = require({
  userName: {
    type: String,
    default: CryptoJS.AES.encrypt(
      process.env.SUPERADMIN_USER,
      process.env.AES_KEY
    ),
  },
  email: {
    type: String,
    default: CryptoJS.AES.encrypt(
      process.env.SUPERADMIN_EMAIL,
      process.env.AES_KEY
    ),
  },
  password: {
    type: String,
    default: CryptoJS.AES.encrypt(
      process.env.SUPERADMIN_PASSWORD,
      process.env.AES_KEY
    ),
  },
  loginDates: { type: [Date] },  
  adminIdsCreatedBy: { type: [String] }
});

SuperAdminSchema.plugin(mongooseFieldEncryption, {
  fields: ["email", "password", "userName"],
  secret: process.env.MONGOOSE_ENCRYPT_SECRET,
});

module.exports = mongoose.model("SuperAdmin", SuperAdminSchema);
