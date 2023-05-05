/**
 * This file is going to render and add new info to the ejs file
 *  each time we do a request on the URL
 */
const router = require("express").Router();
// Import the functions from controller file
const indexController = require("../controllers/indexController");
const userController = require("../controllers/userController");
const passport = require("passport");

/**
 * The GET or POST methods
 */
router.get("/", indexController);

// router.post("/", userController.registerUserOnMongoDB);
router.post(
  "/",
  passport.authenticate("local", { failureRedirect: "/about-us" }),
  function (req, res) {
    res.render("index", { isUserLogged: true });
  }
);

// Export the router
module.exports = router;
