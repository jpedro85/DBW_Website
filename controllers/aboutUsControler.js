/**
 * The Get and Post functions if needed
 */
const aboutUsController = function (request, response) {
  let isUserLogged = request.isAuthenticated();
  // Check wether the user is logged or not
  if (!isUserLogged) {
    return response.render("aboutUs", { isUserLogged: isUserLogged });
  }
  //shows the aboutUs.ejs page on web page and use the model to fill dynamically
  response.render("aboutUs", { isUserLogged: isUserLogged });
};

// Export the controller functions
module.exports = aboutUsController;
