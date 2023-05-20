import { sendUserAnswerToServer, receiveFromServer } from "./socketHandler.js";
// sendUserAnswerToServer(roomQuestions);

if(playGameOnMatch){
   console.log("🚀 ~ playGameOnMatch:", playGameOnMatch);

   sendButton.addEventListener("click", (event) => {

      event.preventDefault();
      sendUserAnswerToServer();
   });
   
   receiveFromServer();
}