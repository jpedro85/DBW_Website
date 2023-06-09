// Importing only the function renderPageWithAuthStatus fromm userController
const {renderPageWithAuthStatus} = require("../controllers/userController.js");

/**
 * The Get and Post functions if needed
 */
const indexController = function (request, response) {
  renderPageWithAuthStatus(request, response, "index" , {showAccountCreated : false , confirmstate : false , showIndexOnUnauthenticated : false , page : "debugOnlyText", changeOnProfile :false} , false);
};

// Export the controller functions
module.exports = indexController;
