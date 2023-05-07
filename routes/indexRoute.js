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
const {signup} = require("../controllers/userController.js");

/**
 * The GET or POST methods
 */
router.get("/", indexController);

router.post("/", passport.authenticate("local") , async (request, response, next) => {
  const requestFormType = request.body.formType;
  const wantsToLogin = "login";
  const firstStepRegistration = "firstStep";
  const secondStepRegistration = "secondStep";
  try {
    // Checks if the post request is a login or registration
    if (wantsToLogin === requestFormType) {
       /**
       * Server side verification
       **/

      // Authenticates the user session and responds to the request
      passport.authenticate("local", response.send("Hello"))(request,response,next);

      // Authenticates the user if not valid do ... if valid renders page while logged
      // passport.authenticate("local",response.render("index", { isUserLogged: true })
      // )(request, response, next);
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
      signup(userRegistrationData);
      // Sends a response to the request
      // For now is rendering the page
      response.render("index", {isUserLogged:true});
    }
    else{
      throw new Error("Invalid FormType")
    }
  } catch (formError) {
    console.error(formError);
    response.redirect("/");
  }
});

// Export the router
module.exports = router;
