// inporting router
const router = require("express").Router();
// importing the handler for this page
const playGameControler = require("../controllers/playGameControler");

// adding the route
router.get("/play/Game",playGameControler);

//exporting the router
module.exports = router;


