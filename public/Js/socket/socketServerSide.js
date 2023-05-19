module.exports = serverSocket = (io) =>
  // On event connection we search any entry sockets
  io.on("connect", function (socket) {
    const username = socket.request.user.username;
    socket.on("GameQuestion", (gameQuestion) => {
        io.sockets.emit("clientGameQuestion", gameQuestion);
    });
    socket.on("GameChat", (userAnswer) => {
      const messageClient = {
        username: username,
        message: userAnswer.message,
        timeStamp: userAnswer.timeStamp,
      };

      if (isAnswerCorrect(messageClient.message)) {
        messageClient.status = "guess";
      } else {
        messageClient.status = "wrong";
      }

      io.sockets.emit("clientGameChat", messageClient);
    });
  });

function isAnswerCorrect(userAnswer) {
  // if (userAnswer===roomQuestions[0].correctAnswer) {
  //     roomQuestions.shift();
  //     const newGameQuestion=roomQuestions[0];
  //     socket.emit("GameQuestion",newGameQuestion);
  //     return true;
  // }
  return false;
}
