/**
 * This file is going to render and add new info to the ejs file
 *  each time we do a request on the URL
 */
const router= require("express").Router();
// Import the functions from controller file
const indexController = require("../controllers/indexController");

/**
 * The GET or POST methods
 */
router.get("/",indexController);

// Export the router
module.exports= router;