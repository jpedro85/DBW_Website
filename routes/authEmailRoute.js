const router = require("express").Router();
// Importing the Controller functions
const { verifyUser } = require('../controllers/emailController');

// Get that will verify the user account
router.get("/confirm/:confirmationCode", verifyUser);

module.exports= router;
