// addin handler for click on log in
document.querySelector("#button-login").addEventListener("click" , () => {

    resetLogin();
    openLogin();
})

redirect_after_login = "/about-us";