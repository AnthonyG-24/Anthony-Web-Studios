// Select all nav links
const navLinks = document.querySelectorAll(".nav-links a");
const navToggle = document.getElementById("nav-toggle");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    // Uncheck the checkbox to close the menu
    navToggle.checked = false;
  });
});
