//Variables
let word = '';
let wordArray = [];
let guessedLetters = [];
let wrongGuesses = 0;
let guessAmount = 6;
const hangmanParts = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];

//Fetch word
function fetchWord() {
    fetch('https://random-word-api.herokuapp.com/word?length=5')
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

//Display letter or _ based on guest
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

//Update the hangman drawing based on how many wrong guesses
function updateHangmanDrawing(wrongGuesses) {
    if (wrongGuesses > 0 && wrongGuesses <= hangmanParts.length) {
        const part = hangmanParts[wrongGuesses - 1];
        document.querySelector(`.${part}`).style.display = 'block';
    }
}

//Start a new game
function newGame() {
    guessedLetters = [];
    wrongGuesses = 0;

    //remove game message
    document.getElementById('gameMessage').textContent = '';

    //remove colors and make all buttons active again
    document.querySelectorAll('.letterBtn').forEach(button => {
        button.disabled = false; // Enable all letter buttons for a new game
        button.classList.remove('correct', 'wrong'); // Remove the "correct" and "wrong" classes from all buttons
    });

    //remove all hangman parts from view
    hangmanParts.forEach(part => {
        document.querySelector(`.${part}`).style.display = 'none';
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
                updateHangmanDrawing(wrongGuesses);
                document.querySelectorAll('.letterBtn').forEach(btn => {
                    btn.disabled = true;
                });
            } else {
                // Update hangman drawing based on wrongGuesses
                updateHangmanDrawing(wrongGuesses);
            }
        }
    }
});

//Starts the game by grabbing a word
fetchWord();