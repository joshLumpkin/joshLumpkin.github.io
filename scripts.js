//Variables
let word = '';
let wordArray = [];
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

//Guess a letter
document.getElementById('keyboard').addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('letterBtn')) {
        const button = e.target;
        const letter = button.value;
        button.disabled = true;

        if (word.includes(letter)) {
            button.classList.add('correct');
            guessedLetters.push(letter);
            displayWord();

            if (Array.from(new Set(word.split(''))).every(l => guessedLetters.includes(l))) {
                // Player wins
                document.getElementById('gameMessage').textContent = 'You won! Want to play again?';
            }
        } else {
            button.classList.add('wrong');
            wrongGuesses++;

            if (wrongGuesses >= guessAmount) {
                // Player loses
                document.getElementById('gameMessage').textContent = 'You lost! The word was ' + word + '.';
            } else {
                // Update hangman drawing based on wrongGuesses
                updateHangmanDrawing(wrongGuesses);
            }
        }
    }
});


fetchWord();