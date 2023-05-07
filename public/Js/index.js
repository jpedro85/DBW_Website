// addin handler for click button play
document.querySelector("#Btn-play").addEventListener("click" ,() => {
    window.location.href = "/play/Options";
});

// addin handler for click on log in
document.querySelector("#button-login").addEventListener("click" , () => {

    resetLogin();
    openLogin();
});

// defining the redirect after login page
redirect_after_login = "/";
