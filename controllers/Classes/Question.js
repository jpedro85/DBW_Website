class Question {

    static async fetchQuestionAPI(match,difficulty,callback_success,callback_error,type=""){

        if(type)
            type = "&category="+type; //0-23

        fetch(`https://opentdb.com/api.php?amount=1&difficulty=${difficulty.toLowerCase()}&type=multiple${type}`)
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
}

module.exports = { Question };
