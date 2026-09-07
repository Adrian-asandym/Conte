// ---------- Referencias a elementos ----------
const setupScreen = document.getElementById('setup-screen');
const countdownScreen = document.getElementById('countdown-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');

const gridSizeInput = document.getElementById('grid-size');
const timerSecondsInput = document.getElementById('timer-seconds');
const setupError = document.getElementById('setup-error');
const startBtn = document.getElementById('start-btn');

const countdownNumber = document.getElementById('countdown-number');

const timeLeftEl = document.getElementById('time-left');
const foundCountEl = document.getElementById('found-count');
const gridEl = document.getElementById('grid');
const stopBtn = document.getElementById('stop-btn');

const resultCountEl = document.getElementById('result-count');
const resultListEl = document.getElementById('result-list');
const restartBtn = document.getElementById('restart-btn');

// ---------- Estado ----------
let gridSize = 0;
let totalSeconds = 0;
let secondsLeft = 0;
let timerInterval = null;
let foundNumbers = new Set();

// ---------- Utilidades ----------
function showScreen(screen) {
  [setupScreen, countdownScreen, gameScreen, resultScreen].forEach(s => {
    s.hidden = (s !== screen);
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function checkInputs() {
  const n = parseInt(gridSizeInput.value, 10);
  const t = parseInt(timerSecondsInput.value, 10);
  const valid = Number.isInteger(n) && n > 1 && Number.isInteger(t) && t > 0;
  startBtn.hidden = !valid;
  setupError.hidden = true;
  return valid;
}

gridSizeInput.addEventListener('input', checkInputs);
timerSecondsInput.addEventListener('input', checkInputs);

// ---------- Flujo del juego ----------
startBtn.addEventListener('click', () => {
  const n = parseInt(gridSizeInput.value, 10);
  const t = parseInt(timerSecondsInput.value, 10);

  if (!Number.isInteger(n) || n <= 1) {
    setupError.textContent = 'El primer número debe ser mayor a 1.';
    setupError.hidden = false;
    return;
  }
  if (!Number.isInteger(t) || t <= 0) {
    setupError.textContent = 'El tiempo debe ser un número mayor a 0.';
    setupError.hidden = false;
    return;
  }

  gridSize = n;
  totalSeconds = t;
  runCountdown();
});

function runCountdown() {
  showScreen(countdownScreen);
  const sequence = ['3', '2', '1', '¡GO!'];
  let i = 0;
  countdownNumber.textContent = sequence[i];

  const interval = setInterval(() => {
    i++;
    if (i >= sequence.length) {
      clearInterval(interval);
      startGame();
      return;
    }
    countdownNumber.textContent = sequence[i];
  }, 700);
}

function startGame() {
  foundNumbers = new Set();
  secondsLeft = totalSeconds;
  buildGrid();
  updateFoundCount();
  updateTimeDisplay();
  showScreen(gameScreen);

  timerInterval = setInterval(() => {
    secondsLeft--;
    updateTimeDisplay();
    if (secondsLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function buildGrid() {
  gridEl.innerHTML = '';
  gridEl.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  gridEl.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  const total = gridSize * gridSize;
  const numbers = shuffle(Array.from({ length: total }, (_, idx) => idx + 1));

  numbers.forEach(num => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = num;
    cell.dataset.number = num;
    cell.addEventListener('click', () => toggleCell(cell, num));
    gridEl.appendChild(cell);
  });
}

function toggleCell(cell, num) {
  if (foundNumbers.has(num)) {
    foundNumbers.delete(num);
    cell.classList.remove('found');
  } else {
    foundNumbers.add(num);
    cell.classList.add('found');
  }
  updateFoundCount();
}

function updateFoundCount() {
  foundCountEl.textContent = foundNumbers.size;
}

function updateTimeDisplay() {
  timeLeftEl.textContent = String(secondsLeft).padStart(2, '0');
}

stopBtn.addEventListener('click', () => {
  endGame();
});

function endGame() {
  clearInterval(timerInterval);
  timerInterval = null;
  showResults();
}

function showResults() {
  resultCountEl.textContent = foundNumbers.size;
  resultListEl.innerHTML = '';

  const sorted = Array.from(foundNumbers).sort((a, b) => b - a);
  sorted.forEach(num => {
    const chip = document.createElement('div');
    chip.className = 'result-chip';
    chip.textContent = num;
    resultListEl.appendChild(chip);
  });

  showScreen(resultScreen);
}

restartBtn.addEventListener('click', () => {
  gridSizeInput.value = '';
  timerSecondsInput.value = '';
  startBtn.hidden = true;
  setupError.hidden = true;
  showScreen(setupScreen);
});