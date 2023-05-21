const editPic = document.querySelector("#Edit-picture");
const editName = document.querySelector("#Edit-Name");
const editEmail = document.querySelector("#Edit-Email");

const conteiner = document.querySelector(".Popup-conteiner");
const ImgPopup = document.querySelector("#Popup-Image");
const NamePopup = document.querySelector("#Popup-Name");
const EmailPopup = document.querySelector("#Popup-Email");

editPic.addEventListener("click", () => {
    conteiner.classList.toggle("active");
    ImgPopup.classList.toggle("active");
});

editName.addEventListener("click", () => {
    conteiner.classList.toggle("active");
    NamePopup.classList.toggle("active");
});

editEmail.addEventListener("click", () => {
    conteiner.classList.toggle("active");
    EmailPopup.classList.toggle("active");
});

// inpus  do pop up log in
const input_Username = document.querySelector("#new-username");
const input_Email = document.querySelector("#new-email");

// inpus "errorBox" do pop up log in
const input_error_new_username = document.querySelector("#Popup-Change-username-error");
const input_error_new_email = document.querySelector("#Popup-Change-email-error");

input_Username.addEventListener("keydown", () => {
    input_Username.classList.remove("errorBox");
    input_error_new_username.innerText = "";
});

input_Email.addEventListener("keydown", () => {
    input_Email.classList.remove("errorBox");
    input_error_new_email.innerText = "";
});

// adding handler for Popup-Confirm-New-Username
document.querySelector("#Popup-Confirm-New-Username").addEventListener("click", () => {
    // object represents the form
    let reqForm = {
        changedUsername: "",
        formtype: "changeUsername",
    };
    if (verifyNewUsername(reqForm)) {
        sendRequest(reqForm, changeUsernameResponseHandler);
    }
});

// adding handler for Popup-Confirm-New-Email
document.querySelector("#Popup-Confirm-New-Email").addEventListener("click", () => {
    // object represente the form
    let reqForm = {
        changedEmail: "",
        formtype: "changeEmail",
    };
    if (verifyNewEmail(reqForm)) {
        sendRequest(reqForm, changeEmailResponseHandler);
    }
});

const popupImageConfirm = document.querySelector("#Popup-Confirm-Image");
const imgUpload = document.querySelector("#img-upload");
let base64Img = {};
imgUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
        const fileType = file.type;

        // The file is an image
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = function (readFile) {
            const base64Image = readFile.target.result;
            // Use the base64Image as needed (e.g., send it to the server or display it on the page)
            base64Img = {
                imageCode: base64Image,
                type: fileType,
            };
        };
    }
});

popupImageConfirm.addEventListener("click", () => {
    // object represente the form
    let reqForm = {
        imageCode: base64Img.imageCode,
        imageType: base64Img.type,
        formtype: "changeImg",
    };
    if (verifyImage(reqForm)) {
        sendRequest(reqForm, imageResponseHandler);
    }
});

const FetchError_error = document.querySelector("#FetchError-error");
const Popup_ErroPopUp = document.querySelector("#Popup-FetchError");
function showError(Msg) {
    closeAllPopUps();

    popupConteiner.classList.add("active");
    FetchError_error.innerText = Msg;
    Popup_ErroPopUp.classList.add("active");
}

const input_image_Error = document.querySelector("#Popup-Change-image-error");
function verifyImage(formReq) {
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (base64Img.imageCode == "") {
        input_image_Error.innerText = "Username is empty.";
        imgUpload.classList.add("errorBox");
    } else if (!validImageTypes.includes(base64Img.type)) {
        input_image_Error.innerText = "Must be jpeg / png / jpg image format any others are not valid";
        imgUpload.classList.add("errorBox");
    } else {
        input_image_Error.innerText = "";
        imgUpload.classList.remove("errorBox");
        formReq["imageCode"] = base64Img.imageCode;
        formReq["imageType"] = base64Img.type;
        return true;
    }

    return false;
}

