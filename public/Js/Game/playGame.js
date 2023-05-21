const chatInputText = document.querySelector("#tab-game-guess-input");
const sendButton = document.querySelector("#btn-tab-game-guess");
const gameChat = document.querySelector("#tab-game-chat");
const gameQuestion = document.querySelector(".tab-game-question");

const GoTo_playOptinos = document.querySelector("#GoTo_playOptions");
if (GoTo_playOptinos != null){
    GoTo_playOptinos.addEventListener("click",(click) => {
        window.location = "/play/Options"
    })
}

document.querySelector("#button-abandonMatch").addEventListener( "click", () => {
    
    const reqForm = {
        formtype : "abandon"
    }

    fetch(window.location.href, 
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
    .then( (res_data) => { startMatchHandler(res_data) } ) 
    .catch( (error) => showError(error) );
} );


function startMatchHandler(res_data){

    if(!res_data.success){

        showError(res_data.error)
    }

}