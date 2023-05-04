/**
 * This file is going to render and add new info to the ejs file
 *  each time we do a request on the URL
 */
const router = require("express").Router();
// Import the functions from controller file
const aboutUsController = require("../controllers/aboutUsControler");

/**
 * The GET or POST methods
 */
router.get("/about-us",aboutUsController);

// Export the router
module.exports= router;