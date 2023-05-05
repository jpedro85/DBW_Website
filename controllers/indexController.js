/**
 * The Get and Post functions if needed
 */
const indexController = function (request, response) {
  let isUserLogged = request.isAuthenticated();
  // Check wether the user is logged or not
  if (!isUserLogged) {
    return response.render("index", { isUserLogged: isUserLogged });
  }
  response.render("index", { isUserLogged: isUserLogged });
  // //shows the index.ejs page on web page and use the model to fill dynamically
  // res.render("index");
};

// Export the controller functions
module.exports = indexController;
