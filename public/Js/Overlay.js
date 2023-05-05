// const to keep all overlays
const OverLays = document.querySelectorAll(".Popup");
// const to keep the overlay conteiner
const OverLayConteiner = document.querySelector(".Popup-conteiner")

let OverLays_open = false;
// bool to activete the closing on outside of the overlay click 
let OverlayCloseActive = true;


// for all overlay add function to the close button
OverLays.forEach( (OverLay_popup) => {

    const x = OverLay_popup.querySelector(".Close-Popup");
    
    x.addEventListener("click" ,() => {
        // close pop up
        OverLay_popup.classList.remove("active");
        OverLayConteiner.classList.remove("active");
    } );
       

    OverLay_popup.addEventListener("click" ,() => {
        OverLays_open = true;
    } );

});

// for a click in the overlay conteiner close the overlay
OverLayConteiner.addEventListener("click", (event) => {
    
    // close all popus
    if (!OverLays_open && OverlayCloseActive) {

        OverLays.forEach( (OverLay) => {    
            closePopUp(OverLay);    
        });
    }

    OverLays_open = false;

} );

// })

// function that close any popup 
// doens't check if argument is a popup
function closePopUp(OverLay) {

    if(OverLay.classList.contains("active") ){
        OverLay.classList.remove("active");
        OverLayConteiner.classList.remove("active");

        OverLays_open = false
    }

}

// /*Function that Activates the log in pop up when pressed the log in button in main page*/
// document.querySelector("#navLink_LogOut").addEventListener("click",function(){
//     document.querySelector(".Login-Popup").classList.add("active");
//     document.querySelector(".Popup").classList.add("active");
// });

// /*Function that closes the log in button when pressed the X in the log in menu*/
// document.querySelector(".Login-Popup #Close-Login").addEventListener("click",function(){
//     document.querySelector(".Login-Popup").classList.remove("active");
//     document.querySelector(".Popup").classList.remove("active");
// });

// /*Function that de-activates the login menu and activates the Sign up menu when pressed to sign in*/
// document.querySelector(".Login-Popup #Signup-Popup-Button").addEventListener("click",function(){
//     document.querySelector(".Login-Popup").classList.remove("active");
//     document.querySelector(".Signup-Popup").classList.add("active");
// });

// /*Function that de-activates de sign up menu when pressed the close button*/
// document.querySelector(".Signup-Popup #Close-Signup").addEventListener("click",function(){
//     document.querySelector(".Signup-Popup").classList.remove("active");
//     document.querySelector(".Popup").classList.remove("active");
// });

// /*Function that de-activates the Sign up menu and activates the Sign up confirm menu when pressed to sign in*/
// document.querySelector(".Signup-Popup #Signup-Button-Confirm").addEventListener("click",function(){
//     document.querySelector(".Signup-Popup").classList.remove("active");
//     document.querySelector(".Signup-Confirm").classList.add("active");
// });

// /*Function that de-activates de sign up confirm menu when pressed the close button*/
// document.querySelector(".Signup-Confirm #Close-Signup-Confirm").addEventListener("click",function(){
//     document.querySelector(".Signup-Confirm").classList.remove("active");
//     document.querySelector(".Popup").classList.remove("active");
// });

// /*Function that de-activates the Sign up confirm menu and activates the Account Created menu when pressed to Confirm email*/
// document.querySelector(".Signup-Confirm #Signup-Confirm-Email").addEventListener("click",function(){
//     document.querySelector(".Signup-Confirm").classList.remove("active");
//     document.querySelector(".Account-Created").classList.add("active");
// });

// /*Function that de-activates de Account Created menu when pressed the close button*/
// document.querySelector(".Account-Created #Close-Account-Created").addEventListener("click",function(){
//     document.querySelector(".Account-Created").classList.remove("active");
//     document.querySelector(".Popup").classList.remove("active");
// });

// /*Function that de-activates de Account Created  menu when pressed the Continue to home button*/
// document.querySelector(".Account-Created #Account-Created-Succes").addEventListener("click",function(){
//     document.querySelector(".Account-Created").classList.remove("active");
//     document.querySelector(".Popup").classList.remove("active");
// });