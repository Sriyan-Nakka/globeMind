// script for game.html

//todo: uncomment this line after finishing all logics
// alert(
//   "Do not reload the website. Otherwise you will be redirected back to the main page.",
// );

const rules = localStorage.getItem("GM_rules");

let settings = null;

if (rules) {
  const parsed = JSON.parse(rules);

  // todo: uncomment these lines after finishing all logics
  // const isExpired = Date.now() - parsed.createdAt > 5 * 1000;

  // if (!isExpired) {
  settings = parsed;
  // } else {
  //   localStorage.removeItem("GM_rules");
  // }
}

// todo: uncomment these lines after finishing all logics
// if (!settings) {
//   window.location.href = "index.html";
// }

const { mode, timer, gameType } = settings;
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
document.querySelector("#modeHeader").textContent = modeFull;

