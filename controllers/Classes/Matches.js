//importing necessary classes
const {MatchPlayer} = require("./MatchPlayer.js");

class Match {

    #match_socket
    #joinCode;
    #settings_difficulty;
    #settings_questions ;
    #settings_maxPlayers;
    #players;
    #currentQuestion;
    #ClassName;
    #status; // {starting ,voting, running , finished}
  
    constructor(leader,joinCode,settings_difficulty,settings_questions,settings_maxPlayers,type=null){
      this.#joinCode = joinCode;
      this.#settings_difficulty = settings_difficulty;
      this.#settings_questions = settings_questions;
      this.#settings_maxPlayers = settings_maxPlayers;
      this.#players = [];
      this.#players.push(  new MatchPlayer(leader,1) );
      this.#currentQuestion = null;
      this.#ClassName = (type==null) ? "Match" : type ;
      this.#status = "starting"; 
    }

    /**
     * return true if the user is the leather and is the one setting the socket
     *
     * @param    user    
     * @param   socket  [socket.io socket connection]
     *
     * @return boolean
     */
    set_Match_socket(user,socket){

        if (user.username === this.getLeader().user ){
            this.#match_socket = socket;
            return true;
        }

        return false;
    }
  
    ClassName () {
      // class type - Match
      return this.#ClassName.substring(6);
    }
  
    getLeader () {
      return this.#players[0];
    }
  
    get joinCode () {
      return this.#joinCode;
    }
  
    get settings_difficulty () {
      return this.#settings_difficulty;
    }
  
    get settings_questions () {
      return this.#settings_questions;
    }
  
    get settings_maxPlayers () {
      return this.#settings_maxPlayers;
    }
  
    get players () {
      return this.#players;
    }
  
    get status() {
      return this.#status;
    }
  
    /**
     * Return true is player joined match and can join the match false case its full
     *
     * @param   {req.user}  user  
     */
    playerJoin(user) {
  
      for(let matchPlayer of this.#players){
  
        if(matchPlayer.is(user.username)){
            if(matchPlayer.gaveUp())
                return {success : false , errortype:"abandon" , error: "Can't rejoin after abandon." }
            else
                return {success : matchPlayer.rejoined() , errortype: "limitRetched" , error: "You can only rejoin 2 times." }
        }
      }
  
      if (this.#players.length + 1 < this.#settings_maxPlayers ){
  
        this.#players.push( new MatchPlayer(user,this.#players.length + 1) );
        return {success : true };
      }
  
    }
  
    playerLeft(user) {

        for (let i = 0; i < this.#players.length; i++) {
            
            if(this.#players[i].is(user.username)){
                this.#players[i].draw() 
                break;
            }
        }


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
  
    getPlayers() {
      return this.#players.length ;
    }
  }






  
class MatchNormal extends Match {

    constructor(leader,joinCode,settings_difficulty,settings_questions,settings_maxPlayers) {
      super(leader,joinCode,settings_difficulty,settings_questions,settings_maxPlayers,"Match_Normal");
  
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
        super(leader,joinCode,settings_difficulty,settings_questions,settings_maxPlayers,"Match_VotedTheme");
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

module.exports = {Match , MatchNormal, MatchVotedTheme , MatchPlayer}