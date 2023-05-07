// addin handler for click button play
document.querySelector("#Btn-play").addEventListener("click" ,() => {
    window.location.href = "/play/Options";
});


// addin handler for click on log in
const button_login = document.querySelector("#button-login")
if ( button_login != null ) {
    button_login.addEventListener("click" , () => {
        // this functions are implemented in Log_in_out_popups.js
        resetLogin();
        openLogin();
    });
}


// const button_logup = document.querySelector("#button-login")
// if ( button_login != null ) {
//     button_login.addEventListener("click" , () => {

//         resetLogin();
//         openLogin();
//     });
// }

// defining the redirect after login page
redirect_after_login = "/";
