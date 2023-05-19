const socket = io();


export function getQuestions() {
    // Fetch from the link the resources
    fetch(`https://opentdb.com/api.php?amount=30&category=9&difficulty=hard&type=multiple`)
      // Transform the object into JSON
      .then((res) => res.json())
      // After its turned into an JSON adds the Data into the page
      .then((json) =>{
        const fetchedResults = json.results;
        fetchedResults.forEach(result => {
            console.log("🚀 ~ file: socketHandler.js:15 ~ .then ~ question.question:", result.question);
            console.log("🚀 ~ file: socketHandler.js:16 ~ .then ~ result.correct_answer:", result.correct_answer)
        });
      })
      .catch((Error)=>{
          error.innerHTML= Error;
      });
  }

export function sendGameQuestionToServer(params) {
    
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
    socket.on("clientGameQuestion",(gameQuestion)=>{
        sendQuestion(gameQuestion);
    })
    socket.on("clientGameChat",(messageForClient) => {
        sendAnswer(messageForClient);
    });
}