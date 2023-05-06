// Importing only the function renderPageWithAuthStatus fromm userController
const {renderPageWithAuthStatus} = require("../controllers/userController.js");

// functionn to handler the request
const playOptionsControler = function playOptionsControler(request, response) {
  renderPageWithAuthStatus(request, response, "playOptions");
};

//exporting the router the handler
module.exports = playOptionsControler;
