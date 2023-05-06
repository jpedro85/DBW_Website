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

// send mail with defined transport object
const confirmEmail = function (destinationEmail, emailCode) {
  transporter.sendMail({
    from: '"Khajiit" <khajiit.business@gmail.com>', // sender address
    to: `${destinationEmail}`, // list of receivers
    subject: "Confirm your Email", // Subject line
    text: `${emailCode}`, // plain text body
  });
};

module.exports = confirmEmail;
