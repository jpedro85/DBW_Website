// about us ou index
let redirect_after_login = "/";
let lastSingUpReq ;

// main popupsPopup_ErroPopUp
const poppupLogin = document.querySelector("#Popup-Login");
const conteiner = document.querySelector(".Popup-conteiner");
// popup error
const Popup_ErroPopUp = document.querySelector("#Popup-FetchError");

function openLogin() {
    // making the login popup visible
    poppupLogin.classList.toggle("active");
    conteiner.classList.toggle("active");
}

const FetchError_error = document.querySelector("#FetchError-error");
function showError (Msg){

    closeAllPopUps();

    FetchError_error.innerText = Msg;
    Popup_ErroPopUp.classList.add("active");
    conteiner.classList.add("active");
}

// inpus  do pop up log in
const input_username_login = document.querySelector("#Popup-Login-username");
const input_password_login = document.querySelector("#Popup-Login-password");

// inpus "errorBox" do pop up log in
const input_error_username_login = document.querySelector("#Popup-Login-error-username");
const input_error_password_login = document.querySelector("#Popup-Login-error-password");


// rests the values of the log in form
function resetLogin() {
    // reseting the values of the form
    input_username_login.value = "";
    input_password_login.value = "";
    
    // reseting the text errors
    input_error_username_login.innerText = "";
    input_error_password_login.innerText = "";

    // reseting the boxerror efect
    input_username_login.classList.remove("errorBox");
    input_username_login.classList.remove("errorBox");
}

// inpus do pop up creatAcount
const input_username = document.querySelector("#Popup-creatAcount-username");
const input_email = document.querySelector("#Popup-creatAcount-email");
const input_password = document.querySelector("#Popup-creatAcount-password");
const input_passwordConfirm = document.querySelector("#Popup-creatAcount-password-confirm");

// inpus "errorBox" do pop up creatAcount
const input_error_username = document.querySelector("#Popup-creatAcount-error-username");
const input_error_email = document.querySelector("#Popup-creatAcount-error-email");
const input_error_password = document.querySelector("#Popup-creatAcount-error-password");

// rests the values of the singup form
function resetSingUp() {
    // reseting the values of the form
    input_username.value = "";
    input_email.value = "";
    input_password.value = "";
    input_passwordConfirm.value = "";

    // reseting the text errors
    input_error_password.innerText = "";
    input_error_email.innerText = "";
    input_error_username.innerText = "";

    // reseting the boxerror efect
    input_username.classList.remove("errorBox");
    input_email.classList.remove("errorBox");
    input_password.classList.remove("errorBox");
    input_passwordConfirm.classList.remove("errorBox");
}


// popup createAcount step 2
const Popup_confirmEmail = document.querySelector("#Popup-confirmEmail");
const Popup_AcountCreated = document.querySelector("#Popup-creatAcount");


/*
    expeted response object {
        success : < true or false >,
        errortyoe : < password or email or username or passwordmatch or other >,
        error : <description>
        lastreq : reqForm
    }
*/

// adding handler for Popup-creatAcount-next
document.querySelector("#Popup-creatAcount-next").addEventListener("click" , () => {

    // object represente the form
    let reqForm = {
        signup_username: "",
        signup_email: "",
        signup_password: "",
        signup_repeat_password: "",
        formType: "firstStep"
    } 

    //falta hiden input
    if ( verifyUsername(reqForm) && verifyEmail(reqForm) && verifyPasswordCriterios(reqForm) && verifyPasswordConfimr(reqForm) ){

        // making the request email send
        fetch("https://httpstat.us/404", //Rota para o POST Request
        { 
                method: "POST", //Definir que é método POST
                //Diz ao servidor que o request body está em formato JSON
                headers: { "Content-Type": "application/json", },
                //Transforma o objecto em string e asseguramos que os dadtos estão no formato coreto no “request body” do HTTP
                body: JSON.stringify(reqForm), 
        })
        .then( (res) => { 

            console.log()

            return res.body.json()    
            // if (res.ok) 
            //     return res.body.json()    
            // else 
            //     throw Error(res.status + " " + res.statusText);
        })
        .then( (res_data) => { singUpResponseHandler(res_data) } ) 
        .catch( (error) => showError(error) );

    } 
})

