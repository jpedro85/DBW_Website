import { sendUserAnswerToServer, receiveFromServer } from "./socketHandler.js";
// sendUserAnswerToServer(roomQuestions);

if(playGameOnMatch){
 
   sendButton.addEventListener("click", (event) => {
      event.preventDefault();
      sendUserAnswerToServer();
   });

   chatInputText.addEventListener("keypress", function(event) {

      if (event.key === "Enter") {
        event.preventDefault();
        sendButton.click();
      }    
   });
   
   receiveFromServer();
}