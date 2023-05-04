//importing router
const router = require("express").Router();
//importing the handler
const profileControler = require("../controllers/profileControler.js");
// adding the route
router.get("/Profile",profileControler);
//exporting router
module.exports = router;