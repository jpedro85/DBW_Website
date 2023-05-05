// Import express functions
const express = require("express");
// Import method override so we can use other HTTP methods
const methodOverride = require("method-override");
// Import mongoose so we can use mongoDB
const mongoose = require("mongoose");

/////////////////////////
/**
 * Passport Variables
 **/
/////////////////////////

// Imports passport
const passport = require("passport");
// Imports passportLocal
const localStrategy = require("passport-local");
// Imports Session
const session = require("express-session");
// Imports user model
const user = require("./model/userModel");
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
const profileRoute = require("./routes/profileRoute");
const playGameRoute = require("./routes/playGameRoute");
// to be decided
// const userRoute = require("./routes/userRoute");

// Our anonymous function that contains our sockets
//let serverSocket = require("./public/js/socket/socketServerSide");

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
// Uses the method-override middleware
app.use(methodOverride("_method"));
// Transform JSON to object
app.use(express.json());



/////////////////////////
/**
 * Passport Config
 **/
/////////////////////////

// Express-session middleware. Saves the user session on the server side
app.use(
  session({
    // Used to encrypt you session data
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Initializes passport
app.use(passport.initialize());
// Its used to restore a users session
app.use(passport.session());
// Authenticate is added automatically by the plugin
passport.use(new localStrategy(user.authenticate()));
// Saves a user session
passport.serializeUser(user.serializeUser());
// Removes a user from the session
passport.deserializeUser(user.deserializeUser());

/////////////////////////
/**
 * MongoDB Connection
 **/
/////////////////////////

//Connect to MongoDB using mongoose
mongoose
  .connect(
    "mongodb+srv://2081421:AfTHTB4ipt3ahAEd@dbw-2.z5z1wga.mongodb.net/?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((connectionError) => {
    console.log(connectionError);
  });

// Create the route to the index page
app.use(indexRoute);
// Create the route to the about us page
app.use(aboutUsRoute);
// Creates the route to the playOptions page
app.use(playOptionsRoute);
// Create the route to the playGame page
app.use(playGameRoute);
// create the route to the profile page
app.use(profileRoute);
// Create route to user
// app.use(userRoute);

/////////////////////////
/**
 * Server Launch
 **/
/////////////////////////

//serverSocket(io);

server.listen(PORT, function (connectionError) {
  if (connectionError)
    console.log("Ups, something went wrong: " + connectionError);
  else console.log("Listening at Port:" + PORT);
});
