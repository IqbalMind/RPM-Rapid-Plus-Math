// RPM: Rapid Plus Math - Game Engine

// State variables
let score = 0;
let highScore = parseInt(localStorage.getItem("highScore"), 10) || 0;
let time = 60;
let intervalId = null;
let currentAnswer = null;
let soundEnabled = true;

// DOM Elements
const progressBar = document.querySelector('.progress-bar');
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const timeCard = timeEl ? timeEl.closest('.hud-card') : null;
const highScoreEl = document.getElementById("high-score");
const menuHighScoreEl = document.getElementById("menu-high-score");
const questionEl = document.getElementById("question");
const answerInput = document.getElementById("answer");
const formEl = document.getElementById("answerForm");
const startBtn = document.getElementById("startButton");
const startAgainBtn = document.getElementById("start-again-button");
const menuEl = document.getElementById("menu");
const gameEl = document.getElementById("game");
const gameOverCard = document.getElementById("gameOverCard");
const finalScoreVal = document.getElementById("finalScoreVal");
const newRecordBanner = document.getElementById("newRecordBanner");
const questionWrapper = document.getElementById("question-wrapper");
const audio = document.getElementById("myAudio");

// Modal Elements
const infoButton = document.getElementById("infoButton");
const infoModal = document.getElementById("infoModal");
const closeModal = document.getElementById("closeModal");

// Sound Elements
const soundToggle = document.getElementById("soundToggle");
const soundIconOn = document.getElementById("soundIconOn");
const soundIconOff = document.getElementById("soundIconOff");

// Initialize High Scores in UI
function refreshHighScoreDisplays() {
    if (highScoreEl) highScoreEl.textContent = highScore;
    if (menuHighScoreEl) menuHighScoreEl.textContent = highScore;
}
refreshHighScoreDisplays();

// Update Progress Bar
function updateProgress() {
    const elapsed = 60 - time;
    const progressPercent = Math.min(100, Math.max(0, (elapsed / 60) * 100));
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
    }
}

// Generate New Math Equation
function displayQuestion() {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    currentAnswer = a + b;
    if (questionEl) {
        questionEl.textContent = `${a} + ${b}`;
    }
}

// Start Game
function startGame() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }

    score = 0;
    time = 60;

    scoreEl.textContent = "0";
    timeEl.textContent = "60";
    if (timeCard) timeCard.classList.remove("timer-critical");
    refreshHighScoreDisplays();

    // Show gameplay UI, hide game-over card
    if (gameOverCard) gameOverCard.classList.add("form-hidden");
    if (newRecordBanner) newRecordBanner.classList.add("form-hidden");
    formEl.classList.remove("form-hidden");
    questionWrapper.classList.remove("form-hidden");
    if (progressBar) progressBar.style.width = "0%";

    displayQuestion();
    intervalId = setInterval(updateTimer, 1000);

    // Audio Playback
    if (audio && soundEnabled) {
        audio.currentTime = 0;
        audio.play().catch(function () {
            // Autoplay policy fallback
        });
    }

    answerInput.value = "";
    answerInput.focus();
}

// Timer Countdown
function updateTimer() {
    time--;
    timeEl.textContent = time;
    updateProgress();

    if (time <= 10 && timeCard) {
        timeCard.classList.add("timer-critical");
    }

    if (time <= 0) {
        endGame();
    }
}

// End Game
function endGame() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }

    let isNewRecord = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore.toString());
        isNewRecord = true;
    }

    refreshHighScoreDisplays();

    // Hide active question & form
    formEl.classList.add("form-hidden");
    questionWrapper.classList.add("form-hidden");

    // Show Game Over Summary Card
    if (finalScoreVal) finalScoreVal.textContent = score;
    if (newRecordBanner) {
        if (isNewRecord && score > 0) {
            newRecordBanner.classList.remove("form-hidden");
        } else {
            newRecordBanner.classList.add("form-hidden");
        }
    }
    if (gameOverCard) gameOverCard.classList.remove("form-hidden");

    if (audio) {
        audio.pause();
    }
}

// Form Submit Handler
formEl.addEventListener("submit", function (event) {
    event.preventDefault();
    const userAnswer = parseInt(answerInput.value, 10);

    if (userAnswer === currentAnswer) {
        score++;
        scoreEl.textContent = score;

        // Visual flash feedback
        if (questionEl) {
            questionEl.classList.remove("correct-flash");
            void questionEl.offsetWidth; // trigger reflow
            questionEl.classList.add("correct-flash");
        }

        // Live high score update
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore.toString());
            refreshHighScoreDisplays();
        }
    }

    displayQuestion();
    answerInput.value = "";
    answerInput.focus();
});

// Event Listeners for Game Buttons
startBtn.addEventListener("click", function () {
    menuEl.style.display = "none";
    gameEl.classList.remove("form-hidden");
    startGame();
});

startAgainBtn.addEventListener("click", function () {
    startGame();
});

// Sound Toggle Control
if (soundToggle) {
    soundToggle.addEventListener("click", function () {
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
            soundIconOn.classList.remove("form-hidden");
            soundIconOff.classList.add("form-hidden");
            if (intervalId && audio) {
                audio.play().catch(function () {});
            }
        } else {
            soundIconOn.classList.add("form-hidden");
            soundIconOff.classList.remove("form-hidden");
            if (audio) audio.pause();
        }
    });
}

// Modal Toggle Handlers
if (infoButton && infoModal) {
    infoButton.addEventListener("click", function () {
        infoModal.classList.remove("form-hidden");
    });
}

if (closeModal && infoModal) {
    closeModal.addEventListener("click", function () {
        infoModal.classList.add("form-hidden");
    });
}

window.addEventListener("click", function (event) {
    if (event.target === infoModal) {
        infoModal.classList.add("form-hidden");
    }
});

window.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && infoModal && !infoModal.classList.contains("form-hidden")) {
        infoModal.classList.add("form-hidden");
    }
});
