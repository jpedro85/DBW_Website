const fetchedDatabaseUserMetrics = require("../model/metrics.model.js");
const fetchedDatabaseUser = require("../model/user.model.js");
const { is_Username_Invalid } = require("./Validations.Controler.js");
const { sendConfirmEmail } = require("./emailController.js");

// creating the profile handler
function profileController(request, response) {
    const isUserLogged = request.isAuthenticated();
    // shows the ejs page on the site and use the model to fill dynamically
    if (!isUserLogged) {
        const pageInfo = {
            isUserLogged: isUserLogged,
            showAccountCreated: false,
            showDeletedAccount: false,
            confirmstate: false,
            showIndexOnUnauthenticated: true,
            changeOnProfile: false,
            page: "profile",
        };
        return response.render("index", pageInfo);
    } else {
        const metricsFound = fetchedDatabaseUserMetrics
            .findOne({
                username: request.user.username,
            })
            .then((metricsFound) => {
                if (!metricsFound) {
                    throw new Error("User Metrics Not Found");
                } else {
                    const userWinRate = (metricsFound.totalWins / metricsFound.totalGames) * 100;
                    const totalWins = metricsFound.totalGames - metricsFound.totalLost - metricsFound.totalDraws;
                    const totalUnanswered = metricsFound.totalQuestions - metricsFound.totalQuestionsAnswered;
                    const totalQuestionsWrong = metricsFound.totalQuestions - metricsFound.totalQuestionsRight;
                    const userData = {
                        isUserLogged: isUserLogged,
                        username: request.user.username,
                        email: request.user.email,
                        profileImage: request.user.profileImage,
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
    try {
        const username = request.user.username;
        const changedUsername = request.body.changedUsername;
        const checkUsername = is_Username_Invalid(changedUsername);

        if (checkUsername) {
            const responseObject = {
                success: false,
                errortype: "username",
                error: checkUsername,
            };
            return response.send(responseObject);
        }
        // Find the user in database by username
        const fetchedUser = await fetchedDatabaseUser.findOne({ username: username });
        const fetchedUserMetrics = await fetchedDatabaseUserMetrics.findOne({ username: username });
        const isUsernameUsed = await fetchedDatabaseUser.findOne({ username: changedUsername });
        if (isUsernameUsed) {
            const responseObject = {
                success: false,
                errortype: "username",
                error: "Username already Taken",
            };
            return response.send(responseObject);
        }
        if (fetchedUser && fetchedUserMetrics) {
            // Update the the fetchedUser username locally
            fetchedUser.username = changedUsername;
            // Update the the fetchedUserMetrics username locally
            fetchedUserMetrics.username = changedUsername;

            // Saves the changes made on the DB
            await fetchedUser.save();
            await fetchedUserMetrics.save();

            profileLogout(request, response);

            // Redirects to the index page after the process is done
            const responseObject = {
                isUserLogged: false,
                showAccountCreated: false,
                showIndexOnUnauthenticated: false,
                confirmstate: false,
                changeOnProfile: true,
                showDeletedAccount: false,
                showChangeProfile: { value: true, message: "your Username" },
                showConfirmEmail: { value: false },
            };

            return response.render("index", responseObject);
        } else {
            throw new Error("User Not Found");
        }
    } catch (updateError) {
        const responseObject = {
            success: false,
            errortype: "other",
            error: updateError.message,
        };
        response.send(responseObject);
    }
}

async function updateEmail(request, response) {
    try {
        const userEmail = request.user.email;
        const changedEmail = request.body.changedEmail;
        if (changedEmail === userEmail) {
            const responseObject = {
                success: false,
                errortype: "email",
                error: "It's the same email!",
            };
            return response.send(responseObject);
        }
        const fetchedUser = await fetchedDatabaseUser.findOne({ email: userEmail });
        const fetchedUserEmail = await fetchedDatabaseUser.findOne({ email: changedEmail });
        if (fetchedUserEmail) {
            return response.send({
                success: false,
                email: changedEmail,
                errortype: "email",
                error: "Email already in use!",
            });
        }
        if (fetchedUser) {
            // Update the users status
            fetchedUser.status = "Pending";
            fetchedUser.email = changedEmail,
            sendConfirmEmail(changedEmail, fetchedUser.confirmationCode).then(async (hasError) => {
                if (hasError != true) {
                    response.send({
                        success: false,
                        email: changedEmail,
                        errortype: "email",
                        error: "Invalid email",
                    });
                } else {
                    // saves the changes made on the database
                    await fetchedUser.save();

                    profileLogout(request, response);

                    const responseObject = {
                        isUserLogged: false,
                        showAccountCreated: false,
                        showIndexOnUnauthenticated: false,
                        confirmstate: false,
                        changeOnProfile: true,
                        showDeletedAccount: false,
                        showChangeProfile: { value: false },
                        showConfirmEmail: { value: true, changedEmail: changedEmail },
                    };
                    return response.render("index", responseObject);
                }
            });
        }
    } catch (updatingError) {
        const responseObject = {
            success: false,
            errortype: "other",
            error: updatingError.message,
        };
        response.send(responseObject);
    }
}

async function updateProfileImage(request, response) {
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    try {
        const username = request.user.username;
        const imageCode = request.body.imageCode;
        const imageType = request.body.imageType;
        if (!imageCode) {
            const responseObject = {
                success: false,
                errortype: "image",
                error: "No image was given!",
            };
            return response.send(responseObject);
        }
        if (!validImageTypes.includes(imageType)) {
            const responseObject = {
                success: false,
                errortype: "image",
                error: "Must be jpeg / png / jpg image format any others are not valid!",
            };
            return response.send(responseObject);
        }
        const fetchedUser = await fetchedDatabaseUser.findOne({ username: username });
        if (fetchedUser) {
            // Changes the user profile image code for another
            fetchedUser.profileImage = imageCode;

            // Saves the changes made on the database
            await fetchedUser.save();

            // Logs out the user
            profileLogout(request, response);

            const responseObject = {
                isUserLogged: false,
                showAccountCreated: false,
                showIndexOnUnauthenticated: false,
                confirmstate: false,
                changeOnProfile: true,
                showDeletedAccount: false,
                showChangeProfile: { value: true, message: "your Profile Picture" },
                showConfirmEmail: { value: false },
            };

            return response.render("index", responseObject);
        } else {
            throw new Error("User not found");
        }
    } catch (updatingError) {
        const responseObject = {
            success: false,
            errortype: "other",
            error: updatingError.message,
        };
        response.send(responseObject);
    }
}

async function deleteAccount(request, response) {
    try {
        const username = request.user.username;
        const fetchedUser = fetchedDatabaseUser.findOne({ username: username });
        const fetchedUserMetrics = fetchedDatabaseUserMetrics.findOne({ username: username });
        if (fetchedUser && fetchedUserMetrics) {
            profileLogout(request, response);

            // Deletes the account from all related databases
            await fetchedDatabaseUser.deleteOne({ username: username });
            await fetchedDatabaseUserMetrics.deleteOne({ username: username });
            const responseObject = {
                isUserLogged: false,
                showAccountCreated: false,
                showIndexOnUnauthenticated: false,
                confirmstate: false,
                changeOnProfile: true,
                showDeletedAccount: true,
                showChangeProfile: false,
                showConfirmEmail: { value: false },
            };

            return response.render("index", responseObject);
        } else {
            throw new Error("User not found");
        }
    } catch (deleteError) {
        const responseObject = {
            success: false,
            errortype: "other",
            error: deleteError.message,
        };
        response.send(responseObject);
    }
}

function profileLogout(request, response) {
    request.logout(function (logoutError) {
        if (logoutError) {
            const responseObject = {
                success: false,
                error: logoutError.message,
            };
            return response.send(responseObject);
        }
        // Destroys the session of the user
        request.session.destroy(function (sessionError) {
            if (sessionError) {
                const responseObject = {
                    success: false,
                    error: sessionError.message,
                };
                return response.send(responseObject);
            }
        });
    });
}

// exporting the handler
module.exports = { profileController, updateUsername, updateEmail, updateProfileImage, deleteAccount };
