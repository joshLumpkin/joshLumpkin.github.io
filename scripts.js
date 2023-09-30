//Variables
let word = '';
let guessedLetters = [];
let wrongGuesses = 0;
let guessAmount = 6;

//Fetch word
function fetchWord() {
    fetch('https://random-word-api.herokuapp.com/word?length=7')
    .then(response => response.json())
    .then(data => {
        if (data.length && typeof data[0] === 'string') { // Check if there's a word in the response
            word = data[0].toUpperCase();
            console.log(word);
            displayWord();
        } else {
            console.error('Unexpected data from API:', data);
        }
    })
    .catch(error => {
        console.error('Error fetching word:', error);
    });
}

//Guess a letter
function guessLetter() {

    displayWord();
}

//Display letter or _
function displayWord() {
    let display = '';
    for (let letter of word) {
        if (guessedLetters.includes(letter)) {
            display += letter + ' ';
        } else {
            display += '_ ';
        }
    }
    document.getElementById('wordDisplay').textContent = display.trim();
}

//New Game
function newGame() {
    guessedLetters = [];
    wrongGuesses = 0;
    document.querySelectorAll('.letterBtn').forEach(button => {
        button.disabled = false; // Enable all letter buttons for a new game
        button.classList.remove('correct', 'wrong'); // Remove the "correct" and "wrong" classes from all buttons
    });
    fetchWord();
}


fetchWord();