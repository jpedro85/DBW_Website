// Import express functions
const express = require("express");
// Import method override so we can use other HTTP methods
const methodOverride = require("method-override");
// Import mongoose so we can use mongoDB
const mongoose = require("mongoose");

const { instrument } = require("@socket.io/admin-ui");

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
const fetchedUser = require("./model/user.model");
// Import bcrypt a tool used for the password encryption
var bcrypt = require("bcrypt");
const app = express();
// importing math to set i"o on class var to avoid circular dependencies
const  {Match} = require("./controllers/Classes/Matches")


/////////////////////////
/**
 * Server Setup
 **/
/////////////////////////

// Creates the server
const server = require("http").createServer(app);
// Create the socket.io server
const io = require("socket.io")(server,{
  cors: {
    origin: ["http://localhost:3000","https://admin.socket.io"],
    credentials: true
  }
});
// The PORT that the server is going to be
const PORT = 3000;

// setting Match io before starting server
Match.setIO(io)

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
const playGameRoute = require("./routes/playGameRoute");
const profileRoute = require("./routes/profileRoute");
const authEmailRoute = require("./routes/authEmailRoute");

// Our anonymous function that contains our sockets
let serverSocket = require("./public/js/socket/socketServerSide.js");

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
app.use(express.urlencoded({limit: '50mb', extended: true }));
// Uses the method-override middleware
app.use(methodOverride("_method"));
// Transform JSON to object
app.use(express.json({limit: '50mb'}));

/////////////////////////
/**
 * Passport Config
 **/
/////////////////////////

const sessionMiddleware = session({
  // Used to encrypt you session data
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
});

// Express-session middleware. Saves the user session on the server side
app.use(sessionMiddleware);

// Making the strategy to authenticate or user
passport.use(
  new localStrategy(async (username, password, next) => {

    try {
      const confirmedEmail = "Active";
      const [userFound] = await fetchedUser.find({ username: username });
      // If its found an user in the  database
      if (userFound) {
        const activeAccount = userFound.status === confirmedEmail;
        const valid = await bcrypt.compare(password, userFound.password);
        // Checks wether the account
        if (!activeAccount) {
          // Sends that there are no errors, doesn't send the user and the error message
          next(null, false, {
            success: false,
            errortype: "pending",
            error: "Please confirm your account. If you didn't receive the email go to signup.",
          });
        }
        // Check if active account
        // if passwords compare and pass
        if (activeAccount && valid) {
          // If passes all verification the user logsIn sends no error, the user and message
          next(null, userFound, { success: true });
        } else {
          // If its bad input
          next(null, false, {
            success: false,
            errortype: "credentials",
            error: "Invalid username or password",
          });
        }
      } else {
        // Here is where we gonna handle the bad inputs Server-side
        // for now sends response.json()
        next(null, false, {
          success: false,
          errortype: "credentials",
          error: "Invalid username or password",
        });
      }
    } catch(authError) {
      // Error Handling
      // for now sends response.json()
      next(authError);
    }
  })
);

// Initializes passport
app.use(passport.initialize());
// Its used to restore a users session
app.use(passport.session());
// Saves a user session
passport.serializeUser((user, done) => {
  done(null, user);
});
// Removes a user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

const wrap = middleware => (socket, next) =>
 middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

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
// Create the route to the profile page
app.use(profileRoute);
// Creates the route where confirms the email
app.use(authEmailRoute);


/////////////////////////
/**
 * Server Launch
 **/
/////////////////////////

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'))
  }
});

instrument(io, {
  auth: false,
  mode: "development",
});

serverSocket(io);

server.listen(PORT, function (connectionError) {
  if (connectionError)
    console.log("Ups, something went wrong: " + connectionError);
  else console.log("Listening at Port:" + PORT);
});