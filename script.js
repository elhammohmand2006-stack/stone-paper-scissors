/* =========================================================
   Stone, Paper, Scissors
   Concepts used: arrays, objects, functions with return values,
   Math.random / Math.floor, if/else, loops, setTimeout,
   DOM events, keyboard events, localStorage
   ========================================================= */

// ===== 1. Select DOM elements =====
const bestOfSelect = document.querySelector("#bestOf");
const modeSelect = document.querySelector("#mode");
const playerScoreEl = document.querySelector("#playerScore");
const computerScoreEl = document.querySelector("#computerScore");
const drawScoreEl = document.querySelector("#drawScore");
const roundInfoEl = document.querySelector("#roundInfo");
const playerHand = document.querySelector("#playerHand");
const computerHand = document.querySelector("#computerHand");
const messageEl = document.querySelector("#message");
const choiceButtons = document.querySelectorAll(".choice");
const newMatchBtn = document.querySelector("#newMatchBtn");
const historyList = document.querySelector("#historyList");
const statsEl = document.querySelector("#stats");

// ===== 2. Game data =====
const CHOICES = ["rock", "paper", "scissors"];
const ICONS = { rock: "✊", paper: "✋", scissors: "✌️" };
const NAMES = { rock: "Stone", paper: "Paper", scissors: "Scissors" };

// Each key beats its value: rock beats scissors, and so on
const BEATS = { rock: "scissors", paper: "rock", scissors: "paper" };

// ===== 3. Game state =====
let state = createFreshState();
let stats = loadStats(); // saved between visits

function createFreshState() {
  return {
    playerScore: 0,
    computerScore: 0,
    draws: 0,
    round: 1,
    streak: 0,
    locked: false,    // true while the countdown is running
    matchOver: false,
    history: [],
    moveCount: { rock: 0, paper: 0, scissors: 0 }, // used by the smart opponent
  };
}

// How many round wins are needed to win the match (best of 5 -> 3)
function getWinsNeeded() {
  return Math.ceil(Number(bestOfSelect.value) / 2);
}

// ===== 4. Computer choices =====

// Pick a random item from the CHOICES array
function randomChoice() {
  const index = Math.floor(Math.random() * CHOICES.length);
  return CHOICES[index];
}

// Smart mode: 60% of the time, counter the move the player uses most
function smartChoice() {
  let favorite = null;
  let highest = 0;

  for (const move of CHOICES) {
    if (state.moveCount[move] > highest) {
      highest = state.moveCount[move];
      favorite = move;
    }
  }

  if (favorite && Math.random() < 0.6) {
    // Find the move that beats the player's favorite
    return CHOICES.find((move) => BEATS[move] === favorite);
  }
  return randomChoice();
}

function getComputerChoice() {
  return modeSelect.value === "smart" ? smartChoice() : randomChoice();
}

// ===== 5. Decide the winner =====
// Returns "win", "lose" or "draw" from the player's point of view
function getResult(player, computer) {
  if (player === computer) return "draw";
  if (BEATS[player] === computer) return "win";
  return "lose";
}

// ===== 6. Play one round =====
function play(choice) {
  if (state.locked || state.matchOver) return;

  state.locked = true;
  setButtonsDisabled(true);

  // Decide the computer's move BEFORE counting the player's move
  const computerChoice = getComputerChoice();
  state.moveCount[choice]++;

  // Reset the hands and start the shaking countdown
  playerHand.className = "hand shake";
  computerHand.className = "hand flip shake";
  playerHand.textContent = ICONS.rock;
  computerHand.textContent = ICONS.rock;

  const words = ["Stone…", "Paper…", "Scissors…"];
  words.forEach((word, i) => {
    setTimeout(() => {
      messageEl.textContent = word;
    }, i * 450);
  });

  // Reveal after the last word
  setTimeout(() => revealRound(choice, computerChoice), words.length * 450);
}

