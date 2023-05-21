class MatchPlayer {

    #user;
    #points;
    #bonus_points;
    #streak_points;
    #rights;
    #draw;
    #place;
    #streak;
    #lastGuess;
    #rejoinCount;
    #answered;
    #unanswered;
    #wrongs;
    #guesses;
  
    constructor(user,place){
  
      this.#user = user.username;
      this.#points = 0;
      this.#bonus_points = 0;
      this.#streak_points = 0;
      this.#answered = 0;
      this.#unanswered = 0;
      this.#rights = 0;
      this.#wrongs = 0;
      this.#draw = false;
      this.#place = place;
      this.#streak = 0;
      this.#guesses = 0;
      this.#rejoinCount = 0;
      this.#lastGuess = null; // null in this case represents not guessed 
    }
  
    static updateDatabaseUser (databaseUser) {
      //se draw update draw only
    } 
  
    get lastGuess () {
      return this.#lastGuess;
    }
  
    is(username){
      return this.#user === username;
    }
  
    get user() {
      return this.#user;
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
  
    get streak () {
      return this.#streak;
    }
  
    get bonus_points () {
      return this.#bonus_points;
    }
  
    get streak_points () {
      return this.#streak_points;
    }
  
    get points () {
      return this.#points;
    }
  
    get rights () {
      return this.#rights;
    }
  
    draw () {
      this.#draw = true;
    }
  
    guessed(right) {
      this.#lastGuess = right;
    }
  
    triedGuess() {
      return this.lastGuess != null
    }
  
    gaveUp() {
      return this.#draw;
    } 
  
    rejoined(){
      this.#rejoinCount++;
      return this.#rejoinCount < 2
    }
} 
  
module.exports = {MatchPlayer};