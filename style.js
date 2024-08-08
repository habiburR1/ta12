// style.js
function loadHTML(elementId, fileName) {
  fetch(fileName)
    .then((response) => response.text())
    .then((data) => (document.getElementById(elementId).innerHTML = data))
    .catch((error) => console.error("Error loading file:", error));
}

document.addEventListener("DOMContentLoaded", function () {
  loadHTML("header", "header.html");
  loadHTML("footer", "footer.html");
});
