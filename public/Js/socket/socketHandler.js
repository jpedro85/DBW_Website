const socket = io();
// roomCode = XXX-XXX code of the match
const roomCode = window.location.pathname.substring(11);

/**
 * This function is the handler that makes the user answers go to the server
 */
export function sendUserAnswerToServer() {

    const userAnswer = chatInputText.value

    if (userAnswer) {
        socket.emit("GameChat-Guess-Send",roomCode,userAnswer,formatDate());
        chatInputText.value="";
    }
}


/**
 * This function is the handle that receives the data from the server 
 * and formats it and sends it to the player's Game Tab
 */
export function receiveFromServer() {

    socket.on("connect" ,()=> {

        askToJoin();

        socket.on("GameChat-Guess-Receive",(res_Object)=>{
            console.log("🚀 ~ guess",res_Object);
            showAnswer(res_Object);
        });

        socket.on("GameChat-Guessed",(guess) => {
            console.log("🚀 ~ guess:", guess);
  
        })

        socket.on("Player-Joined",(res_Object) => {   
            console.log("🚀 ~ res_Object:", res_Object);
            
            const playerAnswer = {
                username:res_Object.user.username,
                image:res_Object.user.img,
                message:res_Object.info.message,
                timeStamp:res_Object.info.timeStamp,
            }
            userJoinHandler(res_Object)  
            showAnswer(playerAnswer)

            console.log("🚀 ~ userJoined:", res_Object);
        });
        socket.on("Player-Left",(res_Object) => {
            userLeftHandler(res_Object)
            console.log("🚀 ~ userLeft:", res_Object.user.username);
        });

        socket.on("status",(res_Object) => {
            console.log("🚀 ~ statuschanged:", res_Object.matchInfo.status);
            statusChangeHandler(res_Object.matchInfo.status);
        });

        socket.on("Question-Start",(res_Object)=>{
            Question_Start_handler(res_Object)
            console.log("🚀 ~ Question-Start:", res_Object);
        });

        socket.on("Question-End",(res_Object)=>{
            console.log("🚀 ~ Question-End:", res_Object);
            Question_End_handler(res_Object)
        });

        socket.on("Error",(error) => {
            showError(error);
            console.error(error);
        });

    });

}


function askToJoin(){
    socket.emit("askToJoin" , roomCode);
}

