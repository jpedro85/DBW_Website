const conteiner = document.querySelector(".Popup-conteiner");
const Popup_ErroPopUp = document.querySelector("#Popup-FetchError");
const FetchError_error = document.querySelector("#FetchError-error");

function showError (Msg){

    closeAllPopUps();

    FetchError_error.innerText = Msg;
    Popup_ErroPopUp.classList.add("active");
    conteiner.classList.add("active");
}

// show error continue handler
document.querySelector("#FetchError-continue").addEventListener("click" , () => {
    Popup_ErroPopUp.classList.remove("active");
    conteiner.classList.remove("active");
});