// Importing only the function renderPageWithAuthStatus fromm userController
const { finished } = require("nodemailer/lib/xoauth2/index.js");
const {renderPageWithAuthStatus } = require("../controllers/userController.js");
// Importing only the function validate object from validate.Controler.js
const { validateObject, validateEnum } = require("../controllers/Validations.Controler.js");
// inporting classes
const {Match , MatchNormal, MatchVotedTheme , MatchPlayer} = require("./Classes/Matches.js")

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

function codeAlreadyExits(code) {

    for(let match of AllPrivateMatches){
      if(match.joinCode === code)
        return true;
    }

    return false;
}

const PrivateMatches = []

// functionn to handler the request
function playOptionsControler(request, response) {

  let code = "";
  do {
    code = generateJoinCode()
  } while(codeAlreadyExits(code && code===""));

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

      res.redirect("/play/Game/"+code);

    } else 
      res.send({success: false , errortype : "other" , error: "Not all required information are valid." });

  }else
    res.send({success: false , errortype : "other" , error: "Invalid form submitted on request." });
}

// function to handle the join match request
function playOption_JoinMatch (req ,res) {

  if (validateObject(req.body,"code")) {

    if(req.body.code == ""){
      res.send( {success: false , errortype : "code" , error: "Invalid Join Code." } )

    }else{
      const match = getMatchByCode(req.body.code);
    
      if (match) {

        // playerJoin returns true if joined or rejoin and error if not
        /**
         * joined_result = {joined: boolean , error = ""}
         */
        let joined_result = match.playerJoin(req.user);
        if ( joined_result.success )
          res.redirect("/play/Game/"+req.body.code);
        else
          res.send( joined_result )

      } else
      res.send( {success: false , errortype : "code" , error: "Invalid Join Code." } )

    }
 
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

    console.log("getMatchByCode:"+code)
    
    if (AllPrivateMatches[i].joinCode === code)
      return AllPrivateMatches[i];
  }

  return false;
}

function getPlayerInMatchByCode (user,code){

  for (let i = 0; i < AllPrivateMatches.length; i++) {

    console.log("getMatchByCode:"+code)
    
    if (AllPrivateMatches[i].joinCode === code)
      return AllPrivateMatches[i].hasPlayer(user.username);
      
  }

  return false;
}



//exporting the router the handler
module.exports = { AllPrivateMatches , getPlayerInMatchByCode , getMatchByCode ,playOption_JoinMatch ,playOption_CreateMatch ,playOptionsControler };
