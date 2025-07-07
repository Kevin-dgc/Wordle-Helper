export function getTopFiveWords(incorrectLetters, correctLetters, almostCorrectLetters) {
    // This function will process the input data to generate the top five words for Wordle.

    let allGoodWords = []; 

    const wordList = ['tests','words'];

    for(let num = 0; num < wordList.length; num++){
        let curWord = wordList[num];
        let valid = true;

        for(let i = 0; i < incorrectLetters.length; i++){
            // curWord is the full word we are checking
            // incorrectLetters is a list chars of the chars that do not exist in the puzzle
            if(curWord.indexOf(incorrectLetters[i]) !== -1){
                valid = false;
                break;
            }
        }

        if(valid = false){
            break;
        }

        for(let i = 0; i < correctLetters.length; i++){
            // curWord is the full word we are checking
            // correctLetters is a list of pairs, first=char, second=location
            if(curWord.indexOf(correctLetters[i].first) !== correctLetters[i].second){
                valid = false;
                break;
            }
        }

        if(valid = false){
            break;
        }

        for(let i = 0; i < almostCorrectLetters.length; i++){
            // curWord is the full word we are checking
            // correctLetters is a list of pairs, first=char, second=location list
            // pair<char, [ints]>
            for(let j = 0; j < almostCorrectLetters[i].second.length; j++){
                if(curWord.indexOf(almostCorrectLetters[i].first) === almostCorrectLetters[i].second[j]){
                    valid = false;
                    break;
                }
            }
        }

        if(valid = false){
            break;
        }

        allGoodWords.push(curWord);
    }

    
    return allGoodWords.slice(0, 5).concat(Array(5 - allGoodWords.length).fill(''));
}