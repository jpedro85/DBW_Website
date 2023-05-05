// Imports the user model from mongoDB
const { model } = require("mongoose");
const databaseUser = require("../model/userModel");

/**
 * Register the user on mongoDB database with its information
 *
 * @param   {*}  request
 * @param   {*}  response
 *
 **/
const registerUserOnMongoDB = async function (request, response) {
  const { email, username, password } = request.body;
  try {
    // Creates a new User
    const user = new databaseUser({ email, username });
    // Saves the data in the database
    await databaseUser.register(user, password);
    // Redirects after all processes to the main page
    response.redirect("/");
  } catch (registerError) {
    console.error(registerError);
  }
};

const logoutUser = function (request, response, next) {
  request.logout(function (logoutError) {
    if (logoutError) {
      return next(logoutError);
    }
    // Destroys the session of the user
    request.session.destroy(function (sessionError) {
      if (sessionError) {
        return next(sessionError);
      }
      // Redirects to the login page
      response.redirect("/");
    });
  });
};

// Exports the functions
model.exports = {
  registerUserOnMongoDB,
  logoutUser,
};
