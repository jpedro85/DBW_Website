let aboutUs_classLogged = "ButtonBlack";
let play_class = "ButtonBlack";
let play_hreft = "/play/Options";
let profile_class = "ButtonBlack";

switch(window.location.pathname){
    case "/":
        document.getElementById("navLink_Home_content").classList.replace("ButtonBlack","ButtonBlackActive");
        break;
    case "/about-us":
        document.getElementById("navLink_AboutUs").classList.replace("ButtonBlack","ButtonBlackActive");
        aboutUs_classLogged = "ButtonBlackActive";
        break;
    case "/play/Options":
    case "/play/Game":
        let navLink_Play = document.getElementById("navLink_Play")
        navLink_Play.classList.replace("ButtonBlack","ButtonBlackActive");
        navLink_Play.href = window.location.pathname;
        play_hreft = window.location.pathname;
        play_class = "ButtonBlackActive";
        break;
    case "/profile":
        document.getElementById("navLink_Profile").classList.replace("ButtonBlack","ButtonBlackActive");
        profile_class = "ButtonBlackActive";
        break;
}

const navLink_LogOut = document.getElementById("navLink_LogOut");
const navLogedIn = document.getElementById("navBarLoged_in");
const menuButton = document.getElementById("navLink_Menu");
let click = false;

// Adicionando um EventListener para quando clicarmos no menu.
menuButton.addEventListener("click", (event) => {
    //click faz com que o butão seja toogle
    clickNot = !clickNot;
    if (clickNot){
        menuButton.style.backgroundColor="#70f5ff";
        navNotLogedIn.insertAdjacentHTML("afterend",`
        <div id="MenuCascata" class="ButtonBlack">
            <a class="MenuCascataButton ${aboutUs_classLogged}" id="navLink_Home" href="/about-us" >About Us</a>
            <a class="MenuCascataButton ${profile_class}" id="navLink_Home" href="/profile" >Profile</a>
            <a class="MenuCascataButton ${play_class}" id="navLink_Home" href="${play_hreft}" >Play</a>
        </div>
        `);
    }else{
        menuButton.style="none";
        let menu = document.getElementById("MenuCascata");
        if(menu != null)
            menu.remove();
    }
    
});


// adding even to button log out 

navLink_LogOut.addEventListener("click" , () => {

    reqForm = {
        formType: "logout",
    }

    fetch("/" , {
        method: "POST", // defining the requesthe method and body format
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(reqForm),
    
    }).finally( () => {
        
        if (window.location.href.includes("about"))
            window.location.href = "/about-us"
        else
            window.location.href = "/"

    });

});