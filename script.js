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
const inputField = document.querySelector("#countryGuessField");
let modeFull;
let question = 1;
let hintsLeft = 3;

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
document.querySelector("#modeHeader").textContent = `${modeFull} - ${gameType}`;

// keyboard related functions
function pressKey(key) {
  if (key === " ") key = "space";

  const btn = document.querySelector(
    `.keyboard button[data-key="${key.toLowerCase()}"]`,
  );

  if (btn) {
    btn.classList.add("pressed");
    setTimeout(() => btn.classList.remove("pressed"), 50);
  }

  let value = inputField.value.replace("|", "");

  if (key === "backspace") value = value.slice(0, -1);
  else if (key === "enter") return;
  else if (key === "space") value += " ";
  else value += key;

  inputField.value = value + "|";
}

document.querySelectorAll(".keyboard button").forEach((btn) => {
  btn.addEventListener("click", () => {
    pressKey(btn.dataset.key);
    btn.blur();
  });
});

document.addEventListener("keydown", (e) => {
  const key = e.key;

  if ([" ", "Enter", "Backspace"].includes(key)) {
    e.preventDefault();
  }

  if (key === "Enter") {
    pressKey("enter");
    guessFunc();
  } else if (key === "Backspace") pressKey("backspace");
  else if (key === " ") pressKey("space");
  else if (/^[a-zA-Z]$/.test(key)) pressKey(key.toLowerCase());
});

//game functions & logics

document.querySelector("#hintBtn").addEventListener("click", () => {
  hintsLeft--;
  if (hintsLeft < 0) return;
  document.querySelector("#hintsLeftSpan").textContent = hintsLeft;
});

function guessFunc() {
  inputField.value = "";
}
