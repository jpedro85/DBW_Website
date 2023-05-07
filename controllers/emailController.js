// Import nodemailer
const nodemailer = require("nodemailer");
// Import user model form MongoDB
const databaseUser = require("../model/user.model.js");

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
const confirmEmail = async function (destinationEmail, emailCode) {
  await transporter.sendMail({
    from: SMTP_CONFIG.user,
    to: destinationEmail,
    subject: "Please confirm your account",
    html: `<h1>Email Confirmation</h1>
          <h2>Hello</h2>
          <p>Thank you for registering. Please confirm your email by clicking on the following link</p>
          <a href=http://localhost:3000/confirm/${emailCode}> Click here</a>
          </div>`,
  });
};

/**
 * Register the user on mongoDB database with its information
 * and sends a email with url token to confirm the email to able
 * to login
 *
 * @param   {*}  request
 * @param   {*}  response
 *
 **/
const verifyUser = async (request, response, next) => {
  // Searches the database for a user with this confirmation token
  databaseUser
    .findOne({
      confirmationCode: request.params.confirmationCode,
    })
    .then((fetchedUser) => {
      // If doesnt find a user on the Database sends error
      if (!fetchedUser) {
        return response.status(404).send({ message: "User Not found." });
      }
      if (!isAccountActive(fetchedUser.status)) {
        // Changes the status to Active
        fetchedUser.status = "Active";
        // Saves the the changes made to the Database
        //fetchedUser.save();
      }
    })
    .catch((searchingError) => console.error(searchingError));
  response.render("index", { isUserLogged: false });
};

function isAccountActive(userStatus) {
  const confirmedEmail = "Active";
  console.log(userStatus.status);
  return userStatus.status === confirmedEmail;
}

module.exports = { confirmEmail, verifyUser };
