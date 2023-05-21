const config = require("../config/smtp");
const databaseUser = require("../model/user.model.js");
const databaseUserMetrics = require("../model/metrics.model.js");
const {sendConfirmEmail, isAccountActive } = require("../controllers/emailController");
const verifications = require("./Validations.Controler.js");

const SALTROUNDS = 10;

// Importing the package necessary for JSON web token
var jwt = require("jwt-encode");
// Import bcrypt package to hash the password
var bcrypt = require("bcrypt");

/**
 * Signup is function that going to create the user and save it on database with
 * a confirmation token thats JSON web token thats unique
 *
 * @param {Object} userData The info of the user that wants to register
 * @param {String} userData.username Users username
 * @param {String} userData.email Users email 
 * @param {String} userData.password  Users plaintext password
 **/
const signup = async (userData, response) => {
  try {
    // Generate the token through json web token
    const token = jwt({ email: userData.email }, config.secret);

    // Converts the plaintext password to hashed password
    const hashedPassword = bcrypt.hashSync(userData.password, SALTROUNDS);

    // Creates user model thats going to be sent to database
    const newDatabaseUser = new databaseUser({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      confirmationCode: token,
    });

    const newUserMetrics = new databaseUserMetrics({
      username: userData.username,
    });
  
    await newDatabaseUser.save()
    await newUserMetrics.save()
    sendConfirmEmail( newDatabaseUser.email , newDatabaseUser.confirmationCode )
    .then( async (semError) => {
      if (semError != true){
        response.send({
          success: false,
          username : userData.username,
          email: userData.email,
          errortype: "email",
          error: "Invalid email",
        });

        databaseUser.deleteOne({ email : newDatabaseUser.email }).catch( (error) => console.log(error) );

      } else {
        response.send({
          success: true,
          username: userData.username,
          email: userData.email,
        }); 
      }
    })
   
  } catch (savingError) {

    // If its username duplicate
    const duplicatedUsername = savingError.keyPattern.hasOwnProperty("username");

    // If its email duplicate
    const duplicateEmail = savingError.keyPattern.hasOwnProperty("email");
    if (duplicatedUsername) {
      response.send({
        success: false,
        errortype: "username",
        error: "Username already in use !",
      });
    } else if (duplicateEmail) {
      databaseUser
        .findOne({ email: userData.email })
        .then((fetchedUser) => {
          if (!fetchedUser) {
            throw new Error("Not found");
          } else {
            if (isAccountActive(fetchedUser.status)) {
              response.send({
                success: false,
                username : fetchedUser.username,
                email: userData.email,
                errortype: "emailInUse",
                error: "Email already in use.",
              });
            } else {
              response.send({
                success: false,
                username : fetchedUser.username,
                email: userData.email,
                errortype: "acountPending",
                error: "Account is not active.",
              });
            }
          }
        })
        .catch((error) => {
          response.send({
            success: false,
            email: userData.email,
            errortype: "other",
            error: "Server error:" + error,
          });
        });
    } else {
      console.error(savingError);

      response.send({
        success: false,
        email: userData.email,
        errortype: "other",
        error: savingError,
      });
    }
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
 * of the user whether is logged or not to show the correct page or show index if showIndexOnUnauthenticated and the user is not logged
 *
 * @param   {request} request                     request
 * @param   {response} response                    response
 * @param   {String}  page                       page to render
 * @param   {Object}  pageInfo                    default is empty isUserLogged property is added internally
 * @param   {Boolean}  showIndexOnUnauthenticated  showIndex if user not authenticated 
 *
 * @return  {response}                              Renders the page you choose
 */
const renderPageWithAuthStatus = function (request, response, page, pageInfo={} , showIndexOnUnauthenticated=false  ) {
  // Check wether the user is logged or not
  const isUserLogged = request.isAuthenticated();
  pageInfo["isUserLogged"] = isUserLogged;

  //shows the ejs page on the site and use the model to fill dynamically
  if (!isUserLogged && showIndexOnUnauthenticated)
    return response.render("index", { isUserLogged: isUserLogged , showAcountCreated : false , confirmstate : false , showIndexOnUnauthenticated , page} );
  else{
    //console.log(pageInfo); 
    return response.render( page , pageInfo );
  }
};

module.exports = { signup, renderPageWithAuthStatus, logoutUser };
