// Define variables
var score = 0;
var highScore = parseInt(localStorage.getItem("highScore"), 10) || 0;
var time = 60;
var intervalId = null;
var currentAnswer = null;

const progressBar = document.querySelector('.progress-bar');
const progressBarc = document.querySelector('.progress-container');
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const highScoreEl = document.getElementById("high-score");
const questionEl = document.getElementById("question");
const answerInput = document.getElementById("answer");
const startBtn = document.getElementById("startButton");
const startAgainBtn = document.getElementById("start-again-button");
const menuEl = document.getElementById("menu");
const gameEl = document.getElementById("game");
const formEl = document.querySelector("form");
const audio = document.getElementById("myAudio");

// Update progress bar based on elapsed time
function updateProgress() {
    const elapsed = 60 - time;
    const progressPercent = Math.min(100, Math.max(0, (elapsed / 60) * 100));
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
    }
}

// Display high score on page load
function displayHighScore() {
    if (highScoreEl) {
        highScoreEl.textContent = "High score: " + highScore;
    }
}
displayHighScore();

// Add event listener to start button
startBtn.addEventListener("click", function () {
    menuEl.style.display = "none";
    gameEl.classList.remove("form-hidden");
    gameEl.style.display = "block";
    startGame();
});

// Define function to start game
function startGame() {
    // Clear any previous interval to prevent timer leaks
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }

    // Reset game state
    score = 0;
    time = 60;

    // Reset UI elements
    scoreEl.textContent = "Score: 0";
    timeEl.textContent = "Time: 60";
    displayHighScore();
    
    formEl.classList.remove("form-hidden");
    questionEl.classList.remove("form-hidden");
    progressBarc.classList.remove("form-hidden");
    startAgainBtn.style.display = "none";

    if (progressBar) {
        progressBar.style.width = "0%";
    }

    // Display first question
    displayQuestion();

    // Start timer interval
    intervalId = setInterval(updateTimer, 1000);

    // Audio setup
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(function () {
            // Autoplay policy fallback
        });
    }

    // Focus input field
    answerInput.value = "";
    answerInput.focus();
}

// Define function to display question
function displayQuestion() {
    var a = Math.floor(Math.random() * 10) + 1;
    var b = Math.floor(Math.random() * 10) + 1;
    currentAnswer = a + b;
    questionEl.textContent = "What is " + a + " + " + b + "?";
}

// Define function to update timer
function updateTimer() {
    time--;
    timeEl.textContent = "Time: " + time;
    updateProgress();
    if (time <= 0) {
        endGame();
    }
}

// Define function to end game
function endGame() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }

    // Update high score in state and localStorage FIRST
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore.toString());
    }

    // Display final score and updated high score
    scoreEl.textContent = "Final score: " + score;
    displayHighScore();

    // Toggle controls
    formEl.classList.add("form-hidden");
    progressBarc.classList.add("form-hidden");
    questionEl.classList.add("form-hidden");
    startAgainBtn.style.display = "block";

    if (audio) {
        audio.pause();
    }
}

// Add event listener to start again button
startAgainBtn.addEventListener("click", function () {
    menuEl.style.display = "none";
    gameEl.style.display = "block";
    startGame();
});

// Define function to handle form submit
formEl.addEventListener("submit", function (event) {
    event.preventDefault();
    var userAnswer = parseInt(answerInput.value, 10);

    // Check if answer matches generated equation
    if (userAnswer === currentAnswer) {
        score++;
        // Update high score in real-time if beaten
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore.toString());
            displayHighScore();
        }
    }

    // Update current score display
    scoreEl.textContent = "Score: " + score;

    // Display next question and reset input
    displayQuestion();
    answerInput.value = "";
    answerInput.focus();
});
