// adding handler for click button play
const btnPlay = document.querySelector("#Btn-play_loged") 
if (btnPlay != null) {
    btnPlay.addEventListener("click" ,() => {
        window.location.href = "/play/Options";
    });
}

const btnPlay_notLoged = document.querySelector("#Btn-play_not_loged") 
if (btnPlay_notLoged != null) {
    btnPlay_notLoged.addEventListener("click" ,() => {
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

// adding handler for click on log in on text
const btn_link_playnow = document.querySelector("#btn-link-playnow") 
if (btn_link_playnow != null) {
    btn_link_playnow.addEventListener("click" ,() => {
        window.location.href = "/play/Options";
    });
}

// adding handler for click on log in on text
const btn_link_login = document.querySelector("#btn-link-login") 
if (btn_link_login != null) {
    btn_link_login.addEventListener("click" ,() => {
        // this functions are implemented in Log_in_out_popups.js
        resetLogin();
        openLogin();
    });
}

// adding handler for click on log in on text
const btn_link_create= document.querySelector("#btn-link-create") 
if (btn_link_create != null) {
    btn_link_create.addEventListener("click" ,() => {
        // this functions are implemented in Log_in_out_popups.js
        resetSingUp();
        openSingUp();
    });
}

// defining the redirect after login page
redirect_after_login = "/";
