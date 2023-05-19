module.exports = serverSocket = (io) =>
    // On event connection we search any entry sockets
    io.on("connection", function (socket) {
        console.log("connected to socket");
    });
