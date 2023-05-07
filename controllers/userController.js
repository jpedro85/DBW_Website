const config = require("../config/smtp");
const databaseUser = require("../model/user.model.js");
const emailController = require("./emailController.js");
const SALTROUNDS=10;

// Importing the package necessary for JSON web token
var jwt = require("jwt-encode");
// Import bcrypt package to hash the password
var bcrypt = require("bcrypt");

const signup = async (userData) => {
    try {
        // Generate the token through json web token
        const token = jwt({ email: userData.email }, config.secret);
      
        const hashedPassword = bcrypt.hashSync(userData.password, SALTROUNDS);
      
        //console.log(hashedPassword);
        // Creates user model thats going to be sent to database
        const newDatabaseUser = new databaseUser({
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          confirmationCode: token,
        });
      
        await newDatabaseUser.save();
        emailController.confirmEmail(newDatabaseUser.email, newDatabaseUser.confirmationCode);
        
    } catch (savingError) {
        console.error(savingError);
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

module.exports = { signup , renderPageWithAuthStatus ,logoutUser};
