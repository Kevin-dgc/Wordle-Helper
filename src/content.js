const incorrectLetters = [];
const correctLetters = {};
const almostCorrectLetters = {};

function scanWordlePage() {
    // Logic to scan the Wordle page for letters
    // Populate incorrectLetters, correctLetters, and almostCorrectLetters
}

function sendDataToBackground() {
    const data = {
        incorrect: incorrectLetters,
        correct: correctLetters,
        almostCorrect: almostCorrectLetters
    };
    browser.runtime.sendMessage({ type: "wordleData", data });
}

scanWordlePage();
sendDataToBackground();