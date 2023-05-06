// const to keep all overlays
const OverLays = document.querySelectorAll(".Popup");
// const to keep the overlay conteiner
const OverLayConteiner = document.querySelector(".Popup-conteiner")

// bool to activete the closing on outside of the overlay click 
 let OverlayCloseActive = true;


// for all overlay add function to the close button
OverLays.forEach( (OverLay_popup) => {

    const x = OverLay_popup.querySelector(".Close-Popup");
    
    x.addEventListener("click" ,() => {
        // close pop up
        OverLay_popup.classList.remove("active");
        OverLayConteiner.classList.remove("active");
    } );
       

    OverLay_popup.addEventListener("click" ,(event) => {
        event.stopPropagation();
    } , false);

});

// for a click in the overlay conteiner close the overlay
OverLayConteiner.addEventListener("click", (event) => {
    
    // close all popus
    if (OverlayCloseActive) {
        OverLays.forEach( (OverLay) => {    
            closePopUp(OverLay);    
        });
    }

} );

// })

// function that close any popup 
// doens't check if argument is a popup
function closePopUp(OverLay) {

    if(OverLay.classList.contains("active") ){
        OverLay.classList.remove("active");
        OverLayConteiner.classList.remove("active");
    }

}