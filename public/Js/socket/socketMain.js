console.log("connected");

import { getQuestions,sendUserAnswerToServer,receiveFromServer } from "./socketHandler.js";

sendButton.addEventListener("click", (event) => {
   event.preventDefault();
   getQuestions();
   //sendUserAnswerToServer();
});

receiveFromServer();