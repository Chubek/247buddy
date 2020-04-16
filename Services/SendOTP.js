require("dotenv").config({ path: "../.env" });
const axios = require("axios");

const { OTP_API_KEY } = process.env;

function sendOTP(otp, number) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://2factor.in/API/V1/${OTP_API_KEY}/SMS/+91${number}/${otp}`)
      .then((res) => {
        resolve("SMS Sent.");
        console.log(res);
      })
      .catch((e) => {
        reject(e);
        console.error(e);
      });
  });
}

module.exports = sendOTP;
