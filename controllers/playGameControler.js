// Importing only the function renderPageWithAuthStatus fromm userController
const {renderPageWithAuthStatus} = require('../controllers/userController.js');
// Importing 
const { AllPrivateMatches , getMatchByCode } = require("../controllers/playOtionsControler.js");

// // Function to handler the request
// function playGameGet(req, res) {
//   renderPageWithAuthStatus(req, res, "playGame", {} ,true);
// }

// Function to handler the request
function playGameGetMatch(req, res) {
  renderPageWithAuthStatus(req, res, "playGame", { req , match: getMatchByCode(req.matchCode) } ,true);
}



// exporting the handler
module.exports = {playGameGetMatch};
