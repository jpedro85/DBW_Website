// adding handler for click button play
const btnPlay = document.querySelector("#Btn-play") 
if (btnPlay != null) {
    btnPlay.addEventListener("click" ,() => {
        window.location.href = "/play/Options";
    });
}

const btnPlay2 = document.querySelector("#Btn-play2") 
if (btnPlay2 != null) {
    btnPlay2.addEventListener("click" ,() => {
        // this functions are implemented in Log_in_out_popups.js
        resetLogin();
        openLogin();
    });
}

// adding handler for click on log in
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
