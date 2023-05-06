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

/**
 * The GET or POST methods
 */
router.get("/", indexController);

router.post("/", (request, response, next) => {
  const requestFormType = request.body.formType;
  const wantsToLogin = "login";
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
    } else if (wantsToRegister === requestFormType) {
      // Will try to to authenticate the user login with the database
      userController.registerUserOnMongoDB;
    } else {
      console.log("Invalid formType");
    }
  } catch (error) {
    console.error(error);
    response.redirect("/");
  }
});

// Export the router
module.exports = router;
