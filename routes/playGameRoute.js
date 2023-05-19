// inporting router
const router = require("express").Router();
// importing the handler for this page
const {Post_playGameGetMatch_handler,playGameGetMatch} = require("../controllers/playGameControler");

// // adding the route
// router.get("/play/Game/",playGameGet)

router.get("/play/Game/:matchCode",playGameGetMatch);

router.post("/play/Game/:matchCode",Post_playGameGetMatch_handler)

//exporting the router
module.exports = router;


