//importing router
const router = require("express").Router();
//importing the handler
const {profileController, updateUsername, updateEmail} = require("../controllers/profileControler.js");

const {validateObject} = require('../controllers/Validations.Controler.js');

// adding the route
router.get("/Profile",profileController);
router.post("/Profile", (request,response)=>{
    if (validateObject(request.body,"formtype")) {
        const formType = request.body.formtype;
        if (formType === "changeUsername") {
            updateUsername(request,response);
        } else if (formType === "changeEmail") {
            updateEmail(request,response);
        }
    }
});

//exporting router
module.exports = router;
