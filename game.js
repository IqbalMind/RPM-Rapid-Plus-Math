// RPM: Rapid Plus Math - Game Engine

// Game State
let score = 0;
let highScore = parseInt(localStorage.getItem("highScore"), 10) || 0;
let time = 60;
let intervalId = null;
let currentAnswer = null;

// Settings State (Theme & Sound)
let currentTheme = localStorage.getItem("rpm_theme") || "dark";
let soundEnabled = localStorage.getItem("rpm_sound") !== "false";

// DOM Elements
const htmlEl = document.documentElement;
const progressBar = document.querySelector('.progress-bar');
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const timeCard = document.getElementById("timeCard");
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

// Navigation & Modal Elements
const themeToggle = document.getElementById("themeToggle");
const iconSun = document.getElementById("iconSun");
const iconMoon = document.getElementById("iconMoon");
const soundToggle = document.getElementById("soundToggle");
const soundIconOn = document.getElementById("soundIconOn");
const soundIconOff = document.getElementById("soundIconOff");
const infoButton = document.getElementById("infoButton");
const infoModal = document.getElementById("infoModal");
const closeModal = document.getElementById("closeModal");

// --- THEME MANAGEMENT (SVG Icons) ---
function applyTheme(theme) {
    currentTheme = theme;
    htmlEl.setAttribute("data-theme", theme);
    localStorage.setItem("rpm_theme", theme);

    if (iconSun && iconMoon) {
        if (theme === "dark") {
            iconSun.classList.remove("form-hidden");
            iconMoon.classList.add("form-hidden");
        } else {
            iconSun.classList.add("form-hidden");
            iconMoon.classList.remove("form-hidden");
        }
    }
}
applyTheme(currentTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
    });
}

// --- SOUND MANAGEMENT (SVG Icons) ---
function updateSoundDisplay() {
    if (soundIconOn && soundIconOff) {
        if (soundEnabled) {
            soundIconOn.classList.remove("form-hidden");
            soundIconOff.classList.add("form-hidden");
        } else {
            soundIconOn.classList.add("form-hidden");
            soundIconOff.classList.remove("form-hidden");
        }
    }
}
updateSoundDisplay();

if (soundToggle) {
    soundToggle.addEventListener("click", function () {
        soundEnabled = !soundEnabled;
        localStorage.setItem("rpm_sound", soundEnabled.toString());
        updateSoundDisplay();

        if (soundEnabled) {
            if (intervalId && audio) {
                audio.play().catch(function () {});
            }
        } else {
            if (audio) {
                audio.pause();
            }
        }
    });
}

// --- HIGH SCORE INITIALIZATION ---
function refreshHighScoreDisplays() {
    if (highScoreEl) highScoreEl.textContent = highScore;
    if (menuHighScoreEl) menuHighScoreEl.textContent = highScore;
}
refreshHighScoreDisplays();

// --- PROGRESS BAR ---
function updateProgress() {
    const elapsed = 60 - time;
    const progressPercent = Math.min(100, Math.max(0, (elapsed / 60) * 100));
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
    }
}

// --- QUESTION GENERATION ---
function displayQuestion() {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    currentAnswer = a + b;
    if (questionEl) {
        questionEl.textContent = `${a} + ${b}`;
    }
}

// --- START GAME ---
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

    // Reset view states
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

// --- TIMER COUNTDOWN ---
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

// --- END GAME ---
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

    // Hide active question and input form
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

// --- ANSWER SUBMISSION ---
formEl.addEventListener("submit", function (event) {
    event.preventDefault();
    const rawVal = answerInput.value.trim();
    if (!rawVal) return;

    const userAnswer = parseInt(rawVal, 10);

    if (userAnswer === currentAnswer) {
        score++;
        scoreEl.textContent = score;

        // Visual flash feedback on correct answer
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
    } else {
        // Shake feedback on incorrect answer
        answerInput.classList.remove("shake-error");
        void answerInput.offsetWidth;
        answerInput.classList.add("shake-error");
    }

    displayQuestion();
    answerInput.value = "";
    answerInput.focus();
});

// --- BUTTON LISTENERS ---
startBtn.addEventListener("click", function () {
    menuEl.style.display = "none";
    gameEl.classList.remove("form-hidden");
    startGame();
});

startAgainBtn.addEventListener("click", function () {
    startGame();
});

// --- ABOUT / RULES MODAL ---
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
