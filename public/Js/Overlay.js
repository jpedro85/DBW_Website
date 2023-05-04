/*Function that Activates the log in pop up when pressed the log in button in main page*/
document.querySelector("#navLink_LogOut").addEventListener("click",function(){
    document.querySelector(".Login-Popup").classList.add("active");
    document.querySelector(".Popup").classList.add("active");
});

/*Function that closes the log in button when pressed the X in the log in menu*/
document.querySelector(".Login-Popup #Close-Login").addEventListener("click",function(){
    document.querySelector(".Login-Popup").classList.remove("active");
    document.querySelector(".Popup").classList.remove("active");
});

/*Function that de-activates the login menu and activates the Sign up menu when pressed to sign in*/
document.querySelector(".Login-Popup #Signup-Popup-Button").addEventListener("click",function(){
    document.querySelector(".Login-Popup").classList.remove("active");
    document.querySelector(".Signup-Popup").classList.add("active");
});

/*Function that de-activates de sign up menu when pressed the close button*/
document.querySelector(".Signup-Popup #Close-Signup").addEventListener("click",function(){
    document.querySelector(".Signup-Popup").classList.remove("active");
    document.querySelector(".Popup").classList.remove("active");
});