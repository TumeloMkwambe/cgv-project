let levelSelected = false;
let carSelected = false;

const selections = {
  level: "",
  car: "",
  mode: "",
};

sessionStorage.setItem("selections", JSON.stringify(selections));
function setSelection(key, value) {
  const selections = JSON.parse(sessionStorage.getItem("selections"));
  selections[key] = value;
  sessionStorage.setItem("selections", JSON.stringify(selections));
}

// Handle keydown for Controls (C) and Game Aim (G) popups
document.addEventListener("keydown", (event) => {
  if (event.key === "C" || event.key === "c") {
    showPopup("controls-popup");
  }
  if (event.key === "G" || event.key === "g") {
    showPopup("game-aim-popup");
  }
});

// Select track
function selectLevel(level) {
  console.log("Level selected:", level);
  selections.level = level;
  setSelection("level", level);
  levelSelected = true;
  document.getElementById("level-selection").classList.add("hidden");
  document.getElementById("car-selection").classList.remove("hidden");
}

// Select car
function selectCar(carName) {
  console.log("Car selected:", carName);
  selections.car = carName;
  setSelection("car", carName);
  carSelected = true;
  document.getElementById("car-selection").classList.add("hidden");
  document.getElementById("mode-selection").classList.remove("hidden");
}

// Select mode
function selectMode(modeName) {
  console.log("Mode selected:", modeName);
  selections.mode = modeName;
  setSelection("mode", modeName);
  modeSelected = true;
  document.getElementById("mode-selection").classList.add("hidden");
  document.getElementById("start-section").classList.remove("hidden");
}

// Start game
function startGame() {
  if (levelSelected && carSelected) {
    // Redirect to the game (race.html for now)
    if(selections.level == "Level 1"){
      window.location.href = "level1.html"; // Replace with your game page
    }
    else if(selections.level == "Level 2"){
      window.location.href = "level2.html"; // Replace with your game page
    }
    else if(selections.level == "Level 3"){
      window.location.href = "level3.html"; // Replace with your game page
    }
  }
}

// Go back to main menu
function goBack() {
  window.location.href = "../html/mainMenu.html"; // Redirect to main menu
}

// Show popup
function showPopup(popupId) {
  document.getElementById(popupId).classList.remove("hidden");
}

// Close popup
function closePopup(popupId) {
  document.getElementById(popupId).classList.add("hidden");
}
