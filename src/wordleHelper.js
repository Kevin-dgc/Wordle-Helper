export async  function getTopFiveWords(incorrectLetters, correctLetters, almostCorrectLetters) {
    // This function will process the input data to generate the top five words for Wordle.

    let allGoodWords = []; 
    let wordList = [];

    // gets words
    try{
        const fileUrl = browser.runtime.getURL('src/wordList.txt');
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

        for(let {char, pos} of almostCorrectLetters){
            // does not have letter, skip
            if(!curWord.includes(char)){
                valid = false;
                break;
            }

            for (let i of pos) {
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
        for(let {char, pos} of correctLetters){
            if(curWord[pos] !== char){
                valid = false;
                break;
            }
        }

        if(!valid) { continue; }

        allGoodWords.push(curWord);
    }

    const words = allGoodWords.slice(0,5);
    while(words.length < 5){
        words.push('');
    }
    return words;
}