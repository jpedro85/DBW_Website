
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

// adding animation to the copy code button
button_copy_code.addEventListener("mousedown", ()=> {
    showtextlikeinput_code.style = "background-color: #70f5ff; color: black ;"
} )

// adding animation to the copy code button
const showtextlikeinput_code = document.querySelector("#showtextlikeinput_code");
button_copy_code.addEventListener("mouseenter" , () => {
    showtextlikeinput_code.style = "background-color: #1CA1AA; color: black ;"
} )

// adding animation to the copy code button
button_copy_code.addEventListener("mouseleave" , () => {
    showtextlikeinput_code.style = "background-color: #095C61;    color: #FFFFFF ;"
} )

const past_error = document.querySelector("#past_error");
// adding function to the paste code button
button_paste_code.addEventListener("click", async ()=>{
    input_paste_code.value = await navigator.clipboard.readText();
    input_paste_code.classList.remove("errorBox");
    past_error.innerText = "";
});

// adding handler for the event click on create match button
const option_match_type =  document.querySelector("#dropdown-MatchType .selected")
const option_number_questions =  document.querySelector("#dropdown-Questions .selected")
const option_difficulty =  document.querySelector("#dropdown-Dificulty .selected")
const option_max_players =  document.querySelector("#dropdown-MaxPlayers .selected")
document.querySelector("#btn-create").addEventListener("click" , () => {

    reqForm = {
        formtype : "create",
        match_type : option_match_type.innerText,
        number_questions : option_number_questions.innerText,
        difficulty : option_difficulty.innerText,
        max_players : option_max_players.innerText,
        code : input_copy_code.innerText,
    }
    //sending the request to creat a match
    sendRequest(createMatchHandler,reqForm);

});

// handler for createMatch response
function createMatchHandler(res_data) {
    
    // the expected response is a HTTP.redirect
    if(!res_data.success)
        showError(res_data.error);

}

// adding handler for the event click on join match button


document.querySelector("#btn-join").addEventListener("click" , () => {

    reqForm = {
        formtype : "join",
        code : input_paste_code.value,
    }

    sendRequest(joinMatchHandler,reqForm);
});

// handler for joinMatch response
function joinMatchHandler(res_data){

     // the expected response is a HTTP.redirect
     if(!res_data.success){

        if(res_data.errortype === "fullMatch"){
            showError(res_data.error);

        } else if (res_data.errortype === "code"){
            input_paste_code.classList.add("errorBox");
            past_error.innerText = res_data.error;
        
        } else if( res_data.errortype === "abandon" || res_data.errortype === "limitRetched"){
            past_error.innerText = res_data.error;

        } else
            showError(res_data.error);
           
     }

}

input_paste_code.addEventListener("keydown" , ()=>{
    input_paste_code.classList.remove("errorBox");
    past_error.innerText = "";
} )



function sendRequest(responseHandler) {

    fetch("/play/Options", 
    { 
        method: "POST", // defining the request's method and body format
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(reqForm),  
    })
    .then( (res) => {   
        if(res.redirected) {
            window.location.href = res.url;
            return {success:true}
        } else if (res.ok){
            return res.json()  
        } else 
            throw Error( res.status + " " + res.statusText );
    })
    .then( (res_data) => { responseHandler(res_data) } ) 
    .catch( (error) => showError(error) );

}