// about us ou index
let redirect_after_login ;
let lastSingUpReq ;

// main popupsPopup_ErroPopUp
const poppupLogin = document.querySelector("#Popup-Login");
const conteiner = document.querySelector(".Popup-conteiner");
// popup error
const Popup_ErroPopUp = document.querySelector("#Popup-FetchError");

function openLogin() {
    // making the login popup visible
    poppupLogin.classList.add("active");
    conteiner.classList.add("active");
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

input_username_login.addEventListener("keydown",() => {
    input_username_login.classList.remove("errorBox")
    input_error_username_login.innerText = "";
})

input_password_login.addEventListener("keydown",() => {
    input_password_login.classList.remove("errorBox")
    input_error_password_login.innerText = "";
})

/**
 * rests the values of the log in form
 *
 * @return  {void}  
 */ 
function resetLogin() {
    // reseting the values of the form
    input_username_login.value = "";
    input_password_login.value = "";
    
    // reseting the text errors
    input_error_username_login.innerText = "";
    input_error_password_login.innerText = "";

    // reseting the boxerror efect
    input_username_login.classList.remove("errorBox");
    input_password_login.classList.remove("errorBox");
}

// inpus do pop up creatAcount
const input_username = document.querySelector("#Popup-creatAcount-username");
const input_email = document.querySelector("#Popup-creatAcount-email");
const input_password = document.querySelector("#Popup-creatAcount-password");
const input_passwordConfirm = document.querySelector("#Popup-creatAcount-password-confirm");

input_username.addEventListener("keydown",() => {
    input_username.classList.remove("errorBox")
    input_error_username.innerText = "";
})

input_email.addEventListener("keydown",() => {
    input_email.classList.remove("errorBox")
    input_error_email.innerText = ""
})

input_password.addEventListener("keydown",() => {
    input_password.classList.remove("errorBox")
    input_passwordConfirm.classList.remove("errorBox")
    input_error_password.innerText = ""
})

input_passwordConfirm.addEventListener("keydown",() => {
    input_password.classList.remove("errorBox")
    input_passwordConfirm.classList.remove("errorBox")
    input_error_password.innerText = ""
})

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
const Popup_creatAcount = document.querySelector("#Popup-creatAcount");


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

    // object represents the form
    let reqForm = {
        username: "",
        email: "",
        password: "",
        repeat_password: "",
        formType: "register"
    } 

    if ( verifyUsername(reqForm) && verifyEmail(reqForm) && verifyPasswordCriterios(reqForm) && verifyPasswordConfimr(reqForm) ){
        sendRequest(reqForm,singUpResponseHandler);
    }

})

function sendRequest(reqForm,responseHandler){

    // making the request email send
    fetch("/", //Rota para o POST Request
    { 
        method: "POST", // defining the request's method and body format
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(reqForm),  
    })
    .then( (res) => {   
        if (res.ok) 
             return res.json()  
        else 
            throw Error( res.status + " " + res.statusText );
    })
    .then( (res_data) => { responseHandler(res_data) } ) 
    .catch( (error) => showError(error) );

}

const Popup_confirmEmail_emailshow = document.querySelector("#Popup-confirmEmail-emailshow");
const Popup_AcountCreated = document.querySelector("#Popup-AcountCreated");

const SuccessfullyCreated_resend = document.querySelector("#SuccessfullyCreated-resend");
const SuccessfullyCreated_normal = document.querySelector("#SuccessfullyCreated-normal");
//singupHandlers
function singUpResponseHandler(res) {

    if (res.success) {

        lastSingUpReq = {
            username: res.username,
            email: res.email,
        } 
        
        // opening popup confirmm
        Popup_confirmEmail_emailshow.innerText = lastSingUpReq.email ; 
        Popup_creatAcount.classList.remove("active");
        Popup_confirmEmail.classList.add("active");

        OverlayCloseActive = false;
    } else {

        if ( res.errortype === "username" ){

            input_error_username.innerText = res.error ;
            input_username.classList.add("errorBox");

        } else if ( res.errortype === "email") {

            input_error_email.innerText = res.error ;
            input_email.classList.add("errorBox");
        
        } else if ( res.errortype === "emailInUse") {

            input_error_email.innerText = res.error ;
            input_email.classList.add("errorBox");

        } else if ( res.errortype === "acountPending") {

            SuccessfullyCreated_normal.style.display = "none";
            SuccessfullyCreated_resend.style.display = "flex";
            
            Popup_creatAcount.classList.remove("active");
            Popup_AcountCreated.classList.add("active");

            lastSingUpReq = {
                username: res.username,
                email: res.email,
            } 

        } else if ( res.errortype === "password" ) {
            
            input_error_password.innerText = res.error;
            input_password.classList.add("errorBox");

        } else if ( res.errortype === "passwordmatch" ) {

            input_error_password.innerText = res.error;
            input_password.classList.add("errorBox");
            input_passwordConfirm.classList.add("errorBox");

        } else 
            showError(res.error);
    }  

}

