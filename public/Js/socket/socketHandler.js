const socket = io();

export function getQuestions(match) {
    // Fetch from the link the resources
    // change matchSetting for the proprieties of the class
    fetch(`https://opentdb.com/api.php?amount=${matchSettings}&difficulty=${matchSettings}&type=${matchSettings}`)
    // Transform the object into JSON
    .then((res) => res.json())
    // After its turned into an JSON adds the fetchedQuestions to the match questions
    .then((json) =>{
        const fetchedResults = json.results;
        fetchedResults.forEach(result => {
            const gameQuestion={
                question: result.question,
                correctAnswer: result.correct_answer,
            }
            roomQuestions.push(gameQuestion);
        });
        
    })
    .catch((Error)=>{
        console.error(Error);   
        // Handles the error server side  
    });
}

/**
 * This function is the handler that makes the user answers go to the server
 */
export function sendUserAnswerToServer() {
    const userAnswer={
        message: chatInputText.value,
        timeStamp: formatDate(),
    };
    if (userAnswer.message) {
        socket.emit("GameChat",userAnswer);
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

        socket.on("clientGameQuestion",(newGameQuestion)=>{
            sendQuestion(newGameQuestion);
        });
        socket.on("clientGameChat",(messageForClient) => {
            sendAnswer(messageForClient);
        });
        socket.on("teste",(msg) => {
            console.log("🚀 ~ msg:", msg);
        });
    });

}

function askToJoin(){
    const roomCode = window.location.pathname.substring(11);
    socket.emit("askToJoin" , roomCode);
}


export function listenSocketEvents() {

}

