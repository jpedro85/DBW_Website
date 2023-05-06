let aboutUs_class = "ButtonBlack";

switch(window.location.pathname){
    case "/":
        document.getElementById("nav_Home_content").classList.replace("ButtonBlack","ButtonBlackActive");
        break;
    case "/about-us":
        document.getElementById("nav_AboutUs").classList.replace("ButtonBlack","ButtonBlackActive");
        aboutUs_class = "ButtonBlackActive";
        break;
}

let navLogedIn = document.getElementById("navBar");
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
        </div>
        `);
    }else{
        menuButton.style="none";
        let menu = document.getElementById("MenuCascata");
        if(menu != null)
            menu.remove();
    }
    
}); 