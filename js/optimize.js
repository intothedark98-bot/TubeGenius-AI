const form = document.getElementById("optimize-form");
const loadingBox = document.getElementById("loading-box");

form.addEventListener("submit", function(e){

    e.preventDefault();

    loadingBox.style.display = "block";

});

const loadingItems = document.querySelectorAll(".loading-box li");

let currentStep = 0;

setInterval(() => {

    loadingItems.forEach(item => {
        item.classList.remove("active");
    });

    loadingItems[currentStep].classList.add("active");

    currentStep++;

    if(currentStep >= loadingItems.length){
        currentStep = 0;
    }

},700);
