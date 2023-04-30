let aboutUs_class = "ButtonBlack";
let play_class = "ButtonBlack";
let profile_class = "ButtonBlack";

switch(window.location.pathname){
    case "/":
        document.getElementById("navLink_Home_content").classList.replace("ButtonBlack","ButtonBlackActive");
        break;
    case "/about-us":
        document.getElementById("navLink_AboutUs").classList.replace("ButtonBlack","ButtonBlackActive");
        aboutUs_class = "ButtonBlackActive";
        break;
    case "/play/settings":
    case "/play/gameRoom":
            document.getElementById("navLink_Play").classList.replace("ButtonBlack","ButtonBlackActive");
            play_class = "ButtonBlackActive";
            break;
    case "/profile":
        document.getElementById("navLink_AboutUs").classList.replace("ButtonBlack","ButtonBlackActive");
        profile_class = "ButtonBlackActive";
        break;
}

let navLogedIn = document.getElementById("navBarLoged_in");
let menuButton = document.getElementById("navLink_Menu");
let click = false;

// Adicionando um EventListener para quando clicarmos no menu.
menuButton.addEventListener("click", (event) => {
    //click faz com que o butão seja toogle
    click = !click;
    if (click){
        menuButton.style.backgroundColor="#70f5ff";
        navLogedIn.insertAdjacentHTML("afterend",`
        <div id="MenuCascata" class="ButtonBlack">
            <a class="MenuCascataButton ${aboutUs_class}" id="navLink_Home" href="/about-us" >About Us</a>
            <a class="MenuCascataButton ${play_class}" id="navLink_Home" href="/" >Profile</a>
            <a class="MenuCascataButton ${play_class}" id="navLink_Home" href="/" >Play</a>
        </div>
        `);
    }else{
        menuButton.style="none";
        let menu = document.getElementById("MenuCascata");
        if(menu != null)
            menu.remove();
    }
    
});