//singupHandlers
function singUpResponseHandler(res) {

    console.log(res);

    if (res.sucess) {
        
        //next step
        Object.assign(lastSingUpReq , res.lastreq) // copia  o objeto para lastSingUpReq
        sendEmaiSendRequest();

        OverlayCloseActive = false;
    } else {

        if ( res.errortype === "username" ){

            input_username.innerText = res.error ;
            input_error_username.classList.add("errorBox");

        } else if ( res.errortype === "email") {

            input_error_email.innerText = res.error ;
            input_email.classList.add("errorBox");

        } else if ( res.errortype === "password" ) {

            input_error_password.innerText = res.error;
            input_password.classList.add("errorBox");

        } else if ( res.errortype === "passwordmatch" ) {

            input_passwordConfirm.innerText = res.error;
            input_passwordConfirm.classList.add("errorBox");

        } else {
            // res.error === "other" 
            showError(res.error);
        }
    }

}

function singUpResponseHandler_Catch(res) {

    if (res.status = 404) {}
}


// adding handler for confirmEmail
document.querySelector("#Popup-confirmEmail-Resend").addEventListener("click" , () => {

    if (lastSingUpReq != null) {

        lastSingUpReq.formType = "secondstep";

        fetch("/", //Rota para o POST Request
        { 
                method: "POST", //Definir que é método POST
                //Diz ao servidor que o request body está em formato JSON
                headers: { "Content-Type": "application/json", },
                //Transforma o objecto em string e asseguramos que os dadtos estão no formato coreto no “request body” do HTTP
                body: JSON.stringify(reqForm), 
        })
        .then((res) => res.json()) 
        .then( SingUpResponseHandler(data) )
        .catch((error) => {
            showError(error);
        });

    }
    
});


/*
    expeting object {
        sucess : <true ,false>
        error : error;
    }
*/

function sendEmaiSendRequest(){

    lastSingUpReq.formType = "secondstep";

    fetch("/", //Rota para o POST Request
        { 
                method: "POST", //Definir que é método POST
                //Diz ao servidor que o request body está em formato JSON
                headers: { "Content-Type": "application/json", },
                //Transforma o objecto em string e asseguramos que os dadtos estão no formato coreto no “request body” do HTTP
                body: JSON.stringify(reqForm), 
        })
        .then((res) => res.json()) 
        .then( emailResponseHandler(data) )
        .catch((error) => {
            showError(error);
    });

}

const Popup_confirmEmail_inputTitel = document.querySelector("#Popup-confirmEmail-inputTitel");

function emailResponseHandler(res) {

    if (res.sucess) {

        Popup_confirmEmail_inputTitel.innerText = lastSingUpReq.email ; 
        Popup_AcountCreated.classList.remove("active");
        Popup_confirmEmail.classList.add("active");

    } else 
        showError(res.error);

}




/*
    expeted response object {
        success : < true or false >,
        errortyoe : < password or username or other >,
        error : <description>
    }
*/

// adding handler for Popup-Login-Button
document.querySelector("#Popup-Login-Button").addEventListener("click" , () => {

    // object represente the form
    let reqForm = {
       username: "",
       password: "",
       formType: "login"
   } 

   //falta hiden input
   if ( verifyUsernamelogin(reqForm) && verifyPasswordlogin(reqForm) ){

       console.log(reqForm);
       // making the request email send
       fetch("/", //Rota para o POST Request
       { 
               method: "POST", //Definir que é método POST
               //Diz ao servidor que o request body está em formato JSON
               headers: { "Content-Type": "application/json", },
               //Transforma o objecto em string e asseguramos que os dadtos estão no formato coreto no “request body” do HTTP
               body: JSON.stringify(reqForm), 
       })
       .then((res) => res.json()) // passa a resposta para json
       .then(loginResponseHandler(data))
       .catch((error) => {
            showError(error);
       });
   } 

})

//log iin handlres 

// handler for the response to login
function loginResponseHandler(res) {

    console.log(res);

    if (res.sucess) {
        // redirect to redirect_after_login 
        window.location.href = redirect_after_login;
    } else {

        if ( res.errortype === "username" ){

            input_error_username_login.innerText = res.error;
            input_username_login.classList.add("errorBox");

        } else if ( res.errortype === "password" ){

            input_error_password_login.innerText = res.error;
            input_password_login.classList.add("errorBox");

        } else {
            // if == "other"
            showError(res.error);
        }
    }

}

// show error continue handler
document.querySelector("#FetchError-continue").addEventListener("click" , () => {
    Popup_ErroPopUp.classList.remove("active");
    conteiner.classList.remove("active");
});

// adding handler for Popup-creatAcoun-Signin-Button
document.querySelector("#Popup-creatAcoun-Signin-Button").addEventListener("click" , () => {
    Popup_creatAcount.classList.remove("active");
    poppupLogin.classList.toggle("active");
    //activeting the closing on outside of the overlay click 
    OverlayCloseActive = true;
});


// adding handler for continuing button
document.querySelector("#AcountCreated-continue").addEventListener("click" , () => {
    Popup_AcountCreated.classList.remove("active");
    conteiner.classList.remove("active");
});


