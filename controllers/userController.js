// Imports the user model from mongoDB
const databaseUser = require("../model/userModel");

/**
 * Register the user on mongoDB database with its information
 *
 * @param   {*}  request
 * @param   {*}  response
 *
 **/
const registerUserOnMongoDB = async function (request, response) {
  const { signup_username, signup_email, signup_password } = request.body;
  try {
    // Creates a new User
    const user = new databaseUser({
      email: signup_email,
      username: signup_username,
    });
    // Saves the data in the database
    await databaseUser.register(user, signup_password);
    // Redirects after all processes to the main page
    response.redirect("/");
  } catch (registerError) {
    console.error(registerError);
    response.redirect("/");
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

/**
 * This is an auxiliary function to remove the duplication of the verification 
 * of the user whether is logged or not to show the corresponding navbar
 *
 * @param   {[type]}  request  
 * @param   {[type]}  response  
 * @param   {String}  page      this parameter is going to be the page you want to render. Generally a String
 *
 * @return  {[type]}            Renders the page you choose with its corresponding navBar
 */
const renderPageWithAuthStatus = function(request, response, page) {
  // Check wether the user is logged or not
  const isUserLogged = request.isAuthenticated();
  //shows the ejs page on the site and use the model to fill dynamically
  response.render(page, { isUserLogged: isUserLogged });
}

// Exports the functions
module.exports = { registerUserOnMongoDB, logoutUser, renderPageWithAuthStatus };
