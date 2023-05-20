//importing router
const router = require("express").Router();
//importing the handler
const {profileController, updateUsername} = require("../controllers/profileControler.js");

// adding the route
router.get("/Profile",profileController);
router.post("/Profile", updateUsername)

//exporting router
module.exports = router;
