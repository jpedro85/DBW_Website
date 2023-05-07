const editPic=document.querySelector("#Edit-picture");
const editName=document.querySelector("#Edit-Name");
const editEmail=document.querySelector("#Edit-Email");


const conteiner = document.querySelector(".Popup-conteiner")
const ImgPopup = document.querySelector("#Popup-Image")
const NamePopup = document.querySelector("#Popup-Name")
const EmailPopup = document.querySelector("#Popup-Email")

editPic.addEventListener("click",()=>{
    conteiner.classList.toggle("active");
    ImgPopup.classList.toggle("active");
})

editName.addEventListener("click",()=>{
    conteiner.classList.toggle("active");
    NamePopup.classList.toggle("active");
})

editEmail.addEventListener("click",()=>{
    conteiner.classList.toggle("active");
    EmailPopup.classList.toggle("active");
})