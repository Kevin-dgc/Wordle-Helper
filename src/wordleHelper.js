// Chrome/Firefox compatibility shim
const browserApi = typeof chrome !== "undefined" ? chrome : browser;

export async function getTopFiveWords(incorrectLetters, correctLetters, almostCorrectLetters, num) {
    // This function will process the input data to generate the top five words for Wordle.
    let allGoodWords = [];
    let wordList = [];

    // gets words
    try {
        const fileUrl = browserApi.runtime.getURL('src/wordList.txt');
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        wordList = text.split('\n').map(word => word.trim()).filter(word => word.length > 0);
    }
    catch (error) {
        console.error("failed to get list", error);
        wordList = [];
    }

    
    for(let curWord of wordList){
        let valid = true;

        // if any incorrectLetters are in the word it skips
        for(let char of incorrectLetters){
            if(curWord.includes(char)){
                valid = false;
                break;
            }
        }
        if(!valid) { continue; }

        for(let {char, positions} of almostCorrectLetters){
            // does not have letter, skip
            if(!curWord.includes(char)){
                valid = false;
                break;
            }

            for (let i of positions) {
                // checks all almost correct pos, skips if in wrong place
                if (curWord[i] === char){
                    valid = false;
                    break;
                }
            }
            if (!valid) break;
        }

        if(!valid) { continue; }

        // checks all correct letters are in the correct space
        for(let {char, positions} of correctLetters){
            // does not have letter, skip
            if(!curWord.includes(char)){
                valid = false;
                break;
            }

            for (let i of positions) {
                if (curWord[i] !== char){
                    valid = false;
                    break;
                }
            }
            if (!valid) break;
        }

        if(!valid) { continue; }

        allGoodWords.push(curWord);
    }

    const words = allGoodWords.slice(0,num);
    while(words.length < num){
        words.push('');
    }
    return words;
}