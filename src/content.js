const pathToHelper = browser.runtime.getURL("src/wordleHelper.js");

// fetches the words from the page
import(pathToHelper).then(module => {
    const getTopFiveWords = module.getTopFiveWords;

    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "getSuggestions") {
            console.log("starting wordle helper");

            const incorrectLetters = new Set();
            const correctLetters = [];
            const almostCorrectLetters = [];

            const gameApp = document.querySelector('game-app');
            if (!gameApp || !gameApp.shadowRoot) {
                console.error("cant find dom");
                return;
            }

            const rows = gameApp.shadowRoot.querySelectorAll('game-row');

            rows.forEach((row) => {
                if(!row.shadowRoot){ return; }
                const tiles = row.shadowRoot.querySelectorAll('game-tile');

                tiles.forEach((tile, tileIndex) => {
                    const letter = tile.getAttribute('letter');
                    const state = tile.getAttribute('state');

                    if (!letter || !state) {
                        return;
                    }

                    if (state === 'absent') {
                        incorrectLetters.add(letter);
                    } else if (state === 'correct') {
                        correctLetters.push({ char: letter, position: tileIndex });
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

            console.log("Incorrect Letters Found:", incorrectLettersArray);
            console.log("Correct Letters Found:", correctLetters);
            console.log("Almost Correct Letters Found:", almostCorrectLetters);

            getTopFiveWords(incorrectLettersArray, correctLetters, almostCorrectLetters).then(words => {
                console.log("words are:", words);
                displayWords(words);
            });
        }
    });
}).catch(error => {
    console.error("error!", error);
});






function displayWords(words) {
    const oldBox = document.getElementById('wordle-helper-box');
    if (oldBox) {
        oldBox.remove();
    }

    // add an X button to close it

    const newBox = document.createElement('div');
    newBox.id = 'wordle-helper-box';

    Object.assign(newBox.style, {
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
    title.textContent = "Wordle Helper";
    Object.assign(title.style, {
        margin: '0 0 10px 0',
        fontSize: '18px'
    });
    newBox.appendChild(title);

    // make little slider to adjust how many words are shown.

    if (words && words.length > 0 && words.some(word => word !== '')) {
        const list = document.createElement('ul');
        Object.assign(list.style, {
            listStyle: 'none',
            margin: '0',
            padding: '0'
        });

        words.forEach(word => {
            if (word) {
                const listItem = document.createElement('li');
                listItem.textContent = word.toUpperCase();
                listItem.style.fontSize = '16px';
                listItem.style.padding = '4px 0';
                list.appendChild(listItem);
            }
        });
        newBox.appendChild(list);
    } else {
        const noWords = document.createElement('p');
        noWords.textContent = 'No matching words found.';
        noWords.style.margin = '0';
        newBox.appendChild(noWords);
    }

    document.body.appendChild(newBox);
}