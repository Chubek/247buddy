require("dotenv").config({ path: "../.env" });
var nodemailer = require("nodemailer");

function sendMail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "chubakbidpaa@gmail.com",
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: "youremail@gmail.com",
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.error("Email sent: " + info.response);
    }
  });
}

module.exports = sendMail;
