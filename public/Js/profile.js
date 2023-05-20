const editPic=document.querySelector("#Edit-picture");
const editName=document.querySelector("#Edit-Name");
const editEmail=document.querySelector("#Edit-Email");


const conteiner = document.querySelector(".Popup-conteiner");
const ImgPopup = document.querySelector("#Popup-Image");
const NamePopup = document.querySelector("#Popup-Name");
const EmailPopup = document.querySelector("#Popup-Email");

editPic.addEventListener("click",()=>{
    conteiner.classList.toggle("active");
    ImgPopup.classList.toggle("active");
})

editName.addEventListener("click",()=>{
    conteiner.classList.toggle("active");
    NamePopup.classList.toggle("active");
})

editEmail.addEventListener("click",()=>{
    conteiner.classList.toggle("active");
    EmailPopup.classList.toggle("active");
})


// inpus  do pop up log in
const input_Username = document.querySelector("#new-username");
const input_Email = document.querySelector("#new-email");


// inpus "errorBox" do pop up log in
const input_error_new_username = document.querySelector("#Popup-Change-username-error");
const input_error_new_email = document.querySelector("#Popup-Change-email-error");


input_Username.addEventListener("keydown",() => {
    input_Username.classList.remove("errorBox") 
    input_error_new_username.innerText = "";
});

input_Email.addEventListener("keydown",() => {
    input_Email.classList.remove("errorBox") 
    input_error_new_email.innerText = "";
});

// adding handler for Popup-Confirm-New-Username
document.querySelector("#Popup-Confirm-New-Username").addEventListener("click" , () => {
    // object represents the form
    let reqForm = {
       username: ""
    }     
    // Misses the hidden input
    if ( verifyNewUsername(reqForm)){
        sendRequest(reqForm,changeUsernameResponseHandler);
    } 
});

// adding handler for Popup-Confirm-New-Email
document.querySelector("#Popup-Confirm-New-Email").addEventListener("click" , () => {
    // object represente the form
    let reqForm = {
       email: ""
    }     
   //falta hiden input
    if ( verifyNewEmail(reqForm)){
        console.log("🚀 ~ reqForm:", reqForm);
        // sendRequest(reqForm,loginResponseHandler);
        
    } 
});

const FetchError_error = document.querySelector("#FetchError-error");
function showError (Msg){

    closeAllPopUps();

    FetchError_error.innerText = Msg;
    Popup_ErroPopUp.classList.add("active");
    conteiner.classList.add("active");
}

// object represent the final result of the form
function verifyNewUsername(formResult) {
    if(input_Username.value ==""){
        input_error_new_username.innerText = "Username is empty."
        input_Username.classList.add("errorBox");  
    }
    else if(input_Username.value.length < 8 || input_Username.value.length > 25){
        input_error_new_username.innerText = "Must have at least 8 and at most 25 characters."
        input_Username.classList.add("errorBox"); 
    }
    else {
        input_error_new_username.innerText = "";
        input_Username.classList.remove("errorBox");
        formResult["username"] = input_Username.value ;
        return true;
    }

    return false;
}

// object represent the final result of the form
function verifyNewEmail(formResult) {

    if (input_Email.value == "") {
        input_error_new_email.innerText = "Email cannot be empty."
        input_Email.classList.add("errorBox");
        return false;
    } 

    let indexArroba = input_Email.value.indexOf('@') ;
    let indexDot = input_Email.value.indexOf('.') ;
    if (indexArroba < 0) {
        input_error_new_email.innerText = "Dosen't contein '@'."
        input_Email.classList.add("errorBox");
    
    }else if( indexDot <  indexArroba || indexDot == input_Email.value.length - 1 ){
        input_error_new_email.innerText = "Invalid domain."
        input_Email.classList.add("errorBox");
        
    } else {
        formResult["email"] = input_Email.value ;
        return true;
    }
      
    return false;
}

const usernameShowcase = document.querySelector("#JoinCode-Copy-input");
function changeUsernameResponseHandler(res) {
    
    if (res.success) {
        usernameShowcase.innerText=res.changedUsername;
    } else {

        if ( res.errortype === "username") {

            input_error_password_login.innerText = res.message.error;
            input_username_login.classList.add("errorBox");
            input_password_login.classList.add("errorBox");

        } else {
            showError(res.error);
        }
    }

}

function sendRequest(reqForm,responseHandler){

    // making the request email send
    fetch("/profile", //Rota para o POST Request
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


//logout ...
const logOut = document.getElementById("Log-Out-Button");

logOut.addEventListener("click" , () => {

    reqForm = {
        formType: "logout",
    }

    fetch("/" , {
        method: "POST", // defining the requesthe method and body format
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(reqForm),
    
    }).finally( () => {
        
        if (window.location.href.includes("about")) {
            window.location.href = "/about-us";
        }
        else{
            window.location.href = "/";
        }

    });

});

