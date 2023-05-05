// Function to handler the request
function playGameGet(request,response) {
    let isUserLogged= request.isAuthenticated();
    // Check wether the user is logged or not
    if (!isUserLogged) {
        console.log("Nop, não tem acesso!");
        return response.redirect("playGame",{isUserLogged: isUserLogged});
      }
      response.render("playGame",isUserLogged);
}

// exporting the handler
module.exports = playGameGet;