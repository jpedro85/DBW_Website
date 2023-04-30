/**
 * The Get and Post functions if needed
 */
const aboutUsController = function (req,res) {
    //shows the aboutUs.ejs page on web page and use the model to fill dynamically
    res.render("aboutUs");
}

// Export the controller functions
module.exports = aboutUsController;