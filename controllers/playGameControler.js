// Function to handler the request
function playGameGet(request, response) {
  let isUserLogged = request.isAuthenticated();
  // Check wether the user is logged or not
  if (!isUserLogged) {
    return response.render("playGame");
  }
  response.render("playGame");
}

// exporting the handler
module.exports = playGameGet;
