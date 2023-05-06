function plyaRedirect() {
    window.location.href = "/play/Options";
}


const logIn = document.querySelector("#button-login");
const Popup_creatAcount = document.querySelector("#Popup-creatAcount");
const Popup_AcountCreated = document.querySelector("#Popup-AcountCreated");


/* OverLays */

const poppupLogin = document.querySelector("#Popup-Login")
const conteiner = document.querySelector(".Popup-conteiner")

logIn.addEventListener("click" , () => {
    poppupLogin.classList.toggle("active");
    conteiner.classList.toggle("active");
})


// adding handler for Popup-Login-Signup-Button
document.querySelector("#Popup-Login-Signup-Button").addEventListener("click" , () => {
    poppupLogin.classList.remove("active");
    Popup_creatAcount.classList.toggle("active");
    //activeting the closing on outside of the overlay click 
    OverlayCloseActive = true;
})


// adding handler for Popup-Login-Signin-Button
document.querySelector("#Popup-creatAcoun-Signin-Button").addEventListener("click" , () => {
    Popup_creatAcount.classList.remove("active");
    poppupLogin.classList.toggle("active");
    //activeting the closing on outside of the overlay click 
    OverlayCloseActive = true;
})

// adding handler for Popup-creatAcount-next
const Popup_confirmEmail = document.querySelector("#Popup-confirmEmail")
document.querySelector("#Popup-creatAcount-next").addEventListener("click" , () => {
    Popup_confirmEmail.classList.toggle("active");
    Popup_creatAcount.classList.remove("active");
    //desactivating the closing on outside of the overlay click 
    OverlayCloseActive = false;
})

// adding handler for paste function on confirmEmail
document.querySelector("#Popup-confirmEmail-PasteCode").addEventListener("click",async () => {
    document.querySelector("#Popup-confirmEmail-PasteCode-input").value = await navigator.clipboard.readText();
})

// adding handler for confirmEmail
document.querySelector("#Signup-Confirm-Email").addEventListener("click" , () => {
    Popup_AcountCreated.classList.toggle("active");
    Popup_confirmEmail.classList.remove("active");
})


// adding handler for continuing button
document.querySelector("#AcountCreated-continue").addEventListener("click" , () => {
    Popup_AcountCreated.classList.remove("active");
    conteiner.classList.remove("active");
})

