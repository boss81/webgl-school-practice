"use strict";

document.querySelectorAll(".header-menu2, .header-links2").forEach(target => {
  target.addEventListener("click", () => {
    document.querySelector(".header").classList.toggle("is-header-active");
  });
});
