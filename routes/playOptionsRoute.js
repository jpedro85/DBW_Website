// importing express router
const router = require("express").Router();

// importing playOptionsControler
const{ playOption_JoinMatch , playOption_CreateMatch, playOptionsControler } = require("../controllers/playOtionsControler");

// add the route and defining the handler for that request
router.get("/play/Options", playOptionsControler);

router.post("/play/Options",  (req ,res ) => {

    if( req.body.formtype === "create" ){    
        playOption_CreateMatch(req,res)

    }else if ( req.body.formtype === "join" ){
        playOption_JoinMatch(req,res);

    }else
        res.send({success: false , errortype : "other" , error: "Invalid form submitted on request. Form type was not set." });

});

//exporting the router
module.exports = router;
