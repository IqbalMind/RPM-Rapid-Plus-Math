// Define variables
var score = 0;
var highScore = localStorage.getItem("highScore") || 0;
var time = 60;
var intervalId;
const progressBar = document.querySelector('.progress-bar');
const progressBarc = document.querySelector('.progress-container');

function updateProgress(currentTime, duration) {
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

// Example usage: update progress bar every second
let currentTime = 0;
const duration = 60;
setInterval(() => {
    updateProgress(currentTime, duration);
    currentTime += 1;
}, 1000);

// Add event listener to start button
document.getElementById("startButton").addEventListener("click", function () {
    // Hide menu and show game
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").classList.remove("form-hidden");
    const audio = document.getElementById("myAudio");
    progressBarc.classList.remove(("form-hidden"));
    audio.play();
    // Move focus to answer input field
    document.getElementById("answer").focus();
    // Start game
    startGame();
});

// Define function to start game
function startGame() {
    // Reset variables
    score = 0;
    time = 60;
    // Display first question
    displayQuestion();
    // Start timer
    intervalId = setInterval(updateTimer, 1000);
    // Reset audio and progress bar
    const audio = document.getElementById("myAudio");
    audio.currentTime = 0;
    audio.play();
    currentTime = 0;
    updateProgress(currentTime, duration);
}


// Define function to display question
function displayQuestion() {
    // Generate random numbers for question
    var a = Math.floor(Math.random() * 10) + 1;
    var b = Math.floor(Math.random() * 10) + 1;
    // Set question text
    document.getElementById("question").textContent = "What is " + a + " + " + b + "?";
}

// Define function to update timer
function updateTimer() {
    time--;
    document.getElementById("time").textContent = "Time: " + time;
    if (time == 0) {
        endGame();
    }
}

// Define function to end game
function endGame() {
    // Stop timer
    clearInterval(intervalId);
    // Display final score and high score
    document.getElementById("score").textContent = "Final score: " + score;
    document.getElementById("high-score").textContent = "High score: " + highScore;
    document.getElementById("start-again-button").style.display = "block";
    // Remove form
    // document.getElementsByTagName("form")[0].style.display = "none";
    document.getElementsByTagName("form")[0].classList.add("form-hidden");
    progressBarc.classList.add(("form-hidden"));
    document.getElementById("question").classList.add("form-hidden");
    // Store high score if it has been beaten
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
}

// Add event listener to start again button
document.getElementById("start-again-button").addEventListener("click", function () {
    // Hide menu and show game
    document.getElementById("menu").style.display = "none";
    document.getElementById("start-again-button").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementsByTagName("form")[0].classList.remove("form-hidden");
    document.getElementById("question").classList.remove("form-hidden");
    progressBarc.classList.remove(("form-hidden"));
    // Move focus to answer input field
    document.getElementById("answer").focus();
    startGame();
});

// Define function to handle form submit
document.getElementsByTagName("form")[0].addEventListener("submit", function (event) {
event.preventDefault();
var answer = document.getElementById("answer").value;
// Check if answer is correct
if (answer == parseInt(document.getElementById("question").textContent.split(" ")[2]) + parseInt(document.getElementById("question").textContent.split(" ")[4])) {
score++;
}
// Update score
document.getElementById("score").textContent = "Score: " + score;
// Display next question
displayQuestion();
// Reset answer field
document.getElementById("answer").value = "";
});

// Save high score to local storage
function saveHighScore() {
// Get current high score from local storage
var highScore = localStorage.getItem("highScore");
// If there is no high score yet, set the current score as the high score
if (!highScore) {
localStorage.setItem("highScore", score.toString());
}
// If the current score is higher than the high score, update the high score
else if (score > parseInt(highScore)) {
localStorage.setItem("highScore", score.toString());
}
}

// Display high score from local storage
function displayHighScore() {
// Get high score from local storage
var highScore = localStorage.getItem("highScore");
// Display high score if it exists
if (highScore) {
document.getElementById("high-score").textContent = "High Score: " + highScore;
}
}

// Call displayHighScore function to display high score on page load
displayHighScore();
