const fetchedDatabaseUserMetrics = require("../model/metrics.model.js");
const fetchedDatabaseUser = require("../model/user.model.js");
const {is_Username_Invalid} = require('./Validations.Controler.js');
// creating the profile handler
function profileController(request, response) {
    const isUserLogged = request.isAuthenticated();
    //shows the ejs page on the site and use the model to fill dynamically
    if (!isUserLogged) {
        const pageInfo = {
            isUserLogged: isUserLogged,
            showAcountCreated: false,
            confirmstate: false,
            showIndexOnUnauthenticated: true,
            page: "profile",
        };
        return response.render("index",  pageInfo );
    } else {
        const metricsFound = fetchedDatabaseUserMetrics
            .findOne({
                username: request.user.username,
            })
            .then((metricsFound) => {
                if (!metricsFound) {
                    throw new Error("User Metrics Not Found");
                } else {
                    const userWinRate = metricsFound.totalWins / metricsFound.totalGames;
                    const totalWins = metricsFound.totalGames - metricsFound.totalLost - metricsFound.totalDraws;
                    const totalUnanswered = metricsFound.totalQuestions - metricsFound.totalQuestionsAnswered;
                    const totalQuestionsWrong = metricsFound.totalQuestions - metricsFound.totalQuestionsRight;
                    const userData = {
                        isUserLogged: isUserLogged,
                        username: request.user.username,
                        email: request.user.email,
                        totalGames: metricsFound.totalGames,
                        totalLost: metricsFound.totalLost,
                        totalDraws: metricsFound.totalDraws,
                        totalQuits: metricsFound.totalQuits,
                        totalQuestions: metricsFound.totalQuestions,
                        totalQuestionsAnswered: metricsFound.totalQuestionsAnswered,
                        totalQuestionsRight: metricsFound.totalQuestionsRight,
                        totalPodium: metricsFound.totalPodium,
                        totalLastPlace: metricsFound.totalLastPlace == 0 ? "N/A" : metricsFound.totalLastPlace + "º",
                        mostCommonPlace: metricsFound.mostCommonPlace == 0 ? "N/A" : metricsFound.mostCommonPlace + "º",
                        totalPoints: metricsFound.totalPoints,
                        totalStreak: metricsFound.totalStreak,
                        totalBonusPoints: metricsFound.totalBonusPoints,
                        bestStreak: metricsFound.bestStreak,
                        bestPlace: metricsFound.bestPlace == 0 ? "N/A" : metricsFound.bestPlace + "º",
                        winRate: userWinRate === "NaN" ? userWinRate : 0.0,
                        wins: totalWins,
                        unanswered: totalUnanswered,
                        questionsWrong: totalQuestionsWrong,
                    };
                    return response.render("profile", { userData });
                }
            })
            .catch((error) => {
                console.error(error);
            });
        //return response.render( page , pageInfo );
    }
    //renderPageWithAuthStatus(req, res, "profile", {user:req.user}, true);
}

async function updateUsername(request, response) {
    // Fetches the description from the form
    const username = request.user.username;
    const changedUsername = request.body.username
    try {
        const checkUsername = is_Username_Invalid(changedUsername);

        if (checkUsername) {
            const responseObject={
                success:false,
                errortype: "username",
                error: checkUsername,
            }
            return response.send(responseObject);
        }
        // Find the user in database by username
        const fetchedUser = await fetchedDatabaseUser.findOne({ username: username });
        const fetchedUserMetrics = await fetchedDatabaseUserMetrics.findOne({username:username}) 
        
        if (fetchedUser && fetchedUserMetrics) {

            // Update the the fetchedUser username locally
            fetchedUser.username = request.body.username;
            // Update the the fetchedUserMetrics username locally
            fetchedUserMetrics.username= request.body.username;
            
            // Saves the changes made on the DB
            //await fetchedUser.save();
            //await fetchedUserMetrics.save();

            // Redirects to the index page after the process is done
            const responseObject ={
                success:true,
                changedUsername: changedUsername,
            }
            response.send(responseObject);
        } else {
            throw new Error("User Not Found");
        }
    } catch (updateError) {
        const responseObject={
            success:false,
            errortype:"other",
            error: updateError.message,
        }
        response.send(responseObject)
    }
}

// exporting the handler
module.exports = { profileController, updateUsername };
