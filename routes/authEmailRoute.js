const router = require("express").Router();
// Importing the Controller functions
const controller = require('../controllers/emailController');

// Get that will verify the user account
router.get("/confirm/:confirmationCode", controller.verifyUser);

module.exports= router;
