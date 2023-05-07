/**
 * This file is going to render and add new info to the ejs file
 *  each time we do a request on the URL
 */
const router = require("express").Router();
// Import the functions from controller file
const indexController = require("../controllers/indexController");
// Import passport so we can use the authenticate function
const passport = require("passport");
// Imports the signup function
const { signup } = require("../controllers/userController.js");
// Imports confirm email function
const {resendEmail} = require("../controllers/emailController.js")

/**
 * The GET or POST methods
 */
router.get("/", indexController);

router.post("/", async (request, response, next) => {
  const requestFormType = request.body.formType;
  const wantsToLogin = "login";
  const firstStepRegistration = "register";
  const wantToResendEmail = "resend"
  try {
    // Checks if the post request is a login or registration
    if (wantsToLogin === requestFormType) {
      /**
       * Server side verification
       **/

      /** Authenticates the user session and responds to the request
       * if not valid do ... if valid redirect to "/"
       **/
      //passport.authenticate("local",{successRedirect:"/"})(request,response,next);
      passport.authenticate("local",function (error, user, info) {
        if (error) {
          return next(error); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (! user) {
          return response.send({ success : false, message : info });
        }
        // Creates the session and logs the user
        request.login(user, loginErr => {
          if (loginErr) {
            return next(loginErr);
          }
          // If correct credentials sends a response thats handled client-side
          response.send({ success : true, message : info });
        });      
      })(request,response,next)
    } else if (firstStepRegistration === requestFormType) {
      const userRegistrationData = {
        username: request.body.signup_username,
        email: request.body.signup_email,
        password: request.body.signup_password,
      };
      /**
       * Server side verification
       */
      // After all verifications saves the user on the dataBase waiting for confirmation
      signup(userRegistrationData, response);
      // Sends a response to the request
      // For now is rendering the page
      //response.render("index", { isUserLogged: false });
    }else if (wantToResendEmail === requestFormType) {
      /**
       * Handles the post to resend email
       **/
      resendEmail(request.body.username,response);
    } else {
      throw new Error("Invalid FormType");
    }
  } catch (formError) {
    // Error Handling
    console.error(formError);
    response.redirect("/");
  }
});

// Export the router
module.exports = router;
