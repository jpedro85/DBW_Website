class MatchPlayer {

    static Bonus_Firs = 10;
    static Right_points = 25;

    static max_falls = 3;
    // here cheats means look at another page / lose focus
    static max_cheats = 2;

    #user;
    #image;
    #points;
    #bonus_points;
    #streak_points;
    #rights;
    #automaticDraw;
    #draw;
    #place;
    #streak;
    #lastGuess;
    #rejoinCount;
    #fellCount;
    #disconnected;
    #cheatCount;
    #answered;
    #unanswered;
    #wrongs;
    #guesses;
  
    constructor(user,place){
  
      this.#user = user.username;
      this.#image = user.profileImage;
      this.#points = 0;
      this.#bonus_points = 0;
      this.#streak_points = 0;
      this.#answered = 0;
      this.#unanswered = 0;
      this.#rights = 0;
      this.#wrongs = 0;
      this.#automaticDraw = false;
      this.#draw = false;
      this.#place = place;
      this.#streak = 0;
      this.#guesses = 0;
      this.#rejoinCount = 0;
      this.#fellCount = 0;
      this.#disconnected = false;
      this.#cheatCount = 0;
      this.#lastGuess = null; // null in this case represents not guessed 
      this.first =false;
      this.socket = null;
      this.tryGuess = false;
    }
  
    static async updateDatabaseUser (databaseUserMetrics, matchPlayer) {
      // TODO: delete Metrics totalDraws and totalLastPlaces and mostCommonPlace and bestStreak
      //se draw update draw only
      const isFirst = matchPlayer.place==1 ? 0 : 1;  
      const isDraw = matchPlayer.gaveUp() ? 1 : 0; 
      const isPodium = matchPlayer.place>0 && matchPlayer.#place<4 ? 1 : 0;
      const wasBetter = matchPlayer.place < databaseUserMetrics.bestPlace ? matchPlayer.place  : databaseUserMetrics.bestPlace;
      // * Users metrics being altered
      databaseUserMetrics.totalGames+=1;
      databaseUserMetrics.totalLost +=  isFirst;
      databaseUserMetrics.totalQuits += isDraw;
      databaseUserMetrics.totalQuestions += matchPlayer.answered + matchPlayer.unanswered;
      databaseUserMetrics.totalQuestionsAnswered += matchPlayer.answered;
      databaseUserMetrics.totalQuestionsRight += matchPlayer.rights;
      databaseUserMetrics.totalPodium += isPodium;
      databaseUserMetrics.totalPoints += matchPlayer.points;
      databaseUserMetrics.totalStreak += matchPlayer.streak_points;
      databaseUserMetrics.totalBonusPoints+=matchPlayer.bonus_points;
      databaseUserMetrics.bestPlace = wasBetter;
      
      await databaseUserMetrics.save();

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
  
      if( this.hasGuess() ){
  
        this.#answered++;
  
        if (this.#lastGuess){
          this.#rights++;
          this.#streak++;

          if(this.first)
            this.#bonus_points+=MatchPlayer.Bonus_Firs;

          this.#points += MatchPlayer.Right_points;

          if(this.#streak > 3)
            this.#streak_points += this.#streak*2;

        } else {
          this.#wrongs++;
          this.#streak = 0;
        }
        
  
      } else {
        this.#unanswered++;
        this.#streak = 0;
      }

      this.#lastGuess = null;
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

    get answered () {
      return this.#answered;
    }

    get unanswered () {
      return this.#unanswered;
    }

    get wrongs () {
      return this.#wrongs;
    }

    get guesses () {
      return this.#guesses;
    }

    get image () {
      return this.#image;
    }

    automaticGaveUp(){
      return this.#automaticDraw;
    }

    gaveUp() {
      return this.#draw;
    } 
    
    draw(automatic=false) {
      this.#draw = true;
      this.#automaticDraw = automatic;
    }

    /**
     * return true and draw is called if max cheats reached else return false
     */
    cheated(){
      this.#cheatCount++;
      if(this.#cheatCount === MatchPlayer.max_cheats){
        this.draw(true);
        return true;
      }else  
        return false;
    }

    /**
     * return true and draw is called if max falls reached else return false
     */
    fell() {
      this.#fellCount++;
      this.#disconnected =true;
      //fall max_falls is the same that Abandon
      if( this.#fellCount === MatchPlayer.max_falls ){
        this.draw(true);
        return true;

      } else
        return false; 
    }
    /**
     * return false and draw is called if max rejoins reached else return true
     */
    rejoined(){
      this.#rejoinCount++;
      this.#disconnected = false;
      if(this.#rejoinCount < MatchPlayer.max_falls)
        return true;
      else{
        this.draw(true);
        return false;
      }
    }

    isFell(){
      return this.#disconnected;
    }

    guessed(right,first) {
      this.#lastGuess = right;
      this.first = first;
      this.triedGuess();
    }

    hasGuess(){
      return this.#lastGuess != null;
    }
  
    triedGuess() {
      return this.tryGuess = true;
    }
} 
  
module.exports = {MatchPlayer};