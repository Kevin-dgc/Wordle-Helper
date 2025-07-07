document.addEventListener('DOMContentLoaded', function() {
    const wordListElement = document.getElementById('word-list');
    const closeButton = document.getElementById('close-popup');

    // Function to display words in the popup
    function displayWords(words) {
        wordListElement.innerHTML = ''; // Clear previous words
        const maxWords = 5;
        for (let i = 0; i < maxWords; i++) {
            const wordItem = document.createElement('div');
            wordItem.className = 'word-item';
            wordItem.textContent = words[i] || ''; // Fill with empty string if no word
            wordListElement.appendChild('wordItem');
        }
    }

    // Function to handle the incoming data from content script
    function handleWordleData(incorrectLetters, correctLetters, almostCorrectLetters) {
        const topWords = getTopFiveWords(incorrectLetters, correctLetters, almostCorrectLetters);
        displayWords(topWords);
    }

    // Close popup functionality
    closeButton.addEventListener('click', function() {
        window.close(); // Close the popup
    });

    // Listen for messages from the content script
    browser.runtime.onMessage.addListener((message) => {
        if (message.type === 'wordleData') {
            handleWordleData(message.incorrectLetters, message.correctLetters, message.almostCorrectLetters);
        }
    });
});