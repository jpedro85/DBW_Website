//importing necessary classes
const {MatchPlayer} = require("./MatchPlayer.js");
//ompor io server form index

class Match {

    static class_io  = null;

    static setIO(io) {
      Match.class_io = io;
    }

    #joinCode;
    #settings_difficulty;
    #settings_questions ;
    #settings_maxPlayers;
    #players;
    #playersDraw;
    #currentQuestion;
    #ClassName;
    #leader;
    #status; // {starting ,voting, running , finished}
  
    constructor(leader,joinCode,settings_difficulty,settings_questions,settings_maxPlayers,type=null){
      this.#joinCode = joinCode;
      this.#settings_difficulty = settings_difficulty;
      this.#settings_questions = settings_questions;
      this.#settings_maxPlayers = settings_maxPlayers;
      this.#players = [];
      //adding leader
      let temp = new MatchPlayer(leader,1);
      this.#players.push( temp );
      this.#leader = temp ;

      this.#currentQuestion = null;
      this.#ClassName = (type==null) ? "Match" : type ;
      this.#status = "starting"; 
      this.#playersDraw = 0;
    }
  
    ClassName() {
      // class type - Match
      return this.#ClassName.substring(6);
    }
  
    getLeader() {
      return this.#leader;
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
     */
    playerJoin(user) {
  
      for(let matchPlayer of this.#players){

        if(matchPlayer.is(user.username)){
            if(matchPlayer.gaveUp() && !matchPlayer.automaticGaveUp())
              return {success : false , errortype:"abandon" , error: "Can't rejoin after abandon." }
            
            else{
              
              if(!this.hasLeader())
                this.#players = newPlayer;
              
              Match.class_io.to(this.#joinCode).emit("Player-Joined", { matchInfo : {isleader: this.isLeader(matchPlayer), maxPlayers: this.#settings_maxPlayers , playerCount : this.getPlayerCount() }, user : {username:user.username , img:"em desenvolvimento"} } );

              return {success : matchPlayer.rejoined() , errortype: "limitRetched" , error: "Reached max rejoins, 3 !" }
            }
                
        }
      }
  
      if (this.#players.length + 1 - this.#playersDraw < this.#settings_maxPlayers ){
        
        let newPlayer = new MatchPlayer(user,this.#players.length + 1);

        if(!this.hasLeader())
          this.#players = newPlayer;
          
        this.#players.push(newPlayer);
        Match.class_io.to(this.#joinCode).emit("Player-Joined",  { matchInfo : {isleader: this.isLeader(newPlayer), maxPlayers: this.#settings_maxPlayers , playerCount : this.getPlayerCount() }, user : {username:user.username , img:"em desenvolvimento"} });
        return {success : true };
      }
  
    }

    playerCheated(user){
      for (let matchPlayer of this.#players) {
            
        if(matchPlayer.is(user.username)){

          // return true and draw is called if max falls reached else return false
          if(matchPlayer.cheated()){

            if(matchPlayer == this.#leader)
              this.leaderLeft();

            this.#playersDraw++;~
            Match.class_io.to(this.#joinCode).emit("Player-Left",  { matchInfo : {isleader: this.isLeader(matchPlayer), maxPlayers: this.#settings_maxPlayers , playerCount : this.getPlayerCount() }, user : {username:user.username} });
            break;
          }
        }
      }

    }

    playerFell(user){
      for (let matchPlayer of this.#players) {
            
        if(matchPlayer.is(user.username)){
          
          if(matchPlayer == this.#leader)
              this.leaderLeft();

          // return true and draw is called if max falls reached else return false
          if(matchPlayer.fell()){
            this.#playersDraw++;
            Match.class_io.to(this.#joinCode).emit("Player-Left",  { matchInfo : {isleader: this.isLeader(matchPlayer), maxPlayers: this.#settings_maxPlayers , playerCount : this.getPlayerCount() }, user : {username:user.username} });
            break;     
          }     
        }
      }
    }
  
    playerAbandon(user) {

      for (let matchPlayer of this.#players) {
            
        if(matchPlayer.is(user.username)){

            if(matchPlayer == this.#leader)
              this.leaderLeft();
            
            matchPlayer.draw() 
            this.#playersDraw++;
            Match.class_io.to(this.#joinCode).emit("Player-Left",  { matchInfo : {isleader: this.isLeader(matchPlayer), maxPlayers: this.#settings_maxPlayers , playerCount : this.getPlayerCount() }, user : {username:user.username} });
            break;
        }
      }
    }

    hasLeader(){
      return this.#leader;
    }

    leaderLeft(){

      Match.class_io.to(this.#joinCode).emit("MatchHover", "Leader Left")
      

      // for (let i_playerNewLeader = 0; i_playerNewLeader < this.#players.length; i_playerNewLeader++) {

      //   if( this.#players[i_playerNewLeader] != this.#leader && !this.#players[i_playerNewLeader].gaveUp() && !this.#players[i_playerNewLeader].isFell() ){
      //     console.log("exec:"+i_playerNewLeader+"||"+this.#players[i_playerNewLeader])
      //     this.#leader = this.#players[i_playerNewLeader];
      //   }
      // }

      // this.#leader = null;;
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
  
    /**
     * returns true if the ,match has the player
     *
     * @param   {[type]}  username  user.username
     */
    hasPlayer(username) {
  
      for (let i = 0; i < this.#players.length; i++) {
  
        if (this.#players[i].is(username))
          return this.#players[i];
      }
  
      return false;
    }
  
    getPlayers() {
      return this.#players.length ;
    }

    getPlayerCount(){
      return this.#players.length - this.#playersDraw
    }
      
    isLeader(match_player){
      if(this.#leader != null)
        return this.#leader.user === match_player.user;
      else
        return false;
    }

    start(){
      Match.class_io.to(this.#joinCode).emit("",{ matchInfo : { status: "running" , type: this.ClassName() } })
    }
   
    questionEnd(matchInfo) {

      playerPoints = [];

      this.#players.forEach( (matchPlayer) => {
        
        matchPlayer.update_Answer()
        
        playerPoints.push(
          {
            username:matchPlayer.user,
            point_total:matchPlayer.points,
            point_bonus:matchPlayer.bonus_points,
            point_streak:matchPlayer.streak_points,
            rights:matchPlayer.rights,
            streak:matchPlayer.streak,
            place:matchPlayer.place
          })
      });

      Match.class_io.to(this.#joinCode).emit("Question-End",{matchInfo , playerPoints });
    }
  
    newQuestion(question) {
      this.#currentQuestion = question;
    }

    questionEnd() {
      this.#players.forEach( (matchPlayer) => {matchPlayer.update_Answer()} );
    }

}






  
class MatchNormal extends Match {

    constructor(leader,joinCode,settings_difficulty,settings_questions,settings_maxPlayers) {
      super(leader,joinCode,settings_difficulty,settings_questions,settings_maxPlayers,"Match_Normal");
  
    }

    start(){
      super.start();

      setInterval
      

    }
  
    newQuestion() {




      question = "porFazer";
      super.newQuestion(question);

      setTimeout(this.questionEnd,120000);
    }


    questionEnd(){
      super.questionEnd();

      if(this.q)

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