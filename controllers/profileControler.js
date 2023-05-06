const { renderPageWithAuthStatus } = require("../controllers/userController.js");
// creating the profile handler
const profileControler = function profileControler( req , res) {
    renderPageWithAuthStatus(req,res,"profile");
}

// exporting the handler
module.exports = profileControler;