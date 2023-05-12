// Importing only the function renderPageWithAuthStatus fromm userController
const {renderPageWithAuthStatus} = require('../controllers/userController.js');

// Function to handler the request
function playGameGet(request, response) {
  renderPageWithAuthStatus(request, response, "playGame", {} ,true);
}

// exporting the handler
module.exports = playGameGet;
