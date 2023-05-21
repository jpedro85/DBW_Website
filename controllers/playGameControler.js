// Importing only the function renderPageWithAuthStatus fromm userController
const {renderPageWithAuthStatus} = require('../controllers/userController.js');
// Importing 
const { AllPrivateMatches , getMatchByCode } = require("../controllers/playOtionsControler.js");
// import functions to validate form 
const { validateEnum ,validateObject } = require("../controllers/Validations.Controler.js")

// // Function to handler the request
// function playGameGet(req, res) {
//   renderPageWithAuthStatus(req, res, "playGame", {} ,true);
// }

// Function to handler the request
function playGameGetMatch(req, res) {
  renderPageWithAuthStatus(req, res, "playGame", { player: null ,req , match: getMatchByCode(req.params.matchCode) } ,true);
}

function Post_playGameGetMatch_handler(req, res) {

    if(validateObject(req.body,"formtype")) {

      if(validateEnum(req.body.formtype,"abandon","start","")){


        if( req.body.formtype === "abandon" ){

          let match = getMatchByCode(req.params.matchCode);
          if(match) {
              
            match.playerAbandon(req.user)
            res.redirect("/play/Options");

          } else
            res.send({success: false , errortype : "other" , error: "Cannot find any match with the code: " + req.params.matchCode });
        
        } else if ( req.body.formtype === "start" ){

          let match = getMatchByCode(req.params.matchCode);
          if(match) {
            
            match.start();
            res.send({success:true})

          } else
            res.send({success: false , errortype : "other" , error: "Cannot find any match with the code: " + req.params.matchCode });

        }
          

      }

    }

}


// exporting the handler
module.exports = {playGameGetMatch,Post_playGameGetMatch_handler};
