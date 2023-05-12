
// constants that have the elemnts necessary for tabs to works
const button_create_room = document.getElementById("btn-create-room");
const button_join_room = document.getElementById("btn-join-room");
const conteiner_tab_create_room = document.getElementById("conteiner-tab-create-room");
const conteiner_tab_join_room = document.getElementById("conteiner-tab-join-room");

// keep the elements of buttons JoinCode-Paste and JoinCode-Copy
const button_paste_code = document.getElementById("JoinCode-Paste");
const button_copy_code = document.getElementById("JoinCode-Copy");
const input_paste_code = document.getElementById("JoinCode-Paste-input");
const input_copy_code = document.getElementById("JoinCode-Copy-input");

// array of all droopbuttons that are in the page 
// const dropdowns = document.querySelectorAll(".dropdown");

// Defining the default tab and set default button
button_create_room.classList.add("ButtonDarkBlueActive");
conteiner_tab_join_room.style.display = "none";

// defening the behavior of tab buttons Create private 
button_create_room.addEventListener("click", () => {

    // Show tab create room
    if (conteiner_tab_create_room != null)
        conteiner_tab_create_room.style.display = "flex";
    // create private button set to active
    button_create_room.classList.add("ButtonDarkBlueActive");
    
    // Disable visisability of tab join;  
    conteiner_tab_join_room.style.display = "none" ;
    // join button set to normal
    button_join_room.classList.remove("ButtonDarkBlueActive");

});

// defening the behavior of tab buttons Join 
button_join_room.addEventListener("click", () => {

    // Show tab join rooom;
    if (conteiner_tab_join_room != null)
        conteiner_tab_join_room.style.display = "flex" ;
    
    // join button set to active
    button_join_room.classList.add("ButtonDarkBlueActive");
    
    /* 
        reset buttons of tab create match 
        this function is difined in buttons js
    */
    closeAllDroopButtons();
    // Disable visisability of tab create room;   
    conteiner_tab_create_room.style.display ="none";
    // creat privete button set to normal
    button_create_room.classList.remove("ButtonDarkBlueActive");
    
});

// adding function to the copy code button
button_copy_code.addEventListener("click", async ()=>{
    navigator.clipboard.writeText(input_copy_code.innerText);
    showtextlikeinput_code.style = "background-color: #1CA1AA; color: black ;"
});

button_copy_code.addEventListener("mousedown", ()=> {
    showtextlikeinput_code.style = "background-color: #70f5ff; color: black ;"
} )

const showtextlikeinput_code = document.querySelector("#showtextlikeinput_code");
button_copy_code.addEventListener("mouseenter" , () => {
    showtextlikeinput_code.style = "background-color: #1CA1AA; color: black ;"
} )

button_copy_code.addEventListener("mouseleave" , () => {
    showtextlikeinput_code.style = "background-color: #095C61;    color: #FFFFFF ;"
} )


// adding function to the paste code button
button_paste_code.addEventListener("click", async ()=>{
    input_paste_code.value = await navigator.clipboard.readText();
});


