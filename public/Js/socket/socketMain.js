import { sendUserAnswerToServer, receiveFromServer } from "./socketHandler.js";

// sendUserAnswerToServer(roomQuestions);

sendButton.addEventListener("click", (event) => {
   event.preventDefault();
   sendUserAnswerToServer();
});

receiveFromServer();