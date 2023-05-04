// Import express functions
const express = require("express");
const app = express();

/////////////////////////
/**
 * Server Setup
 **/
/////////////////////////

// Creates the server
const server = require("http").createServer(app);
// Create the socket.io server
const io = require("socket.io")(server);
// The PORT that the server is going to be
const PORT = 3000;

/////////////////////////
/**
 * MiddleWare
 **/
/////////////////////////

//////////////////
/**
 * Routes
 **/
//////////////////
const indexRoute = require("./routes/indexRoute");
const aboutUsRoute = require("./routes/aboutUsRoute");
const playOptionsRoute = require("./routes/playOptionsRoute");
const playGameRounte = require("./routes/playGameRoute");
// Our anonymous function that contains our sockets
// let serverSocket = require("./public/js/socket/socketServerSide");

//////////////////
/**
 * MiddleWare Request Functions
 **/
//////////////////

// Changes our view engine to "ejs"
app.set("view engine", "ejs");
/**
 * This a middleware function is from the framework Express.js for Node.js
 * Every static file that you need like CSS, JS files or images this function makes it easier to access.
 **/
app.use(express.static(__dirname + "/public"));
/**
 * This a middleware function is from the framework Express.js for Node.js
 * This function is used to analyze the data from html form that is sent to the server
 */
app.use(express.urlencoded({ extended: true }));
// Create the route to the index page
app.use(indexRoute);
app.use(aboutUsRoute);
app.use(playOptionsRoute);
app.use(playGameRounte);
/////////////////////////
/**
 * Server Launch
 **/
/////////////////////////

// serverSocket(io);

server.listen(PORT, function (err) {
  if (err) 
    console.log("Ups, something went wrong: " + err);
  else 
    console.log("Listening at Port:" + PORT);
});

// On event connection we search any entry sockets
io.on("connection", function (socket) {
  console.log("connected");
});
