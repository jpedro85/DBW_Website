// Import nodemailer
const nodemailer = require("nodemailer");
// Import user model form MongoDB
const databaseUser = require("../model/user.model.js");

/////////////////////////
/**
 * SMTP set-up
 **/
/////////////////////////

// Imports the Config of our email
const SMTP_CONFIG = require("../config/smtp.js");

// Creates the transport thats going to have the config necessary for nodemailer send the email
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

/**
 * Sends and email to the Destination email to confirm to account
 * @param {String} destinationEmail The email of the destined user
 * @param {String} emailCode JSON web token
 */
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
 * This function resends the email to user
 * @param {String} username The User's username to search through the database
 * @param {*} response
 * 
 * @returns Return a response that contains success:true
 */
const resendEmail = async function (username,response) {
  databaseUser
    .find({ username: username })
    .then((fetchedUser) => {
      if (!fetchedUser) {
        return response.send({ success: false, error:"User not found"});
      }
      confirmEmail(fetchedUser.email, fetchedUser.confirmationCode);
      return response.send({success:true})
    })
    .catch((sendError) =>
      response.send({ success: false, error: `Occurred an error:\n${sendError}`})
    );
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
        fetchedUser.save();
        // Response in case user is not active
        response.render("index");
      }
    })
    .catch((searchingError) => console.error(searchingError));
};

/**
 * This function serves to see if and account is currently
 * active or in pending status
 *
 * @param {String} userStatus The status of the user in the database
 *
 * @returns {Boolean} A boolean saying if the account is active or pending
 */
function isAccountActive(userStatus) {
  const confirmedEmail = "Active";
  console.log(userStatus.status);
  return userStatus.status === confirmedEmail;
}

module.exports = { confirmEmail, verifyUser , resendEmail};
