// Importing only the function renderPageWithAuthStatus fromm userController
const {renderPageWithAuthStatus } = require("../controllers/userController.js");
// Importing only the function validate object from validate.Controler.js
const { validateObject, validateEnum } = require("../controllers/Validations.Controler.js");

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

const PrivateMatches = []

class Match {

  #joinCode;
  #settings_difficulty;
  #settings_questions ;
  #settings_maxPlayers;
  #players;
  #currentQuestion;
  #ClassName;
  #started;

  constructor(leader,joinCode,settings_difficulty,settings_questions,settings_maxPlayers,type=null){
    this.#joinCode = joinCode;
    this.#settings_difficulty = settings_difficulty;
    this.#settings_questions = settings_questions;
    this.#settings_maxPlayers = settings_maxPlayers;
    this.#players = [];
    this.#players.push( new MatchPlayer(leader,1) );
    this.#currentQuestion = null;
    this.#ClassName = (type==null) ? "Match" : type ;
    this.#started = false;
  }

  ClassName () {
    return this.#ClassName;
  }

  get leader () {
    return this.#players[0]
  }

  get joinCode () {
    return this.#joinCode
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

  /**
   * Return true is player joined match and can join the match false case its full
   *
   * @param   {req.user}  user  
   */
  playerJoin(user) {
    if (this.#settings_maxPlayers + 1 < this.#players.length){

      this.#players.push( new MatchPlayer(user,this.#players.length + 1) );
      return true;
    }
    return false;
  }

  playerLeft(user) {
    this.#players.forEach( (matchPlayer) => { if(matchPlayer.is(user)) matchPlayer.drew() } )
  }
 
  playerGuess(user,guess) {

    if(this.#currentQuestion.correctAnswered === guess) {

      this.#players.forEach( (matchPlayer) => {

        if (matchPlayer.is(user.username))
          matchPlayer.guessed(true);
        else
          matchPlayer.guessed(false);
          
      });

      return true;
      
    } else {
      return false
    }
  }

  questionEnd() {
    this.#players.forEach( (matchPlayer) => {matchPlayer.update_Answer()} );
  }

  newQuestion(question) {
    this.#currentQuestion = question;
  }

  /**
   * returns true if the ,match has the player
   *
   * @param   {[type]}  username  user.username
   *
   * @return  {[type]}            true if player is in the match
   */
  hasPlayer(username) {

    for (let i = 0; i < this.#players.length; i++) {

      if (this.#players[i].is(username))
        return true;
    }

    return false;
  }
}

class MatchNormal extends Match {

  constructor(leader,joinCode,settings_difficulty,settings_questions,settings_maxPlayers) {
    super(leader,joinCode,settings_difficulty,settings_questions,settings_maxPlayers,"MatchNormal");

  }

  newQuestion() {
    question = "porFazer";
    super.newQuestion(question);
  }

}

class MatchVotedTheme extends Match {

  static themes = ["Vehicles","Animals","Celebrities","Art","Politics","History","Geography","Sports","Mythology","General Knowledge"]
  static entertainmentThemes = ["Entertainment: Cartoon & Animations","Entertainment: Japanese Anime & Manga","Entertainment: Comics","Entertainment: Board Games","Entertainment: Video Games","Entertainment: Television","Entertainment: Musicals & Theatres","Entertainment: Music","Entertainment: Film","Entertainment: Books"]
  static scienceThemes = ["Science: Gadgets","Science: Mathematics","Science: Computers","Science & Nature"]

  constructor(leader,joinCode,settings_difficulty,settings_questions,settings_maxPlayers) {
    super(leader,joinCode,settings_difficulty,settings_questions,settings_maxPlayers,"MatchVotedTheme");
    console.log("MatchVotedTheme Leather:" + this.leader)
  }

  static generateVoteChoices() {
    const number = Math.random()
    if(number < 0.33) {
      return generateVoteChoices_aux(entertainmentThemes,themes,scienceThemes)

    } else if (number > 0.33 && number < 0.66) {
      return generateVoteChoices_aux(scienceThemes,entertainmentThemes,themes)

    } else {
      return generateVoteChoices_aux(themes,scienceThemes,entertainmentThemes)
    }
  }

  static generateVoteChoices_aux(array1,array2,array3) {
    let option_1 =  array1[ Math.round(Math.random*(array1.length-1)) ];
    let option_2;
    
    do{
      option_2 =  array1[ Math.round(Math.random*(array1.length-1)) ];
    } while(option_2 === option_1);

    let option_3 =  array2[ Math.round(Math.random*(v.length-1)) ];
    let option_4 =  array3[ Math.round(Math.random*(array3.length-1)) ];
    
    return { option_1 , option_2 , option_3 , option_4 }
  }

  newQuestion() {
    question = "porFazer";
    super.newQuestion(question);
  }
}

class Question {

  #question;
  #correctAnswered;