// object represent the final result of the form
function verifyNewUsername(formResult) {
    if (input_Username.value == "") {
        input_error_new_username.innerText = "Username is empty.";
        input_Username.classList.add("errorBox");
    } else if (input_Username.value.length < 8 || input_Username.value.length > 25) {
        input_error_new_username.innerText = "Must have at least 8 and at most 25 characters.";
        input_Username.classList.add("errorBox");
    } else {
        input_error_new_username.innerText = "";
        input_Username.classList.remove("errorBox");
        formResult["changedUsername"] = input_Username.value;
        return true;
    }

    return false;
}

// object represent the final result of the form
function verifyNewEmail(formResult) {
    if (input_Email.value == "") {
        input_error_new_email.innerText = "Email cannot be empty.";
        input_Email.classList.add("errorBox");
        return false;
    }

    let indexArroba = input_Email.value.indexOf("@");
    if (indexArroba < 0) {
        input_error_new_email.innerText = "Doesn't contain '@'.";
        input_Email.classList.add("errorBox");
    } else {
        formResult["changedEmail"] = input_Email.value;
        return true;
    }

    return false;
}

const profilePic = document.querySelector("#Profile-picture");
function imageResponseHandler(res) {
    if (res.success) {

        popUpConfirmImage.classList.remove("active");
        ImgPopup.classList.remove("active");

        profilePic.style.backgroundImage = `url(${res.imageCode})`;
    } else {
        // TODO: Needs to be changed
        showError(res.error);
    }
}

const usernameShowcase = document.querySelector("#usernameShowcase");
function changeUsernameResponseHandler(res) {
    if (res.success) {
        popUpConfirmUsername.classList.remove("active");
        NamePopup.classList.remove("active");

        usernameShowcase.value = res.changedUsername;
    } else {
        showError(res.error);
    }
}

const emailShowcase = document.querySelector("#emailShowcase");
const popupConfirmEmail = document.querySelector("#Popup-confirmEmail");
const popupConteiner = document.querySelector(".Popup-conteiner");
const popupConfirmEmailEmailShowcase = document.querySelector("#Popup-confirmEmail-emailshow");
function changeEmailResponseHandler(res) {
    if (res.success) {
        
        EmailPopup.classList.remove("active");
        popupConfirmEmail.classList.remove("active");

        popupConteiner.classList.add("active");
        popupConfirmEmail.classList.add("active");

        popupConfirmEmailEmailShowcase.value = res.changedEmail;
    } else {
        showError(res.error);
    }
}

function sendRequest(reqForm, responseHandler) {
    // making the request email send
    fetch(
        "/profile", //Rota para o POST Request
        {
            method: "POST", // defining the request's method and body format
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reqForm),
        }
    )
        .then((res) => {
            if (res.ok) return res.json();
            else throw Error(res.status + " " + res.statusText);
        })
        .then((res_data) => {
            responseHandler(res_data);
        })
        .catch((error) => showError(error));
}

//logout ...
const logOut = document.getElementById("Log-Out-Button");

logOut.addEventListener("click", () => {
    reqForm = {
        formType: "logout",
    };

    fetch("/", {
        method: "POST", // defining the requesthe method and body format
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqForm),
    }).finally(() => {
        if (window.location.href.includes("about")) {
            window.location.href = "/about-us";
        } else {
            window.location.href = "/";
        }
    });
});

const popUpConfirmEmailButton = document.querySelector("#Popup-confirmEmailBttn");
popUpConfirmEmailButton.addEventListener("click", () => {
    popupConteiner.classList.remove("active");
    popupConfirmEmail.classList.remove("active");
});

const popUpConfirmUsername= document.querySelector("#Popup-Confirm-New-Username");
popUpConfirmUsername.addEventListener("click",()=>{
    popupConteiner.classList.remove("active");
    popUpConfirmUsername.classList.remove("active");
})

const popUpConfirmImage = document.querySelector("#Popup-Confirm-Image");
popUpConfirmImage.addEventListener("click",()=>{
    popupConteiner.classList.remove("active");
    popUpConfirmImage.classList.remove("active");
})