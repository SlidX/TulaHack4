

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".close").onclick = function() {
        document.querySelector(".sidebar").style.display = "none";
    }

    document.querySelector(".open__menu").onclick = function() {
        document.querySelector(".sidebar").style.display = "block";
    }
  });