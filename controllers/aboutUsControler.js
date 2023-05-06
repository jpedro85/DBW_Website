// Importing only the function renderPageWithAuthStatus fromm userController
const {renderPageWithAuthStatus} = require("../controllers/userController.js");

/**
 * The Get and Post functions if needed
 */
const aboutUsController = function (request, response) {
  renderPageWithAuthStatus(request, response, "aboutUS");
};

// Export the controller functions
module.exports = aboutUsController;
