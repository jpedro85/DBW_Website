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
const { signup , logoutUser } = require("../controllers/userController.js");
// Imports confirm email function
const {resendEmail} = require("../controllers/emailController.js")
// Import password and user validation
const {validateObject,is_Username_Invalid, is_Password_Invalid} = require("../controllers/Validations.Controler.js")


/**
 * The GET or POST methods
 */
router.get("/", indexController);

router.post("/", async (request, response, next) => {
  const requestFormType = request.body.formType;
  const wantsToLogin = "login";
  const firstStepRegistration = "register";
  const wantToResendEmail = "resend";
  const wantToLogOut = "logout";
  try {
    // Checks if the post request is a login or registration
    if (wantsToLogin === requestFormType && validateObject(request.body,"username","password")) {

      let responded = false

      /** Authenticates the user session and responds to the request
       * the passport authenticate is called to times so the callback for success is called twice
      */
      passport.authenticate("local",function (error, user, info) {
        
        if (!responded) {

          if (error) {
            response.send({ success : false }); // will generate a 500 error
  
          } else if (!user ) {
             response.send({ success : false, message : info });
  
          } else {
            // Creates the session and logs the user
            request.login(user, loginErr => {
            if (loginErr) {
              return next(loginErr);
            }
            // If correct credentials sends a response thats handled client-side
            response.send({ success : true, message : info });
            });  
  
          }

          responded = true;
        }

      })(request,response,next)
      
    } else if (firstStepRegistration === requestFormType && validateObject(request.body,"username","email","password","repeat_password")) {

      const userRegistrationData = {
        username: request.body.username,
        email: request.body.email,
        password: request.body.password,
      };  

      /*
        the duplication of the username will be resolve after save that
        will cause error and return a response to the request
      */
      validation_result = is_Username_Invalid(request.body.username);
      if (validation_result){
        response.send({
          success : false,
          errortype : "username",
          error : validation_result,
        })

      } else if (request.body.email === "") { // if the email is invalid NODEMAILER will trow an error an another msg will be send
        response.send({
          success : false,
          errortype : "email",
          error : "Email can't be empty.",
        })

      } else {

        validation_result = is_Password_Invalid(request.body.password);
        if (validation_result){
          response.send({
            success : false,
            errortype : "password",
            error : validation_result,
          })

        } else if (request.body.password != request.body.repeat_password){
          response.send({
            success : false,
            errortype : "passwordmatch",
            error : "Passwords don´t match."
         })

        } else {
          // After all verifications saves the user on the dataBase waiting for confirmation
          signup(userRegistrationData, response);
          // Sends a response to the request
        }

      }

  
    }else if (wantToResendEmail === requestFormType && validateObject(request.body,"username")) {
      
      // Handles the post to resend email
      resendEmail(request.body.username,response);

    } else if (wantToLogOut === requestFormType ) {

      logoutUser(request,response,next);

    } else {
      response.send({
        success : false,
        errortype : "other",
        error : "Invalid FormType"
      })
    }
  } catch (formError) {
    // Error Handling
    console.error(formError);
    response.redirect("/");
  }
});

// Export the router
module.exports = router;
