// Importing only the function renderPageWithAuthStatus fromm userController
const {renderPageWithAuthStatus } = require("../controllers/userController.js");

const PrivateMatches = []

class Match {

  #joinCode;
  #settings_matchType ;
  #settings_difficulty;
  #settings_questions ;
  #settings_maxPlayers;
  #players;

  constructor(leader,joinCode,settings_matchType,settings_difficulty,settings_questions,settings_maxPlayers ){
    this.#joinCode = joinCode;
    this.#settings_matchType = settings_matchType;
    this.#settings_difficulty = settings_difficulty;
    this.#settings_questions = settings_questions;
    this.#settings_maxPlayers = settings_maxPlayers;
    this.#players = [settings_maxPlayers]
    this.#players.add(leader)
  }

  get leader () {
    return this.#players[0]
  }

  get joinCode () {
    return this.#joinCode
  }

  get settings_matchType () {
    return this.#settings_matchType
  }

  get settings_difficulty () {
    return this.#settings_difficulty
  }

  get settings_questions () {
    return this.#settings_questions
  }

  get settings_maxPlayers () {
    return this.#settings_maxPlayers
  }

  playerJoin() {

  }

  playerLeft() {

  }

}
class MatchPlayer {

} 

// functionn to handler the request
const playOptionsControler = function playOptionsControler(request, response) {

  let code = "";
  do {
    code = generateJoinCode()
  } while(false);

  renderPageWithAuthStatus(request, response, "playOptions",{ joinCode : code } , true);
};

/**
 * [generateJoinCode description]
 *
 * @return  {[type]}  [return description]
 */
function generateJoinCode() {

  let code = "";
  let number = 0;
  for(let i = 0; i<6 ; i++){
    
    if (i==3)
      code += "-";
    
    number = Math.random()
    if (number < 0.3)
      code += Math.round(number*30); // 30 = 9/0.3 ,
    else if (0.3 < number && number < 0.6)
      code += String.fromCharCode( Math.round((number-0.3)*83,33)+65 ) ; // 83,33 = 25/0.3 , 65 min charAscii letter
    else 
      code += String.fromCharCode( Math.round((number-0.6)*62,5)+97 ); // 62,5 = 25/0.4 , 97 min charAscii upperCase letter
  }

  return code
}

function codeAlreadyExits() {
  return false
}

//exporting the router the handler
module.exports = playOptionsControler;
