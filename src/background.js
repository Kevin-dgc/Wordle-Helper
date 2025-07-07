// This file contains the background script for the Firefox extension. 
// It manages the extension's lifecycle and handles events such as opening the popup.

chrome.runtime.onInstalled.addListener(() => {
    console.log('Wordle Helper Extension Installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getWordData') {
        // Here you would handle the data received from content.js
        const { incorrectLetters, correctLetters, almostCorrectLetters } = request.data;
        
        // Call the function to get the top five words
        const topWords = getTopFiveWords(incorrectLetters, correctLetters, almostCorrectLetters);
        
        // Send the top words back to the content script or popup
        sendResponse({ topWords });
    }
    return true; // Keep the message channel open for sendResponse
});