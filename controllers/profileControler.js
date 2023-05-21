const fetchedDatabaseUserMetrics = require("../model/metrics.model.js");
const fetchedDatabaseUser = require("../model/user.model.js");
const {is_Username_Invalid} = require('./Validations.Controler.js');
const {sendConfirmEmail} = require('./emailController.js');

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
    }
}

async function updateUsername(request, response) {
    // Fetches the description from the form
    const username = request.user.username;
    const changedUsername = request.body.changedUsername
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
            fetchedUser.username = changedUsername;
            // Update the the fetchedUserMetrics username locally
            fetchedUserMetrics.username= changedUsername;
            
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

async function updateEmail(request,response) {
    const userEmail = request.user.email;
    const changedEmail = request.body.changedEmail;
    try {

        if (changedEmail===userEmail) {
            const responseObject={
                success:false,
                errortype: "email",
                error: "It's the same email!",
            }
            return response.send(responseObject);
        }
        const fetchedUser = await fetchedDatabaseUser.findOne({email:userEmail});

        if (fetchedUser){
            // creates a new JSON web Token based on the new email
            // Update the users status
            fetchedUser.status = "Pending";
            sendConfirmEmail(changedEmail,fetchedUser.confirmationCode)
            .then(async (hasError)=>{
                if (hasError != true){
                    response.send({
                      success: false,
                      email: changedEmail,
                      errortype: "email",
                      error: "Invalid email",
                    });
                } else {
                    // saves the changes made on the database
                    //await fetchedUser.save();
                    const responseObject ={
                        success:true,
                        changedEmail: changedEmail,
                        message: "Check the EmailBox it was sent a confirmation code to reactivate your account",
                    }
                    response.send(responseObject);
                }
            });
        }
    } catch (updatingError) {
        console.log(updatingError.keyPattern);
    }
}

// exporting the handler
module.exports = { profileController, updateUsername ,updateEmail};
