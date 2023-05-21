const chatInputText = document.querySelector("#tab-game-guess-input");
const sendButton = document.querySelector("#btn-tab-game-guess");
const gameChat = document.querySelector("#tab-game-chat");
const gameQuestion = document.querySelector(".tab-game-question");

let playGameOnMatch = true;

const GoTo_playOptinos = document.querySelector("#GoTo_playOptions");
if (GoTo_playOptinos != null){
    ~
    GoTo_playOptinos.addEventListener("click",(click) => {
        window.location = "/play/Options"
    })

    //the match was not found or user is not auth
    playGameOnMatch=false;
}

if(playGameOnMatch){

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
        .then( (res_data) => { if(!res_data.success) showError(res_data.error) } ) 
        .catch( (error) => showError(error) );
    } );

    const startMatch = document.querySelector("#startMatch");
    if(startMatch != null)
        startMatch.addEventListener("click",()=>{
            const reqForm = {
                formtype : "start"
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
            .then( (res_data) => { if(!res_data.success) showError(res_data.error) } ) 
            .catch( (error) => showError(error) );
        });
    

    
    const allPlayers_container = document.querySelector("#tab-item-sethings-playersInMatch");
    const playersConter = document.querySelector("#playersConter");
    
    function userLeftHandler(res_Object){
    
        playersConter.innerText = "Players "+ res_Object.matchInfo.playerCount +"/"+ res_Object.matchInfo.maxPlayers;
       
        document.querySelector(`#${res_Object.user.username}`).remove()
    }
    
    function userJoinHandler(res_Object){
    
        playersConter.innerText = "Players "+ res_Object.matchInfo.playerCount +"/"+ res_Object.matchInfo.maxPlayers;
        
        // creating player div 
        const newPlayer = document.createElement("div");
        newPlayer.classList.add("tab-item-sethings-playersInMatch-item");
        newPlayer.id = res_Object.user.username;

        
        // filling player div 
        if(res_Object.matchInfo.isleader){

            newPlayer.innerHTML = `
                <div class="tab-item-sethings-playersInMatch-item-mask" style='background-image: url("/images/Logo-Inactive.png");'></div>
                <svg width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 15L0 1.25L6.875 7.5L11.25 0L15.625 7.5L22.5 1.25L20 15H2.5ZM20 18.75C20 19.5 19.5 20 18.75 20H3.75C3 20 2.5 19.5 2.5 18.75V17.5H20V18.75Z" fill="#FFD233"/>
                </svg>
                <div class="text-Setigns-playerName tab-item-sethings-playersInMatch-item-name">${res_Object.user.username}</div> 
            `;

        } else {
            newPlayer.innerHTML = `
                <div class="tab-item-sethings-playersInMatch-item-mask" style='background-image: url("/images/Logo-Inactive.png");'></div>
                <div class="text-Setigns-playerName tab-item-sethings-playersInMatch-item-name">${res_Object.user.username}</div> 
            `;
        }
        
        // Adds the element
        allPlayers_container.appendChild(newPlayer);
    }

    
    const waitingLeader_gameBoard = document.querySelector("#tab-wainting-join");
    const waitingJoin_gameBoard = document.querySelector("#tab-wainting-lether");
    const voting_gameBoard = document.querySelector("#tab-Vote");
    const chat_gameBoard = document.querySelector("#tab-Game");
    
    const question_number = document.querySelector("#QuestionNumber");
    const question_timer = document.querySelector("#questionTimer");
    const QuestionText = document.querySelector("#QuestionText");
    const guessButton = document.querySelector("#tab-game-divisor-bottom");
    const game_chat = document.querySelector("#tab-game-chat");
    
    const tab_wainting_lether_conter = document.querySelector("#tab-wainting-lether-conter");
    tab_wainting_lether_conter.innerText = "";
    let stopUpCounter = {
        value : false,
    }
    CountUpTimer(tab_wainting_lether_conter,0,stopUpCounter)
    

    function statusChangeHandler(status){
        switch(status){
            case "starting":
                //nothing 
                break;
            case "voting":
                waitingLeader_gameBoard.classList.remove("active");
                waitingJoin_gameBoard.classList.remove("active");
                voting_gameBoard.classList.add("active")
                break;
            case "running":
                waitingLeader_gameBoard.classList.remove("active");
                waitingJoin_gameBoard.classList.remove("active");
                chat_gameBoard.classList.add("active");
                stopUpCounter.value=true;
                GameChat_waiting_Question();
                break;
            case "finished":
                break;
        }
    }

    function Question_Start_handler(res_Object){
        QuestionText.innerText = res_Object.question;
        question_number.style = "display : flex";
        question_number.innerText = res_Object.number;
        guessButton.style = "display : flex";

        CountDownTimer(question_timer,res_Object.time)
    }

    function Question_End_handler(res_Object){

        GameChat_waiting_Question();
    }

    function clearGameChat() {
        gameChat.innerHTML="";
    }

    function GameChat_waiting_Question(){
        QuestionText.innerText = "Waiting for next question !"
        question_timer.innerText = "";
        question_number.style = "display : none";
        guessButton.style = "display : none";
        clearGameChat();
    }

    function CountDownTimer(where,time){
        if(time<0)
            console.log("contagem_Acabou");
        else{
            var d = new Date(1000*Math.round(time/1000)); // round to nearest second
            where.innerText = pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds());
            time-=1000;
            setTimeout(() => { CountDownTimer(where,time);},1000);
        } 
    }

    function CountUpTimer(where,time,stopUpCounter){
        
        if(!stopUpCounter.value || time==0){
            time +=1000;
            var d = new Date(1000*Math.round(time/1000)); // round to nearest second
            where.innerText = pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds());
            setTimeout(() => {CountUpTimer(where,time,stopUpCounter);},1000);
        } 
    }

    function pad(i) { return ('0'+i).slice(-2); }

}
