const socket = io();
// roomCode = XXX-XXX code of the match
const roomCode = window.location.pathname.substring(11);

/**
 * This function is the handler that makes the user answers go to the server
 */
export function sendUserAnswerToServer() {

    socket.emit("GameChat" , roomCode , guess);

    const userAnswer={
        message: chatInputText.value,
        timeStamp: formatDate(),
    };

    if (userAnswer.message) {
        socket.emit("GameChat-Guess",roomCode,userAnswer);
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

        socket.on("GameChat-Guessed",(res_Object)=>{

        });

        socket.on("clientGameChat",(messageForClient) => {
            sendAnswer(messageForClient);
        });

        socket.on("Player-Joined",(res_Object) => {
            userJoinHandler(res_Object)
            console.log("🚀 ~ userJoined:", res_Object.user.username);
        });
        socket.on("Player-Left",(res_Object) => {
            userLeftHandler(res_Object)
            console.log("🚀 ~ userLeft:", res_Object.user.username);
        });

        socket.on("status",(res_Object) => {
            statusChangeHandler(res_Object.matchInfo.status);
            console.log("🚀 ~ statuschanged:", res_Object.matchInfo.status);
        });

        socket.on("Question-Start",(res_Object)=>{
            Question_Start_handler(res_Object)
            console.log("🚀 ~ Question-Start:", res_Object);
        });

        socket.on("Question-End",(res_Object)=>{
            console.log("🚀 ~ Question-End:", res_Object);
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

