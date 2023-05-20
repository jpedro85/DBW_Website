const { renderPageWithAuthStatus } = require("../controllers/userController.js");
const fetchedUserMetrics = require("../model/metrics.model.js");
const fetchedDatabaseUser = require("../model/user.model.js");
// creating the profile handler
const profileControler = function profileControler(req, response) {
    const isUserLogged = req.isAuthenticated();
    let userData={};
    userData["isUserLogged"] = isUserLogged;
    //shows the ejs page on the site and use the model to fill dynamically
    if (!isUserLogged){
      return response.render("index", { isUserLogged: isUserLogged , showAcountCreated : false , confirmstate : false , showIndexOnUnauthenticated:true , page:"profile"} );
    }else {
        const metricsFound = fetchedUserMetrics.findOne({
            username: req.user.username,
          }).then((metricsFound)=>{
            if(!metricsFound){
                throw new Error("not found");
            }
            else{
                const userWinRate = metricsFound.totalWins/metricsFound.totalGames;
                const totalWins = metricsFound.totalGames-metricsFound.totalLost-metricsFound.totalDraws;
                const totalUnanswered= metricsFound.totalQuestions-metricsFound.totalQuestionsAnswered;
                const totalQuestionsWrong= metricsFound.totalQuestions-metricsFound.totalQuestionsRight
                userData = {
                username: req.user.username,
                email: req.user.email,
                totalGames: metricsFound.totalGames,
                totalLost: metricsFound.totalLost,
                totalDraws: metricsFound.totalDraws,
                totalQuits: metricsFound.totalQuits,
                totalQuestions: metricsFound.totalQuestions,
                totalQuestionsAnswered: metricsFound.totalQuestionsAnswered,
                totalQuestionsRight: metricsFound.totalQuestionsRight,
                totalPodium: metricsFound.totalPodium,
                totalLastPlace: (metricsFound.totalLastPlace==0)? "N/A":metricsFound.totalLastPlace+"º",
                mostCommonPlace: (metricsFound.mostCommonPlace==0)? "N/A":metricsFound.mostCommonPlace+"º",
                totalPoints: metricsFound.totalPoints,
                totalStreak: metricsFound.totalStreak,
                totalBonusPoints: metricsFound.totalBonusPoints,
                bestStreak: metricsFound.bestStreak,
                bestPlace: (metricsFound.bestPlace==0)? "N/A":metricsFound.bestPlace+"º",
                winRate: (userWinRate==="NaN")? userWinRate :0.00,
                wins: totalWins,
                unanswered: totalUnanswered,
                questionsWrong:totalQuestionsWrong,
            };
            console.log(userWinRate);
            return response.render( "profile" , {userData} );
            }
          }).catch((error) =>{
            console.error(error);
          })
      //return response.render( page , pageInfo );
    }
  //renderPageWithAuthStatus(req, res, "profile", {user:req.user}, true);
};

// exporting the handler
module.exports = profileControler;


const updateUsername = async function (request, response) {
    console.log("error");
    // Fetches the description from the form
    const username = request.user;
    try {
      // Find book in database by object id
      const fetched = await fetchedDatabaseUser.findOne({username: username});
      if (fetched) {
        // Update the the fetchedBook description locally
        fetched.username = request.username;
        // Saves the changes made on the DB
        await fetched.save();
        // Redirects to the index page after the process is done
        response.redirect("/Profile");
      } else {
        console.log("test");
      }
    } catch (updateError) {
      console.error(updateError);
    }
  };