// adding handler for resent email
document.querySelector("#Popup-confirmEmail-Resend").addEventListener("click" , () => {

    if (lastSingUpReq != null) { 
        lastSingUpReq.formType = "resend" ; 
        sendRequest(lastSingUpReq,emailResponceHandler);
    }

});

// adding handler for resent email in aconte already created
document.querySelector("#Popup-AcountCreated-btn-recent").addEventListener("click" , () => {
    
        Popup_confirmEmail_emailshow.innerText = lastSingUpReq.email ; 
        Popup_AcountCreated.classList.remove("active");
        Popup_confirmEmail.classList.add("active");
});

/*
    expeted response object {
        success : < true or false >,
        error : <description>
    }
*/
function emailResponceHandler(res) {

    if (!res.success) 
        showError(res.error);

}

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
        sendRequest(reqForm,loginResponseHandler);
    } 

})

/*
    expeted response object {
        success : < true or false >,
        errortyoe : < password or username or other >,
        error : <description>
    }
*/
// handler for the response to login
function loginResponseHandler(res) {

    if (res.message.success) {
        window.location.href = redirect_after_login;
    } else {

        if ( res.message.errortype === "credentials") {

            input_error_password_login.innerText = res.message.error;
            input_username_login.classList.add("errorBox");
            input_password_login.classList.add("errorBox");

        } else if (res.message.errortype === "pending" ) {

            input_error_password_login.innerText = res.message.error;

        } else {

            if (res.message.error != null)
                showError(res.message.error);
            else 
                showError("Error 500 : Server error")
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
    Popup_creatAcount.classList.add("active");
    // activeting the closing on outside of the overlay click 
    OverlayCloseActive = true;
});

//auxiliares singup
// object represent the final result
function verifyUsername(object) {

    if (input_username.value == "") {
        input_error_username.innerText = "Username cannot be empty."
        input_username.classList.add("errorBox");

    } else if (input_username.value.length < 8 || input_username.value.length > 25) {
        input_error_username.innerText = "Must have at least 8 and at most 25 characters."
        input_username.classList.add("errorBox");

    } else {
        input_error_username.innerText = "";
        input_username.classList.remove("errorBox");
        object["username"] = input_username.value ;

        return true;
    }

    return false;
}

// object represent the final result of the form
function verifyEmail(formResult) {

    if (input_email.value == "") {
        input_error_email.innerText = "Email cannot be empty."
        input_email.classList.add("errorBox");
        return false;
    } 

    let indexArroba = input_email.value.indexOf('@') ;
    let indexDot = input_email.value.indexOf('.') ;
    if (indexArroba < 0) {
        input_error_email.innerText = "Dosen't contein '@'."
        input_email.classList.add("errorBox");
    
    }else if( indexDot <  indexArroba || indexDot == input_email.value.length - 1 ){
        input_error_email.innerText = "Invalid domain."
        input_email.classList.add("errorBox");
        
    } else {
        formResult["email"] = input_email.value ;
        return true;
    }
      
    return false;
}

// object represent the final result of the form
function verifyPasswordCriterios(formResult) {

    console.log(input_password.value.length)
    if (input_password.value.length < 8 || input_password.value.length  > 64) {
        input_error_password.innerText = "Must have at least 8 and at most 64 characters."
        input_password.classList.add("errorBox");

    } else if (!strContain_UperAndLower(input_password.value)) {
        input_error_password.innerText = "Must have lower and uppercase characters."
        input_password.classList.add("errorBox");

    } else if (!strContain_Numbers(input_password.value)){
        input_error_password.innerText = "Must have at least one number."
        input_password.classList.add("errorBox");

    } else if (!strContain_Symbols(input_password.value)){
        input_error_password.innerText = "Must have at least one symbol."
        input_password.classList.add("errorBox");

    } else {
        formResult["password"] = input_password.value;
        return true;
    }

    return false;
}

// object represent the final result of the form
function verifyPasswordConfimr(formResult) {

    if (input_password.value === input_passwordConfirm.value) {
        formResult["repeat_password"] = input_passwordConfirm.value;
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

    if (input_password_login.value != "") {
        formResult["password"] = input_password_login.value ;
        return true;

    } else {
        input_error_password_login.innerText = "Password is empty."
        input_password_login.classList.add("errorBox");
    }

    return false;
}

