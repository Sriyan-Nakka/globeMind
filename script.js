// script for game.html

alert(
  "Do not reload the website. Otherwise you will be redirected back to the main page.",
);

const rules = localStorage.getItem("GM_rules");

let settings = null;

if (rules) {
  const parsed = JSON.parse(rules);

  const isExpired = Date.now() - parsed.createdAt > 5 * 1000;

  if (!isExpired) {
    settings = parsed;
  } else {
    localStorage.removeItem("GM_rules");
  }
}

if (!settings) {
  window.location.href = "index.html";
}

const { mode, timer, gameType } = settings;

const inputField = document.querySelector("#countryGuessField");
const flagImg = document.querySelector("#flagImg");
const countryQuestion = document.querySelector("#countryQuestion");

let modeFull;
let countryData;
let question = 1;
let hintsLeft = 3;
let gameTimer = new easytimer.Timer();

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
    if (char === " ") display += " ";
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

function normalizeAnswer(text) {
  return text.toLowerCase().replaceAll("-", " ").replaceAll("'", "");
}

function getCorrectAnswer() {
  const data = questionData(question);

  switch (mode) {
    case "guess-country-by-flag":
      return normalizeAnswer(data.country);

    case "guess-capital-by-flag":
      return normalizeAnswer(data.capital);

    case "guess-continent-by-country":
      return normalizeAnswer(data.continent);

    case "guess-iso-by-flag":
      return normalizeAnswer(data.iso);

    case "guess-country-by-iso":
      return normalizeAnswer(data.country);
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

  gameTimer.stop();

  gameTimer.start({
    countdown: true,
    startValues: { seconds: timer },
  });

  inputField.value = "|";

  if (mode.includes("flag")) {
    flagImg.src = data.image;
  }

  if (mode === "guess-continent-by-country") {
    countryQuestion.textContent = data.country;
    flagImg.src = data.image;
    document.querySelector("#hintBtnPara").style.display = "none";
    document.querySelector("#hintsBlockSpan").style.display = "none";
  }

  if (mode === "guess-country-by-iso") {
    countryQuestion.textContent = data.iso;
  }

  setupHintDisplay();
}

// =====================
// FETCH DATA
// =====================
fetch("https://countrylookup-api.netlify.app/api/random/195")
  .then((res) => res.json())
  .then((data) => {
    data[0] = {
      country: "Guinea-Bissau",
      capital: "Bissau",
      continent: "Africa",
      iso: "GW",
      image: "https://flagcdn.com/gw.svg",
    };
    countryData = data;
    loadQuestion();
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
  else if (key === "enter") {
    guessFunc();
    return;
  } else if (key === "space") value += " ";
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
  let guess = normalizeAnswer(inputField.value.replace("|", ""));
  const correct = getCorrectAnswer();

  if (guess === correct.toLowerCase()) {
    document.querySelector("#checkSpan").textContent = "Correct!";
    document.querySelector("#checkSpan").style.color = "green";
    setTimeout(() => {
      document.querySelector("#checkSpan").textContent = "";
      document.querySelector("#checkSpan").style.color = "white";
    }, 1000);

    question++;
    if (gameType === "Casual" && question === 11) {
      alert("🎉 You guessed 10 correctly! You win!");
      window.location.href = "index.html";
      return;
    }
    if (question % 10 === 1 && question !== 1) {
      hintsLeft += 3;
      document.querySelector("#hintsLeftSpan").textContent = hintsLeft;
    }

    document.querySelector("#questionNum").textContent = question;
    loadQuestion();
  } else {
    console.log("Wrong!");
    document.querySelector("#checkSpan").textContent = "Wrong, try again...";
    document.querySelector("#checkSpan").style.color = "red";
    setTimeout(() => {
      document.querySelector("#checkSpan").textContent = "";
      document.querySelector("#checkSpan").style.color = "white";
    }, 1000);
  }

  inputField.value = "|";
}

// =====================
// HINT BUTTON
// =====================
document.querySelector("#hintBtn").addEventListener("click", () => {
  const answer = getAnswerRaw();
  const hintEl = document.querySelector("#countryNameHints");

  let current = hintEl.textContent.split("");
  let hiddenIndexes = [];

  for (let i = 0; i < answer.length; i++) {
    if (current[i] === "-" && answer[i] !== " ") {
      hiddenIndexes.push(i);
    }
  }

  if (hiddenIndexes.length === 0) return;

  if (hintsLeft <= 0) return;

  hintsLeft--;

  document.querySelector("#hintsLeftSpan").textContent = hintsLeft;

  const randomIndex =
    hiddenIndexes[Math.floor(Math.random() * hiddenIndexes.length)];

  current[randomIndex] = answer[randomIndex];

  hintEl.textContent = current.join("");
});

// =====================
// OTHER
// =====================
gameTimer.addEventListener("targetAchieved", () => {
  if (gameType === "Casual") {
    alert(
      `Time's up! You lost.\nThe answer was ${getCorrectAnswer().toUpperCase()}`,
    );
  } else {
    alert(
      `Time's up!\n\nYou guessed ${question - 1} countries correctly! 🎉\n\nThe answer was ${getCorrectAnswer().toUpperCase()}`,
    );
  }
  window.location.href = "index.html";
});

gameTimer.addEventListener("secondsUpdated", () => {
  const time = gameTimer.getTimeValues();
  const el = document.querySelector("#timer");

  el.textContent = `0:${time.seconds.toString().padStart(2, "0")}`;

  if (time.seconds <= 3) {
    el.style.color = "red";
  } else {
    el.style.color = "";
  }
});
