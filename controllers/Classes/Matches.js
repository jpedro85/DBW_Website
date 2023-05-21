//importing necessary classes
const {MatchPlayer} = require("./MatchPlayer.js");
//ompor io server form index
const {Question} = require("../Classes/Question.js")

function formatDate() {
  // Formatting the display of the time
  const date = new Date();
  const month = date.getMonth();
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  return `${day} - ${month} - ${year} ${hours}:${minutes}`;
}

function mergeSort(array) {
  if (array.length <= 1) {
    return array;
  }

  const mid = Math.floor(array.length / 2);
  const left = array.slice(0, mid);
  const right = array.slice(mid);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  const result = [];

  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i].points > right[j].points) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  while (i < left.length) {
    result.push(left[i]);
    i++;
  }

  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  return result;
}

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
    #currentQuestionNumber;
    #ClassName;
    #leader;
    #status; // {starting ,voting, running , ssssssssssssssssss       }
  
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
      this.#currentQuestionNumber = 1;

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

    set status(array){
      this.#status = array;
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
              
              Match.class_io.to(this.#joinCode).emit("Player-Joined", 
              { 
                matchInfo : {isleader: this.isLeader(matchPlayer), maxPlayers: this.#settings_maxPlayers , playerCount : this.getPlayerCount() }, 
                user : {username:user.username , img:"em desenvolvimento"},
                info: {status:"other" ,message:"Calmed down and returned to the game !" ,timeStamp: formatDate()}
              });

              return {success : matchPlayer.rejoined() , errortype: "limitRetched" , error: "Reached max rejoins, 3 !" }
            }
                
        }
      }
  
      if (this.#players.length + 1 - this.#playersDraw < this.#settings_maxPlayers ){
        
        let newPlayer = new MatchPlayer(user,this.#players.length + 1);

        if(!this.hasLeader())
          this.#players = newPlayer;
          
        this.#players.push(newPlayer);
        Match.class_io.to(this.#joinCode).emit("Player-Joined",  
          { 
            matchInfo : {isleader: this.isLeader(newPlayer), maxPlayers: this.#settings_maxPlayers , playerCount : this.getPlayerCount() }, 
            user : {username:user.username , img:"em desenvolvimento"},
            info: {status:"other" ,message:"Calmed down and returned to the game !" ,timeStamp: formatDate()}
          });
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
            Match.class_io.to(this.#joinCode).emit("Player-Left",  
              { 
                matchInfo : {isleader: this.isLeader(matchPlayer), maxPlayers: this.#settings_maxPlayers , playerCount : this.getPlayerCount() }, 
                user : {username:user.username , img:"em desenvolvimento"},
                info: {status:"other" ,message:"Did not handled the pressure and left the match !" ,timeStamp: formatDate()},
              });
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
            Match.class_io.to(this.#joinCode).emit("Player-Left",  
              { 
                matchInfo : {isleader: this.isLeader(matchPlayer), maxPlayers: this.#settings_maxPlayers , playerCount : this.getPlayerCount() }, 
                user : {username:user.username , img:"em desenvolvimento"},
                info: {status:"other" ,message:"Did not handled the pressure and left the match !" ,timeStamp: formatDate()},
              });
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
            Match.class_io.to(this.#joinCode).emit("Player-Left",  
              { 
                matchInfo : {isleader: this.isLeader(matchPlayer), maxPlayers: this.#settings_maxPlayers , playerCount : this.getPlayerCount() }, 
                user : {username:user.username , img:"em desenvolvimento"},
                info: {status:"other" ,message:"Did not handled the pressure and left the match !" ,timeStamp: formatDate()},
              });
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
   
    playerGuess(user,guess,timeStamp) {

      guess = guess.toLowerCase();

      console.log("🚀 ~ #currentQuestion:", this.#currentQuestion);
  
      if(this.#currentQuestion.correctAnswered === guess) {
        
        this.#players.forEach( (matchPlayer) => {
  
          if (matchPlayer.is(user.username) && !matchPlayer.hasGuess()){
            Match.class_io.to(matchPlayer.socket.id).emit("GameChat-Guessed",guess)
            Match.class_io.to(this.#joinCode).emit("GameChat-Guess-Receive",{status:"guessed" ,message:"Guessed" ,timeStamp ,username:user.username ,image:user.image})
            
            matchPlayer.guessed(true,this.#currentQuestion.isGuessed());
            if(this.#currentQuestion.isGuessed()) 
              this.#currentQuestion.first = false;

            this.#currentQuestion.newGuess("guessed","Guessed",timeStamp,user.username,user.image);
          }
            
        });

        return true;
        
      } else {

        this.#players.forEach( (matchPlayer) => {
  
          if (matchPlayer.is(user.username) && !matchPlayer.hasGuess()){
            let msg = "Tried: "+guess;
            Match.class_io.to(this.#joinCode).emit("GameChat-Guess-Receive",{status:"wrong" ,message:msg ,timeStamp ,username:user.username ,image:user.image});
            matchPlayer.triedGuess();
            this.#currentQuestion.newGuess("wrong",msg,timeStamp,user.username,user.image);
          }
            
        });

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
      this.#status = "running";
      Match.class_io.to(this.#joinCode).emit("status",{ matchInfo : { status: this.#status  , type: this.ClassName() } })
      console.log("exit start main");
    }

    SuperNewQuestion (question){
      console.log("🚀 ~ question:", question);
      console.log("🚀 ~ question:", question.question);
      this.#currentQuestion = question;
      this.#currentQuestionNumber++;
      Match.class_io.to(this.#joinCode).emit("Question-Start",
        {
          type: this.ClassName(), 
          question:this.#currentQuestion.question, 
          number:this.#currentQuestion.number,
          time:this.#currentQuestion.time,
        });
    }
   
    SuperQuestionEnd(matchInfo=null) {

      console.log("seding -end");

      //this.#players.sort((a, b) => b.points - a.points);

      // let t  = mergeSort(this.#players);
      // console.log("🚀 ~ mergeSort(this.#players);:", t);
      // this.#status = t;

      this.#players.forEach( (matchPlayer) => {
        
        matchPlayer.update_Answer();
        
        const playerPoints = {
            username:matchPlayer.user,
            point_total:matchPlayer.points,
            point_bonus:matchPlayer.bonus_points,
            point_streak:matchPlayer.streak_points,
            rights:matchPlayer.rights,
            streak:matchPlayer.streak,
            place:matchPlayer.place
          }
        console.log("🚀 ~ playerPoints:", playerPoints);
        

        Match.class_io.to(matchPlayer.socket.id).emit("Question-End",{matchInfo , playerPoints })
      });

      this.resetQ();

      //Match.class_io.to(this.#joinCode).emit("Question-End",{matchInfo , playerPoints });
    }
  
    isLastQuestion(){
      return this.#currentQuestionNumber > this.#settings_questions;
    }

    get currentQuestionNumber(){
      return this.#currentQuestionNumber;
    }

    get currentQuestion(){
      return this.#currentQuestion;
    }

    emitError(error){
      Match.class_io.to(this.#joinCode).emit("Error",error);
    }

    end(){
      this.#status = "finished";
      Match.class_io.to(this.#joinCode).emit("status",{ matchInfo : { status: this.#status , type: this.ClassName() } })
    }

    getQuestion(){
      return this.#currentQuestion;
    }

    resetQ(){
      this.#currentQuestion = null;
    }

}






  
class MatchNormal extends Match {

  

  constructor(leader,joinCode,settings_difficulty,settings_questions,settings_maxPlayers) {
    super(leader,joinCode,settings_difficulty,settings_questions,settings_maxPlayers,"Match_Normal");
    this.try_counter;
  }

  start(){
    super.start();
    this.newQuestion();
  }

  newQuestion() {

    this.try_counter=0;
    if(!this.isLastQuestion()){

      console.log("executing new question");
      Question.fetchQuestionAPI(this,this.settings_difficulty,this.ifSucces,this.ifError)

    }else{
      console.log("raising ending");
      super.end();
    }

  }

  ifSucces(fetchedResult,match){
    
    const temp = new Question(match.currentQuestionNumber,atob(fetchedResult.question),atob(fetchedResult.correct_answer).toLowerCase(),match.settings_difficulty);
    console.log("🚀 ~ temp:", temp.toString());
    
    match.SuperNewQuestion(temp);
    
    setTimeout(()=>{match.aux(match,match.currentQuestion.time);},1000);
    
  }

  async aux(match,time){
    if(match.currentQuestion.time==0){
      match.currentQuestion.time = 0;
      console.log("ending"+match.ClassName());
        match.SuperQuestionEnd();
        //nexQuestion
        setTimeout(()=>{match.newQuestion()},5000);

    } else{
      match.currentQuestion.time-=1000;
      setTimeout(()=>{match.aux(match,time)},1000);
    }

  }


  ifError(error,match){

    console.log("rising error",error);
    if(match.try_counter>2){
      match.emitError({error})
    }else{
      console.log("trying again");
      match.try_counter++;
      Question.fetchQuestionAPI(match,match.settings_difficulty,match.ifSucces,match.ifError);
    }

  }

  questionEnd(){

    // this.SuperQuestionEnd();
    // //nexQuestion
    // setTimeout(this.newQuestion(),10000);
    // console.log("endingFim:"+this.ClassName());
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