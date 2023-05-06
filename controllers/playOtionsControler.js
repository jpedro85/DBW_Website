// functionn to handler the request
const playOptionsControler = function playOptionsControler (request ,response) {
    let isUserLogged = request.isAuthenticated();
    // Check wether the user is logged or not
    if (!isUserLogged) {
      return response.render("playGame", { isUserLogged: isUserLogged });
    }
    response.render("playOptions");
}

//exporting the router the handler
module.exports = playOptionsControler;