
const backOfCard = 'media/emoji/blue_square_flat.svg';
const cardCount = 32; // Must be an even number since every card needs a pair
const previewTimeInMS = 8000;
const transitionDelayTimeInMS = 400;
// Variables to hold timeout and interval ids
let previewTimerId;
let stopwatchIntervalId = 0;
let transitionDelayTimerId;
// Variables to hold time values
let minutes = 0
let seconds = 0
// Variables to hold display values
let displayMinutes = 0;
let displaySeconds = 0;
// Variables to hold emojis
let emoji = [];
let pairs = [];
// Other variables
let selectedCards = [];

document.addEventListener('DOMContentLoaded', e => {
    // console.log('DOMContentLoaded');
    onLoad();
});

function onLoad() {
    // console.log('onLoad');
    fetch('emoji.json') // Makes an HTTP/HTTPS GET request
        .then(response => response.json()) // Parses the body as a JSON object
        .then(json => prepareGame(json)) // Passes the JSON to the prepareGame() function
}

// CAN I REMOVE THIS AND JUST ADD MORE .then's UP ABOVE?
function prepareGame(json) {
    // console.log('prepareGame');
    emoji = json; // Saves the emoji JSON to the emojis variable
    populateOptions(); // Populates the dropdown with the emoji categories
    pickPairs();
    setCardsFaceUp();
};

function populateOptions() {
    // console.log('populateOptions');
    const section = document.querySelector('select');
    for (var i = 0; i < emoji.length; i++) {
        section.add(new Option(emoji[i].name, emoji[i].value));
    }
};

function pickPairs() {
    // console.log('pickPairs');
    const categoryDropdown = document.querySelector('select');
    let selectedEmoji = emoji[categoryDropdown.selectedIndex].emojis;
    selectedEmoji.sort(() => Math.random() - 0.5); // Randomizes the array
    pairs = selectedEmoji.slice(0, (cardCount / 2)); // Picks half the number of cards requested in cardCount variable
    pairs = pairs.concat(pairs) // Duplicates each value in the array so that each emoji has a pair
    pairs.sort(() => Math.random() - 0.5); // Randomizes the pairs
};

function setCardsFaceUp() {
    // console.log('setCardsFaceUp');
    // Shorten forEach
    pairs.forEach((item, index) => { // Creates the cards and sets them face up
        const section = document.querySelector('.grid');
        const card = document.createElement('img');
        card.setAttribute('id', index);
        card.setAttribute('alt', `${item.name} emoji`);
        card.setAttribute('src', `media/emoji/${item.slug}_flat.svg`);
        section.appendChild(card);
        card.addEventListener('click', e => {
            selectedCards = document.querySelectorAll('.faceUp')
            if (selectedCards.length === 0) {
                flipCardFaceUp(e.target);
            }
            else if (selectedCards.length === 1 && e.target.id != selectedCards[0].id) {
                e.target.setAttribute('src', `media/emoji/${pairs[e.target.id].slug}_flat.svg`);
                e.target.classList.toggle('faceUp');
                checkCards();
            }
        });
    });
    previewTimerId = setTimeout(flipCardsFaceDown, previewTimeInMS); // Waits the amount of milliseconds specificed in the cardPreviewInMS variable before flipping the cards face down.
};

function checkCards() {
    // console.log('checkCards');
    selectedCards = document.querySelectorAll('.faceUp')
    if (selectedCards[0].src === selectedCards[1].src) {
        console.log('BOO YAH! THAT\'S A MATCH')
        transitionDelayTimerId = setTimeout(clearMatch, transitionDelayTimeInMS); // Waits before clearing cards.
    }
    else {
        console.log('SORRY, NOT A MATCH')
        transitionDelayTimerId = setTimeout(flipSelectedCardsFaceDown, transitionDelayTimeInMS); // Waits before flipping cards face down.
    }
}

function flipCardFaceUp(card) {
    // console.log('flipCardFaceUp');
    card.setAttribute('src', `media/emoji/${pairs[card.id].slug}_flat.svg`);
    card.classList.toggle('faceUp');
};

function flipCardsFaceDown() {
    // console.log('flipCardsFaceDown');
    var cards = document.getElementsByTagName('img');
    for (var i = 0; i < cards.length; i++) {
        cards[i].setAttribute('src', backOfCard);
    }
    startStopwatch();
};

function flipSelectedCardsFaceDown() {
    // console.log('flipSelectedCardsFaceDown');
    for (var i = 0; i < selectedCards.length; i++) {
        selectedCards[i].setAttribute('src', backOfCard);
        selectedCards[i].classList.toggle('faceUp');
    }
}

function startStopwatch() {
    // console.log('startStopwatch')
    stopwatchIntervalId = window.setInterval(stopwatch, 1000);
}

function reset() {
    // console.log('reset');
    clearTimeout(previewTimerId);
    clearTimeout(transitionDelayTimerId);
    clearInterval(stopwatchIntervalId);
    resetStopwatch();
    clearBoard();
    pickPairs();
    setCardsFaceUp();
};

function clearMatch() {
    // console.log('clearMatch');
    for (var i = 0; i < selectedCards.length; i++) {
        selectedCards[i].classList.toggle('faceUp');
        selectedCards[i].classList.add('cleared');
    }
    hiddenCards = document.querySelectorAll('.cleared');
    if (hiddenCards.length === cardCount) {
        console.log('That\s the game!')
        document.querySelector('.grid').innerHTML = 'That\s the game! Press the space bar to start a new game.';
        stopStopwatch();
    }
}

function clearBoard() {
    // console.log('clearBoard');
    const section = document.querySelector('.grid');
    section.innerHTML = '';
};

function stopStopwatch() {
    // console.log('stopStopwatch')
    window.clearInterval(stopwatchIntervalId);
}

function stopwatch() {
    // console.log('stopwatch');
    seconds++;
    if (seconds / 60 === 1) { // Logic to determine when to increment next value
        seconds = 0;
        minutes++;
    }
    if (seconds < 10) { // Adds a leading 0 if the seconds/minutes are only one digit.
        displaySeconds = `0${seconds}`; 
    }
    else {
        displaySeconds = seconds;
    }
    if (minutes < 10) {
        displayMinutes = `0${minutes}`;
    }
    else {
        displayMinutes = minutes;
    }
    document.getElementById('stopwatch').innerHTML = `${displayMinutes}:${displaySeconds}`; // Displays updated time to user
} 

function resetStopwatch() {
    // console.log('resetStopwatch');
    seconds = 0
    minutes = 0
    displaySeconds = 0;
    displayMinutes = 0;
    document.getElementById('stopwatch').innerHTML = '00:00'
};

window.onkeydown = function (k) {
    if (k.keyCode === 32) {
        reset();
    };
};