const pathToHelper = browser.runtime.getURL("src/wordleHelper.js");
let getTopFiveWords;

// fetches the words from the page
import(pathToHelper).then(module => {
    getTopFiveWords = module.getTopFiveWords;

    browser.runtime.onMessage.addListener((message) => {
        let [command, value] = message.command.split('|');

        console.log(command);
        console.log(value);

        if (command === "getSuggestions") {
            console.log("starting wordle helper");
            suggestNDisplay(value);
        }
    });
}).catch(error => {
    console.error("error!", error);
});

function suggestNDisplay(num){
    const incorrectLetters = new Set();
    const correctLetters = [];
    const almostCorrectLetters = [];

    const gameApp = document.querySelector('.Board-module_board__jeoPS');
    if (!gameApp) {
        console.error("cant find dom");
        return;
    }

    const rows = gameApp.querySelectorAll('.Row-module_row__pwpBq');

    rows.forEach((row) => {
        const tiles = row.querySelectorAll('.Tile-module_tile__UWEHN');

        tiles.forEach((tile, tileIndex) => {
            const letter = tile.textContent;
            const state = tile.getAttribute('data-state');

            if (!letter || !state) {
                return;
            }

            if (state === 'absent') {
                let existsInCorr = correctLetters.find(item => item.char === letter);
                let existsInAlmost = almostCorrectLetters.find(item => item.char === letter);
                if(!existsInCorr && !existsInAlmost){
                    incorrectLetters.add(letter);
                }
            } else if (state === 'correct') {
                let existing = correctLetters.find(item => item.char === letter);
                if (existing) {
                    existing.positions.push(tileIndex);
                } else {
                    correctLetters.push({ char: letter, positions: [tileIndex] });
                }
            } else if (state === 'present') {
                let existing = almostCorrectLetters.find(item => item.char === letter);
                if (existing) {
                    existing.positions.push(tileIndex);
                } else {
                    almostCorrectLetters.push({ char: letter, positions: [tileIndex] });
                }
            }
        });
    });

    const incorrectLettersArray = Array.from(incorrectLetters);

    // console.log("Incorrect Letters Found:", incorrectLettersArray);
    // console.log("Correct Letters Found:", correctLetters);
    // console.log("Almost Correct Letters Found:", almostCorrectLetters);

    getTopFiveWords(incorrectLettersArray, correctLetters, almostCorrectLetters, num).then(words => {
        console.log("words are:", words);
        displayWords(words, num);
    });
}

let helperBox, slider, sliderValueLabel, wordsList;

function displayWords(words, num = 5) {
    
     if (!helperBox) {
        helperBox = document.createElement('div');
        helperBox.id = 'wordle-helper-box';
        Object.assign(helperBox.style, {
            position: 'fixed',
            top: '80px',
            right: '30px',
            padding: '15px',
            backgroundColor: 'white',
            border: '1px solid #d3d6da',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: '10000',
            fontFamily: 'sans-serif',
            color: 'black'
        });

        const title = document.createElement('h3');
        title.textContent = "Kevin's Wordle Helper WIP!";
        Object.assign(title.style, {
            margin: '0 0 10px 0',
            fontSize: '18px'
        });
        helperBox.appendChild(title);

        const sliderdiv = document.createElement('div');
        Object.assign(sliderdiv.style, {
            display: 'flex', alignItems: 'center', margin: '10px 0'
        });

        slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '2';
        slider.max = '10';
        slider.value = num;
        Object.assign(slider.style, { flexGrow: '1', marginRight: '10px' });

        sliderValueLabel = document.createElement('span');
        sliderValueLabel.textContent = slider.value;

        sliderdiv.appendChild(slider);
        sliderdiv.appendChild(sliderValueLabel);
        helperBox.appendChild(sliderdiv);

        wordsList = document.createElement('ul');
        Object.assign(wordsList.style, {
            listStyle: 'none',
            margin: '0',
            padding: '0'
        });
        helperBox.appendChild(wordsList);

        document.body.appendChild(helperBox);

        slider.addEventListener('input', () => {
            sliderValueLabel.textContent = slider.value;
            suggestNDisplay(parseInt(slider.value, 10));
        });
    }

    slider.value = num;
    sliderValueLabel.textContent = num;

    wordsList.innerHTML = '';
    if (words && words.length > 0 && words.some(word => word !== '')) {
        words.forEach(word => {
            if (word) {
                const listItem = document.createElement('li');
                listItem.textContent = word.toUpperCase();
                listItem.style.fontSize = '16px';
                listItem.style.padding = '4px 0';
                wordsList.appendChild(listItem);
            }
        });
    } else {
        const noWords = document.createElement('li');
        noWords.textContent = 'No matching words found.';
        noWords.style.margin = '0';
        wordsList.appendChild(noWords);
    }
}