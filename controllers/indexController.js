/**
 * The Get and Post functions if needed
 */
const indexController = function (req,res) {
    //shows the index.ejs page on web page and use the model to fill dynamically
    res.render("index");
}

// Export the controller functions
module.exports = indexController;