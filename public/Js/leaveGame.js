//buttao de test, para dar popup ao primeiro menu
const leaveButtonPopUp=document.querySelector("#test")

const conteiner = document.querySelector(".Popup-conteiner")
const leavePopup = document.querySelector("#Popup-Leave")

const leaveConfirmButton = document.querySelector("#cont-Leave-Popup")
const leavePopupCont = document.querySelector("#Popup-Leave-cont")

const closeLeavePopUp = document.querySelector("#close-Leave-Popup")

//opens leave menu when pressed leaveButtonPopup
leaveButtonPopUp.addEventListener("click",()=>{
    conteiner.classList.toggle("active");
    leavePopup.classList.toggle("active");
})

//opens leave confirm menu and close previous menu
leaveConfirmButton.addEventListener("click",()=>{
    leavePopup.classList.remove("active");
    leavePopupCont.classList.toggle("active");
})

//closes leave menu
closeLeavePopUp.addEventListener("click",()=>{
    conteiner.classList.remove("active");
    leavePopup.classList.remove("active");
})