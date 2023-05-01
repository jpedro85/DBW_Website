"use strict";
// Get all dropdowns from the document
const dropdowns = document.querySelectorAll(".dropdown");

// Loop through all the dropdown elements
dropdowns.forEach((dropdown) => {
  // Get inner elements from each dropdown
  const select = dropdown.querySelector(".select");
  const caret = dropdown.querySelector(".caret");
  const menu = dropdown.querySelector(".menu");
  const options = dropdown.querySelectorAll(".menu li");
  const selected = dropdown.querySelector(".selected");

  /*
     We use this method so we can have
     multiple working dropdown menus in
     the same page
   */

  // Add a click event to the select element
  select.addEventListener("click", () => {
    // Add the clicked select style to the select element
    select.classList.toggle("select-clicked");
    // Add the rotate animation on the caret element
    caret.classList.toggle("caret-rotate");
    // Add the open style to the menu element
    menu.classList.toggle("menu-open");
  });

  // Loop through all option elements
  options.forEach((option) => {
    // Add click event to the option element
    option.addEventListener("click", () => {
      // Change selected inner text to clicked option inner text
      selected.innerText = option.innerText;
      // Add clicked selected style to the select element
      select.classList.remove("select-clicked");
      // Remove the rotate style to the caret element
      caret.classList.remove("caret-rotate");
      // Add the ope styles to the menu element
      menu.classList.remove("menu-open");
      // Remove active class from all options elements
      options.forEach((option) => {
        option.classList.remove("active");
      });
      // Add active class to click option element
      option.classList.add("active");
    });
  });
});
