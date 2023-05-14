// inporting router
const router = require("express").Router();
// importing the handler for this page
const {playGameGet} = require("../controllers/playGameControler");

// adding the route
router.get("/play/Game",playGameGet);

//exporting the router
module.exports = router;


