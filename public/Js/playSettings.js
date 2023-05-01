const button_create_room = document.getElementById("btn-create-room");
const button_join_room = document.getElementById("btn-join-room");
const conteiner_tab_create_room = document.getElementById("conteiner-tab-create-room");
const conteiner_tab_join_room = document.getElementById("conteiner-tab-join-room");

// Defining the default tab and set default button
button_create_room.classList.add("ButtonDarkBlueActive");
console.log(conteiner_tab_join_room);
conteiner_tab_join_room.style.display = "none";

/* defening the behavior of tab buttons Create private */ 
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

/* defening the behavior of tab buttons Join*/ 
button_join_room.addEventListener("click", () => {

    // Show tab join rooom;
    if (conteiner_tab_join_room != null)
        conteiner_tab_join_room.style.display = "flex" ;
    
    // join button set to active
    button_join_room.classList.add("ButtonDarkBlueActive");
    
    // Disable visisability of tab create room;   
    conteiner_tab_create_room.style.display ="none";
    // creat privete button set to normal
    button_create_room.classList.remove("ButtonDarkBlueActive");
    
});