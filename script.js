// script for game.html

const params = new URLSearchParams(window.location.search);

const mode = params.get("mode");
const timer = params.get("timer");
const gameType = params.get("gameType");
let modeFull;

switch (mode) {
  case "guess-country-by-flag":
    modeFull = "Guess the Country by Flag";
    break;
  case "guess-capital-by-flag":
    modeFull = "Guess the Capital by Flag";
    break;
  case "guess-continent-by-country":
    modeFull = "Guess the Continent by Country";
    break;
  case "guess-iso-by-flag":
    modeFull = "Guess the Country ISO Code by Country Flag";
    break;
  case "guess-country-by-iso":
    modeFull = "Guess the Country by Country ISO Code";
    break;
  default:
    modeFull = "could not detect";
}
console.log(` Settings: 
    Mode: ${modeFull} 
    Timer: ${timer} 
    Game Type: ${gameType} `);
document.querySelector("title").innerHTML = `Globe Mind | ${gameType} Game`;