function revealRound(player, computer) {
  const result = getResult(player, computer);

  // Show both hands
  playerHand.className = "hand";
  computerHand.className = "hand flip";
  playerHand.textContent = ICONS[player];
  computerHand.textContent = ICONS[computer];

  // Update scores, streak and message
  if (result === "win") {
    state.playerScore++;
    state.streak++;
    stats.bestStreak = Math.max(stats.bestStreak, state.streak);
    playerHand.classList.add("win");
    computerHand.classList.add("lose");
    messageEl.textContent = `${NAMES[player]} beats ${NAMES[computer]}. You win this round!`;
  } else if (result === "lose") {
    state.computerScore++;
    state.streak = 0;
    playerHand.classList.add("lose");
    computerHand.classList.add("win");
    messageEl.textContent = `${NAMES[computer]} beats ${NAMES[player]}. Computer scores.`;
  } else {
    state.draws++;
    messageEl.textContent = `Both chose ${NAMES[player]}. It is a draw.`;
  }

  // Keep the last 8 rounds, newest first
  state.history.unshift({ round: state.round, player, computer, result });
  state.history = state.history.slice(0, 8);
  state.round++;

  checkMatchEnd();
  updateScreen();
  state.locked = false;
  if (!state.matchOver) setButtonsDisabled(false);
}

// ===== 7. Match end =====
function checkMatchEnd() {
  const needed = getWinsNeeded();
  const playerWon = state.playerScore === needed;
  const computerWon = state.computerScore === needed;

  if (!playerWon && !computerWon) return;

  state.matchOver = true;
  stats.matchesPlayed++;
  if (playerWon) stats.matchesWon++;
  saveStats();

  messageEl.textContent = playerWon
    ? "🏆 You won the match!"
    : "The computer won the match. Try again!";
  newMatchBtn.hidden = false;
  setButtonsDisabled(true);
}

function startNewMatch() {
  state = createFreshState();
  playerHand.className = "hand";
  computerHand.className = "hand flip";
  playerHand.textContent = ICONS.rock;
  computerHand.textContent = ICONS.rock;
  messageEl.textContent = "Choose your move";
  newMatchBtn.hidden = true;
  setButtonsDisabled(false);
  updateScreen();
}

// ===== 8. Update the page =====
function setButtonsDisabled(isDisabled) {
  choiceButtons.forEach((button) => {
    button.disabled = isDisabled;
  });
}

function updateScreen() {
  playerScoreEl.textContent = state.playerScore;
  computerScoreEl.textContent = state.computerScore;
  drawScoreEl.textContent = state.draws;
  roundInfoEl.textContent = `Round ${state.round} · First to ${getWinsNeeded()} wins`;

  // Round history list
  historyList.innerHTML = "";
  if (state.history.length === 0) {
    historyList.innerHTML = `<li class="empty">No rounds yet.</li>`;
  }
  state.history.forEach((item) => {
    const li = document.createElement("li");
    li.className = item.result;
    const text = { win: "You win", lose: "Computer wins", draw: "Draw" }[item.result];
    li.textContent = `Round ${item.round}: ${ICONS[item.player]} vs ${ICONS[item.computer]} — ${text}`;
    historyList.appendChild(li);
  });

  statsEl.textContent =
    `Streak: ${state.streak} · Best streak: ${stats.bestStreak} · ` +
    `Matches won: ${stats.matchesWon} of ${stats.matchesPlayed}`;
}

// ===== 9. Save and load (localStorage) =====
function saveStats() {
  localStorage.setItem("rpsStats", JSON.stringify(stats));
}

function loadStats() {
  const saved = localStorage.getItem("rpsStats");
  return saved ? JSON.parse(saved) : { bestStreak: 0, matchesWon: 0, matchesPlayed: 0 };
}

// ===== 10. Events =====
choiceButtons.forEach((button) => {
  button.addEventListener("click", () => play(button.dataset.choice));
});

// Keyboard shortcuts: R, P, S
document.addEventListener("keydown", (event) => {
  const keys = { r: "rock", p: "paper", s: "scissors" };
  const choice = keys[event.key.toLowerCase()];
  if (choice) play(choice);
});

newMatchBtn.addEventListener("click", startNewMatch);

// Changing a setting starts a fresh match
bestOfSelect.addEventListener("change", startNewMatch);
modeSelect.addEventListener("change", startNewMatch);

// ===== 11. Start the game =====
updateScreen();
