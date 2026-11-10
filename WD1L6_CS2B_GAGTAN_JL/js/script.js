/* 
   Profile - Jamilla Gagtan
   External JavaScript
   Features:
     1. Typing effect for the hero role
     2. Screenshot viewer (opens a Bootstrap modal)
     3. Contact form validation / character counter
     4. Auto-updating footer year
 */

// Wait until the whole HTML page is loaded before running anything
document.addEventListener("DOMContentLoaded", function () {
  initTypingEffect();
  initImageViewer();
  initContactForm();
  initFooterYear();
});

/* ---------- 1. Typing effect ---------- */
function initTypingEffect() {
  const target = document.getElementById("typedRole");
  if (!target) return;

  // Words that will be typed and erased in a loop
  const roles = ["Web Developer", "CS Student", "Color Lover", "Future Problem Solver"];

  // If the visitor prefers reduced motion, just show the first role (no animation)
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    target.textContent = roles[0];
    return;
  }

  let roleIndex = 0;   // which word we are on
  let charIndex = 0;   // how many letters are showing
  let deleting = false;

  function tick() {
    const word = roles[roleIndex];

    // Add or remove one letter
    charIndex += deleting ? -1 : 1;
    target.textContent = word.substring(0, charIndex);

    let delay = deleting ? 50 : 100;

    if (!deleting && charIndex === word.length) {
      // Finished typing: pause, then start deleting
      deleting = true;
      delay = 1500;
    } else if (deleting && charIndex === 0) {
      // Finished deleting: move to the next word
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  }
  tick();
}

/* ---------- 2. Screenshot viewer ---------- */
function initImageViewer() {
  const modalEl = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  if (!modalEl || !modalImg) return;

  // Create the Bootstrap modal object once and reuse it
  const modal = new bootstrap.Modal(modalEl);

  // Every screenshot has the class "zoomable"
  document.querySelectorAll(".zoomable").forEach(function (img) {
    img.addEventListener("click", function () {
      modalImg.src = img.src;   // show the clicked picture larger
      modalImg.alt = img.alt;   // keep the description for screen readers
      modal.show();
    });
  });
}

/* ---------- 3. Contact form ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const nameInput = document.getElementById("cName");
  const emailInput = document.getElementById("cEmail");
  const messageInput = document.getElementById("cMessage");
  const counter = document.getElementById("msgCounter");
  const alertBox = document.getElementById("formAlert");

  // Live character counter for the message box
  messageInput.addEventListener("input", function () {
    counter.textContent = messageInput.value.length + " / " + messageInput.maxLength;
  });

  // Simple email pattern: something@something.something
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Marks one field as valid or invalid (Bootstrap shows the red/green state)
  function setValidity(input, isValid) {
    input.classList.toggle("is-invalid", !isValid);
    input.classList.toggle("is-valid", isValid);
    return isValid;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();   // stop the page from reloading

    // Check each field; trim() ignores spaces at the start and end
    const nameOk = setValidity(nameInput, nameInput.value.trim().length > 0);
    const emailOk = setValidity(emailInput, emailPattern.test(emailInput.value.trim()));
    const messageOk = setValidity(messageInput, messageInput.value.trim().length >= 10);

    if (nameOk && emailOk && messageOk) {
      // Everything is valid: show the success message and clear the form
      alertBox.classList.remove("d-none");
      form.reset();
      counter.textContent = "0 / " + messageInput.maxLength;
      [nameInput, emailInput, messageInput].forEach(function (el) {
        el.classList.remove("is-valid");
      });
    } else {
      alertBox.classList.add("d-none");
    }
  });
}

/* ---------- 4. Footer year ---------- */
function initFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
