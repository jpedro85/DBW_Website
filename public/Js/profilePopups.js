const indexPopupContainer = document.querySelector(".Popup-conteiner");
const confirmEmailPopup = document.querySelector("#Popup-confirmEmailProfile");
const popUpConfirmEmailButton = document.querySelector("#Popup-confirmEmailBttn");
popUpConfirmEmailButton.addEventListener("click", () => {
    indexPopupContainer.classList.remove("active");
    confirmEmailPopup.classList.remove("active");
});

