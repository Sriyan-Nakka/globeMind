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
const flagImg = document.querySelector("#flagImg");
const countryQuestion = document.querySelector("#countryQuestion");

let modeFull;
let countryData;
let question = 1;
let hintsLeft = 3;

// =====================
// INIT MODE SETTINGS
// =====================
function init() {
  switch (mode) {
    case "guess-country-by-flag":
      modeFull = "Guess the Country by Flag";
      inputField.placeholder = "Guess the Country";
      countryQuestion.style.display = "none";
      break;

    case "guess-capital-by-flag":
      modeFull = "Guess the Capital by Flag";
      inputField.placeholder = "Guess the Capital";
      countryQuestion.style.display = "none";
      break;

    case "guess-continent-by-country":
      modeFull = "Guess the Continent by Country";
      inputField.placeholder = "Guess the Continent";
      break;

    case "guess-iso-by-flag":
      modeFull = "Guess the ISO Code by Flag";
      inputField.placeholder = "Guess the ISO Code";
      countryQuestion.style.display = "none";
      break;

    case "guess-country-by-iso":
      modeFull = "Guess the Country by ISO Code";
      inputField.placeholder = "Guess the Country";
      flagImg.style.display = "none";
      break;

    default:
      modeFull = "Unknown Mode";
  }
}

init();

console.log(`Settings:
Mode: ${modeFull}
Timer: ${timer}
Game Type: ${gameType}`);

document.querySelector("title").innerHTML = `Globe Mind | ${gameType} Game`;
document.querySelector("#modeHeader").textContent = `${modeFull} - ${gameType}`;

function setupHintDisplay() {
  const answer = getAnswerRaw();
  const hintEl = document.querySelector("#countryNameHints");

  let display = "";

  for (let char of answer) {
    if (char === " ")
      display += " "; // keep spaces
    else display += "-";
  }

  hintEl.textContent = display;
}

// =====================
// DATA HELPERS
// =====================
function questionData(q) {
  return countryData[q - 1];
}

function getCorrectAnswer() {
  const data = questionData(question);

  switch (mode) {
    case "guess-country-by-flag":
      return data.country.toLowerCase();

    case "guess-capital-by-flag":
      return data.capital.toLowerCase();

    case "guess-continent-by-country":
      return data.continent.toLowerCase();

    case "guess-iso-by-flag":
      return data.iso.toLowerCase();

    case "guess-country-by-iso":
      return data.country.toLowerCase();
  }
}

function getAnswerRaw() {
  const data = questionData(question);

  switch (mode) {
    case "guess-country-by-flag":
    case "guess-country-by-iso":
      return data.country;

    case "guess-capital-by-flag":
      return data.capital;

    case "guess-continent-by-country":
      return data.continent;

    case "guess-iso-by-flag":
      return data.iso;
  }
}

// =====================
// LOAD QUESTION (CORE)
// =====================
function loadQuestion() {
  const data = questionData(question);

  if (!data) {
    console.log("Game Over!");
    return;
  }

  // Reset input
  inputField.value = "|";

  // Update UI
  if (mode.includes("flag")) {
    flagImg.src = data.image;
  }

  if (mode === "guess-continent-by-country") {
    countryQuestion.textContent = data.country;
    flagImg.src = data.image;
  }

  if (mode === "guess-country-by-iso") {
    countryQuestion.textContent = data.iso;
  }
  setupHintDisplay();
}

// =====================
// FETCH DATA
// =====================
fetch("https://countrylookup-api.netlify.app/api/random/10")
  .then((res) => res.json())
  .then((data) => {
    countryData = data;
    loadQuestion(); // 🔥 start game
  })
  .catch((err) => console.log(err));

// =====================
// KEYBOARD LOGIC
// =====================
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
  } else if (key === "Backspace") {
    pressKey("backspace");
  } else if (key === " ") {
    pressKey("space");
  } else if (/^[a-zA-Z]$/.test(key)) {
    pressKey(key.toLowerCase());
  }
});

// =====================
// GUESS LOGIC
// =====================
function guessFunc() {
  let guess = inputField.value.replace("|", "").toLowerCase();
  const correct = getCorrectAnswer();

  if (guess === correct.toLowerCase()) {
    console.log("Correct!");

    question++;
    document.querySelector("#questionNum").textContent = question;
    loadQuestion();
  } else {
    console.log("Wrong!");
  }

  inputField.value = "|";
}

// =====================
// HINT BUTTON
// =====================
document.querySelector("#hintBtn").addEventListener("click", () => {
  // ✅ Add +3 hints every 10 questions (on 11th, 21st, etc.)
  if (question % 10 === 1 && question !== 1) {
    hintsLeft += 3;
  }

  if (hintsLeft <= 0) return;

  hintsLeft--;
  document.querySelector("#hintsLeftSpan").textContent = hintsLeft;

  const answer = getAnswerRaw();
  const hintEl = document.querySelector("#countryNameHints");

  let current = hintEl.textContent.split("");

  // 🔍 Find all hidden positions
  let hiddenIndexes = [];

  for (let i = 0; i < answer.length; i++) {
    if (current[i] === "-" && answer[i] !== " ") {
      hiddenIndexes.push(i);
    }
  }

  // If nothing left to reveal
  if (hiddenIndexes.length === 0) return;

  // 🎲 Pick random hidden index
  const randomIndex =
    hiddenIndexes[Math.floor(Math.random() * hiddenIndexes.length)];

  // Reveal letter
  current[randomIndex] = answer[randomIndex];

  // Update UI
  hintEl.textContent = current.join("");
});
