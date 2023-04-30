"use strict";
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
        <div id="MenuCascata">
            <a class="MenuCascataButton ButtonBlack" id="navLink_Home" href="/" >About Us</a>
            <a class="MenuCascataButton ButtonBlack" id="navLink_Home" href="/" >Profile</a>
            <a class="MenuCascataButton ButtonBlack" id="navLink_Home" href="/" >Play</a>
        </div>
        `)
    }else{
        menuButton.style.backgroundColor="#000000";
        let menu = document.getElementById("MenuCascata")
        if(menu != null)
            menu.remove();
    }
    
});