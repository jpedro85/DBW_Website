// Importing only the function renderPageWithAuthStatus fromm userController
const {renderPageWithAuthStatus} = require('../controllers/userController.js');

// Function to handler the request
function playGameGet(req, res) {
  renderPageWithAuthStatus(req, res, "playGame", {} ,true);
}

// exporting the handler
module.exports = {playGameGet};
