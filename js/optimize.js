const form = document.getElementById("optimize-form");
const loadingBox = document.getElementById("loading-box");

form.addEventListener("submit", function(e){

    e.preventDefault();

    loadingBox.style.display = "block";

});
