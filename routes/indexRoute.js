/**
 * This file is going to render and add new info to the ejs file
 *  each time we do a request on the URL
 */
const router = require("express").Router();
// Import the functions from controller file
const indexController = require("../controllers/indexController");
const userController = require("../controllers/userController");
const passport = require("passport");
const databaseUser = require("../model/userModel");
const emailController = require("../controllers/emailController.js");
const confirmEmail = require("../controllers/emailController.js");

/**
 * The GET or POST methods
 */
router.get("/", indexController);

let userRegistrationData;
router.post("/", async (request, response, next) => {
  const requestFormType = request.body.formType;
  const wantsToLogin = "login";
  const firstStepRegistration= "firstStep";
  const secondStepRegistration= "secondStep";
  const wantsToRegister = "register";
  try {
    // Checks if the post request is a login or registration
    if (wantsToLogin === requestFormType) {
      // Authenticates the user if not valid do ... if valid renders page while logged
      passport.authenticate(
        "local",
        { failureRedirect: "/about-us" },
        response.render("index", { isUserLogged: true })
      )(request, response, next);
    } else if (firstStepRegistration === requestFormType) {
      // Will try to to authenticate the user login with the database
      //userController.registerUserOnMongoDB;
      userRegistrationData=request.body;
      userRegistrationData.emailCode = "asd";
      for (let index = 0; index < 100; index++) {
      }
      await confirmEmail(userRegistrationData.signup_email , userRegistrationData.emailCode);
    }else if (secondStepRegistration===requestFormType) {
      // Will verify if code is correct
      const { emailCode } = request.body;
      if (emailCode===userRegistrationData.emailCode) {
        console.log(emailCode===userRegistrationData.emailCode);
      }
    }else {
      console.log("Invalid formType");
    }
  } catch (error) {
    console.error(error);
    response.redirect("/");
  }
});


// Export the router
module.exports = router;
