// inporting router
const router = require("express").Router();
// importing the handler for this page
const {playGameGetMatch} = require("../controllers/playGameControler");

// // adding the route
// router.get("/play/Game/",playGameGet)

router.get("/play/Game/:matchCode",playGameGetMatch);

//exporting the router
module.exports = router;


