class Question {

    static async fetchQuestionAPI(match,difficulty,callback_success,callback_error,type=""){

        if(type)
            type = "&category="+type; //0-23

        fetch(`https://opentdb.com/api.php?amount=1&difficulty=${difficulty.toLowerCase()}&type=multiple${type}&encode=base64`)
        .then((res) => res.json())// Transform the object into JSON 
        .then((json) => { 
            callback_success(json.results[0],match) }) // After its turned into an JSON adds the fetchedQuestions to the match questions
        .catch((Error) => {
            callback_error(Error,match)});
        
    }

    #number;
    #question;
    #correctAnswered;

    constructor(number,question,correctAnswered,difficulty) {

        console.log("constructing");
    
        this.#question = question;
        this.#correctAnswered = correctAnswered;
        this.#number = number;
        
        switch(difficulty){
            case "Hard":
                this.time = 15000;//15
                break;
            case "Medium":
                this.time = 40000;//40
                break;
            case "Easy":
                this.time = 10000;//60
                break;
            default :
                this.time = 1200000000;
        } 

        this.chat = [];
        this.first = true;
    }

    get correctAnswered() {
        return this.#correctAnswered;
    }

    get question() {
        return this.#question;
    }

    get number(){
        return this.#number;
    }

    /**
     * 
     * object_guess = {
     *  status:"wrong" 
     * ,message:guess 
     * ,timeStamp 
     * ,username:user.username 
     * ,image:user.image
     * }
     */
    newGuess(status,guess,timeStamp,username,image){
        const object_guess = {
                status:status,
                message:guess,
                timeStamp ,
                username ,
                image
            }
        this.chat.push(object_guess)
    }

    getChatLength(){
        return this.chat.length;
    }

    getCurrentTime(){
        let d = new Date(1000*Math.round(this.time/1000)); // round to nearest second
        return pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds());
    }

    isGuessed(){
        return this.first 
    }

    toString(){
        return this.#question + ":R: " + this.#correctAnswered;
    }
}

function pad(i) { return ('0'+i).slice(-2); }

module.exports = { Question };