// adding handler for Popup-Login-Signup-Button
document.querySelector("#Popup-Login-Signup-Button").addEventListener("click" , () => {

    // reseting the values of the form
    resetSingUp();

    // making the overlay Creat Acount visible
    poppupLogin.classList.remove("active");
    Popup_AcountCreated.classList.add("active");
    // activeting the closing on outside of the overlay click 
    OverlayCloseActive = true;
});

//auxiliares singup
// object represent the final result
function verifyUsername(object) {

    if (input_username.value != "") {

        if (input_username.value.length < 8 ){

            input_error_username.innerText = "Must be at least 8 characters."
            input_username.classList.add("errorBox");

        } else if ( input_username.value.length <= 25 ) {

            input_error_username.innerText = "";
            input_username.classList.remove("errorBox");
            object["signup_username"] = input_username.value ;

            return true;

        } else {

            input_error_username.innerText = "Must be less then 26 characters."
            input_username.classList.add("errorBox");

        }
    
    } else {
        input_error_username.innerText = "Username cannot be empty."
        input_username.classList.add("errorBox");
    }

    return false;
}

// object represent the final result of the form
function verifyEmail(formResult) {

    if (input_email.value != "") {

        let indexArroba = input_email.value.indexOf('@') ;
        if (  indexArroba > 0 ){

            let indexDot = input_email.value.indexOf('.') ;
           if( indexDot >  indexArroba && indexDot != input_email.value.length - 1 ){

                input_error_email.innerText = "" ;
                input_email.classList.remove("errorBox");

                formResult["signup_email"] = input_email.value ;

                return true;

            } else {
                input_error_email.innerText = "Invalid domain."
                input_email.classList.add("errorBox");
            }

        } else {
            input_error_email.innerText = "Dosen't contein '@'."
            input_email.classList.add("errorBox");
        }

    } else {
        input_error_email.innerText = "Email cannot be empty."
        input_email.classList.add("errorBox");
    }

    return false;

}

// object represent the final result of the form
function verifyPasswordCriterios(formResult) {

    if ( strContain_UperCase(input_password.value) ) {

        if ( strContain_LowerCase(input_password.value) ) {

            if ( strContain_Numbers(input_password.value) ) {

                if ( strContain_Symbols(input_password.value) ){
                    
                    if (input_password.value.length > 7 ){
                        
                        if (input_password.value.length <= 64) {

                            input_error_password.innerText = "";
                            input_password.classList.remove("errorBox");

                            formResult["signup_password"] = input_password.value;

                            return true;

                        } else {
                            console.log("erro2")
                            input_error_password.innerText = "Must be less then 26 characters."
                            input_password.classList.add("errorBox");
                        }

                    } else {
                        input_error_password.innerText = "Must be at least 8 characters."
                        input_password.classList.add("errorBox");
                    }

                } else {
                    input_error_password.innerText = "Must have at least one symbol."
                    input_password.classList.add("errorBox");
                }

            } else {
                input_error_password.innerText = "Must have at least one number."
                input_password.classList.add("errorBox");
            }

        } else {
            input_error_password.innerText = "Must have at least one lowercase lether."
            input_password.classList.add("errorBox");
        }

    } else {
        input_error_password.innerText = "Must have at least one upercase lether."
        input_password.classList.add("errorBox");
    }

    return false;
}

// object represent the final result of the form
function verifyPasswordConfimr(formResult) {

    if (input_password.value === input_passwordConfirm.value) {
        
        input_error_password.innerText = "";
        input_password.classList.remove("errorBox");
        input_passwordConfirm.classList.remove("errorBox");

        formResult.signup_repeat_password = input_passwordConfirm.value;

        return true;

    } else {
        input_error_password.innerText = "Passwords don´t match."
        input_password.classList.add("errorBox");
        input_passwordConfirm.classList.add("errorBox");
    }

    return false;
}


//auxiliares log in
// Check if username field is empty
function verifyUsernamelogin(formResult) {

    if (input_username_login.value != "") {
        
        input_error_username_login.innerText = "";
        input_username_login.classList.remove("errorBox");

        formResult["username"] = input_username_login.value ;

        return true;

    } else {
        input_error_username_login.innerText = "Username is empty."
        input_username_login.classList.add("errorBox");
    }

    return false;
}

// Check if username field is empty
function verifyPasswordlogin(formResult) {

    console.log(input_password_login.value)

    if (input_password_login.value != "") {
        
        input_error_password_login.innerText = "";
        input_password_login.classList.remove("errorBox");

        formResult["password"] = input_password_login.value ;

        return true;

    } else {
        input_error_password_login.innerText = "Password is empty."
        input_password_login.classList.add("errorBox");
    }

    return false;
}