  constructor(number,apiQuestion,theme=null){
    // cria a questão
  }

  get correctAnswered (){
    return correctAnswered;
  }

  get question (){
    return question;
  }

}

class MatchPlayer {

  #user;
  #points;
  #bonus_points;
  #streak_points;
  #answered;
  #unanswered;
  #rights;
  #wrongs;
  #drew;
  #place;
  #guesses;
  #streak;
  #lastGuess;

  constructor(user,place){

    this.#user = user.username;
    this.#points = 0;
    this.#bonus_points = 0;
    this.#streak_points = 0;
    this.#answered = 0;
    this.#unanswered = 0;
    this.#rights = 0;
    this.#wrongs = 0;
    this.#drew = false;
    this.#place = place;
    this.#streak = 0;
    this.#guesses = 0;
    this.#lastGuess = null; // null in this case represents not guessed 
  }

  static updateDatabaseUser (databaseUser) {
    //se drew update drew only
  } 

  get lastGuess () {
    return this.#lastGuess;
  }

  is(username){
    return matchPlayer.user === username;
  }

  get user() {
    return this.user;
  }

  set update_Points (points) {
    this.#points += points;
  }

  set update_BonusPoints (points) {
    this.#bonus_points += points;
  }

  set update_Streak_points (points) {
    this.#streak_points += points;
  }

  update_Answer() {

    if( this.triedGuess() ){

      this.#answered++;

      if (this.lastGuess){
        this.#rights++;
        this.#streak++;
      } else {
        this.#wrongs++;
        this.#streak = 0;
      }

    } else {
      this.#unanswered++;
      this.#streak = 0;
    }
  }

  set update_Place (place) {
    this.#place = place;
  }

  get place () {
    return this.#place;
  }

  drew () {
    this.#drew = true;
  }

  guessed(right) {
    this.#lastGuess = right;
  }

  triedGuess() {
    return this.lastGuess != null
  }

  gaveUp() {
    return this.#drew;
  } 
} 

// functionn to handler the request
function playOptionsControler(request, response) {

  let code = "";
  do {
    code = generateJoinCode()
  } while(false);

  renderPageWithAuthStatus(request, response, "playOptions",{ joinCode : code } , true);
};

// array contain all active matches
const AllPrivateMatches = []

// function to handle the create match request in the play/Options page
function playOption_CreateMatch( req , res ){

  if(validateObject(req.body,"match_type","number_questions","difficulty","max_players","code")){

    const match_type = req.body.match_type ;
    const number_questions = req.body.number_questions ;
    const difficulty = req.body.difficulty ;
    const max_players = req.body.max_players ;
    const code = req.body.code ;

    if ( code != "" && validateEnum(match_type,"Voted Theme","Random") 
        && validateEnum(number_questions,"5","10","15","20","25","30") 
        && validateEnum(difficulty,"Easy","Medium","Hard") 
        && validateEnum(max_players,"2","4","8","10","16","20","25","30") 
      ){

      if (match_type == "Voted Theme"){

        AllPrivateMatches.push(new MatchVotedTheme(req.user,code,difficulty,number_questions,max_players))
        console.log(AllPrivateMatches);

      } else {
        AllPrivateMatches.push( new MatchNormal(req.user,code,difficulty,number_questions,max_players))
        console.log(AllPrivateMatches);
      }

      res.redirect("play/Game/"+code );

    } else 
      res.send({success: false , errortype : "other" , error: "Not all required information are valid." });

  }else
    res.send({success: false , errortype : "other" , error: "Invalid form submitted on request." });
}

// function to handle the join match request
function playOption_JoinMatch (req ,res) {

  if (validateObject(req.body,"code")) {

    if(req.body.code != ""){

      const match = getMatchByCode(req.code);
    
      if (match ) {
        // playerJoin returns false if a match is full
        if ( match.playerJoin(req.user) )
          res.redirect("play/Game/"+code);
        else
          res.send( {success: false , errortype : "fullMatch" , error: "The Match you are trying to join is full." } )
      
      } else
          res.send( {success: false , errortype : "code" , error: "Invalid Join Code." } )
    
    }else
      res.send( {success: false , errortype : "code" , error: "Invalid Join Code." } )
      
  } else 
    res.send({success: false , errortype : "other" , error: "Invalid form submitted on request." });

}

/**
 *  auxiliary function look for a match with a the specified code
 *
 * @param   {MatchCode}  code  
 * 
 * @return [false if a match not found a match otherwise]
 */
function getMatchByCode (code){

  for (let i = 0; i < AllPrivateMatches.length; i++) {
    
    if (AllPrivateMatches[i].joinCode === code)
      return AllPrivateMatches[i];
  }

  return false;
}



//exporting the router the handler
module.exports = { AllPrivateMatches , MatchNormal, MatchVotedTheme , MatchPlayer , Question , getMatchByCode ,playOption_JoinMatch ,playOption_CreateMatch ,playOptionsControler };
