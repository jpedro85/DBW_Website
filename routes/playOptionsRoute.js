// importing express router
const router = require("express").Router();

// importing playOptionsControler
const playOptionsControler = require("../controllers/playOtionsControler");

// add the route and defining the handler for that request
router.get("/play/Options", playOptionsControler);

//exporting the router
module.exports = router;
