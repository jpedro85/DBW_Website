// Import nodemailer
const nodemailer = require("nodemailer");

/////////////////////////
/**
 * SMTP set-up
 **/
/////////////////////////

const SMTP_CONFIG = require("../config/smtp.js");

const transporter = nodemailer.createTransport({
  host: SMTP_CONFIG.host,
  port: SMTP_CONFIG.port,
  secure: false,
  auth: {
    user: SMTP_CONFIG.user,
    pass: SMTP_CONFIG.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const randomEmailCode = function () {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const string_length = 8;
  let randomEmailCode = "";
  for (let i = 0; i < string_length; i++) {
    let rnum = Math.floor(Math.random() * chars.length);
    randomEmailCode += chars.substring(rnum, rnum + 1);
  }
  return randomEmailCode;
};

// send mail with defined transport object
const confirmEmail = async function (destinationEmail, emailCode) {
  await transporter.sendMail({
    from: '"Khajiit" <khajiit.business@gmail.com>', // sender address
    to: `${destinationEmail}`, // list of receivers
    subject: "Confirm your Email", // Subject line
    text: `${emailCode}`, // plain text body
  });
};

module.exports = {confirmEmail,randomEmailCode};
