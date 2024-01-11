// import { VerifiableCredential } from "@web5/credentials";
const backOfCard = 'media/emoji/flat/blue_square_flat.svg';
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
// Variables to store user preferences
let selectedCategory;
// Other variables
let selectedCards = [];

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', e => {
    // console.log('DOMContentLoaded EventListener');
    onLoad();
    checkLocalStorage();
});

document.getElementById('reset').addEventListener('click', e => {
    // console.log('Reset EventListener');
    reset();
});

document.getElementById('emojiCategories').addEventListener('change', e => {
    // console.log('EmojiCategories EventListener');
    reset();
});

// document.getElementById('settings').addEventListener('click', e => {
//     showModal();
// });

// ONLOAD FUNCTIONS

function onLoad() {
    // console.log('onLoad');
    fetch('emoji.json') // Makes an HTTP/HTTPS GET request
        .then(response => response.json()) // Parses the body as a JSON object
        .then(json => prepareGame(json)) // Passes the JSON to the prepareGame() function
}

function prepareGame(json) {
    // console.log('prepareGame');
    emoji = json; // Saves the emoji JSON to the emojis variable
    checkLocalStorage(); // Checks for any saved customer preferences
    populateCategories(); // Populates the dropdown with the emoji categories
    pickPairs();
    setCardsFaceUp();
};

// GAME SETUP FUNCTIONS

function checkLocalStorage() {
    // console.log('checkLocalStorage');
    if (storageAvailable('localStorage')) {
        selectedCategory = localStorage.getItem('selectedCategory')
    } else {
        console.log('LOCAL STORAGE NOT AVAILABLE');
    }
}

function populateCategories() {
    // console.log('populateCategories');
    const section = document.querySelector('select');
    for (var i = 0; i < emoji.length; i++) {
        if (selectedCategory && selectedCategory === emoji[i].name) { // If user settings exist, honor their selected category
            section.add(new Option(emoji[i].name, emoji[i].name, false, true));
        }
        else {
            section.add(new Option(emoji[i].name, emoji[i].name));
        }
    }
};

// CORE GAME FUNCTIONS

function pickPairs() {
    // console.log('pickPairs');
    const categoryDropdown = document.querySelector('select');
    selectedCategory = categoryDropdown.selectedOptions[0].value;
    let selectedEmoji = emoji[categoryDropdown.selectedIndex].emojis;
    selectedEmoji.sort(() => Math.random() - 0.5); // Randomizes the array
    pairs = selectedEmoji.slice(0, (cardCount / 2)); // Picks half the number of cards requested in cardCount variable
    pairs = pairs.concat(pairs) // Duplicates each value in the array so that each emoji has a pair
    pairs.sort(() => Math.random() - 0.5); // Randomizes the pairs
};

function setCardsFaceUp() {
    // console.log('setCardsFaceUp');
    const section = document.querySelector('.grid');
    for (var i = 0; i < pairs.length; i++) {
        const card = document.createElement('img');
        card.setAttribute('id', i);
        card.setAttribute('alt', `${pairs[i].name} emoji`);
        card.setAttribute('src', `media/emoji/flat/${pairs[i].slug}_flat.svg`);
        section.appendChild(card);
        card.addEventListener('click', e => {
            selectedCards = document.querySelectorAll('.faceUp')
            if (selectedCards.length === 0) {
                flipSelectedCardFaceUp(e.target);
            }
            else if (selectedCards.length === 1 && e.target.id != selectedCards[0].id) {
                flipSelectedCardFaceUp(e.target);
                checkCards();
            }
        });
    }
    previewTimerId = setTimeout(flipCardsFaceDown, previewTimeInMS); // Waits the amount of milliseconds specificed in the cardPreviewInMS variable before flipping the cards face down.
};

function flipCardsFaceDown() {
    // console.log('flipCardsFaceDown');
    var cards = document.getElementsByTagName('img');
    for (var i = 0; i < cards.length; i++) {
        cards[i].setAttribute('src', backOfCard);
    }
    startStopwatch();
};

function flipSelectedCardFaceUp(card) {
    // console.log('flipSelectedCardFaceUp');
    card.setAttribute('src', `media/emoji/flat/${pairs[card.id].slug}_flat.svg`);
    card.classList.toggle('faceUp');
};

function checkCards() {
    // console.log('checkCards');
    selectedCards = document.querySelectorAll('.faceUp')
    if (selectedCards[0].src === selectedCards[1].src) {
        transitionDelayTimerId = setTimeout(clearMatch, transitionDelayTimeInMS); // Waits before clearing cards.
    }
    else {
        transitionDelayTimerId = setTimeout(flipSelectedCardsFaceDown, transitionDelayTimeInMS); // Waits before flipping cards face down.
    }
}

function flipSelectedCardsFaceDown() {
    // console.log('flipSelectedCardsFaceDown');
    for (var i = 0; i < selectedCards.length; i++) {
        selectedCards[i].setAttribute('src', backOfCard);
        selectedCards[i].classList.toggle('faceUp');
    }
}

function clearMatch() {
    // console.log('clearMatch');
    for (var i = 0; i < selectedCards.length; i++) {
        selectedCards[i].classList.toggle('faceUp');
        selectedCards[i].classList.add('cleared');
    }
    hiddenCards = document.querySelectorAll('.cleared');
    if (hiddenCards.length === cardCount) {
        document.querySelector('.grid').innerHTML = 'That\s the game! Press the space bar to start a new game.';
        stopStopwatch();
    }
}

// STOPWATCH FUNCTIONS

function startStopwatch() {
    // console.log('startStopwatch')
    stopwatchIntervalId = window.setInterval(stopwatch, 1000);
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

function stopStopwatch() {
    // console.log('stopStopwatch')
    window.clearInterval(stopwatchIntervalId);
}

function resetStopwatch() {
    // console.log('resetStopwatch');
    seconds = 0
    minutes = 0
    displaySeconds = 0;
    displayMinutes = 0;
    document.getElementById('stopwatch').innerHTML = '00:00'
};

// RESET FUNCTIONS

function reset() {
    // console.log('reset');
    // document.querySelector("#gameOverDialog").close();
    clearTimeout(previewTimerId);
    clearTimeout(transitionDelayTimerId);
    clearInterval(stopwatchIntervalId);
    resetStopwatch();
    clearBoard();
    pickPairs();
    setCardsFaceUp();
    saveUserSettings();
};

function clearBoard() {
    // console.log('clearBoard');
    const section = document.querySelector('.grid');
    section.innerHTML = '';
};

window.onkeydown = function (k) { // Resets the game when the user presses the space bar
    if (k.keyCode === 32) {
        reset();
    };
};

// FUNCTIONS TO MANAGE USER SETTINGS

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            // everything except Firefox
            (e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === "QuotaExceededError" ||
                // Firefox
                e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
        );
    }
}

function saveUserSettings() {
    // console.log('saveUserSettings');
    console.log(selectedCategory);
    localStorage.setItem('selectedCategory', selectedCategory);
}

// MODAL STUFF - NEEDS CLEANUP

function showModal() {
    document.querySelector("#gameOverDialog").showModal();
}

// var form = document.getElementById("modalForm");
// var settings = document.getElementById("settings");

// settings.addEventListener("click", function () {
//     showModal();
// });


// // Add an event listener to the form's submit event
// form.addEventListener("submit", function (event) {
//     event.preventDefault(); // Prevent the default form submission behavior
//     var textarea = document.getElementById("did"); // Get the textarea element by its id
//     var did = textarea.value; // Get the value of the textarea
//     console.log(did);
//     issueVC();
//     // textarea.value = ""; // Clear the textarea
// });

// async function issueVC() {
//     console.log("issueVC");
//     const currentTime = document.getElementById('stopwatch').innerHTML;
//     console.log(currentTime);
//     document.querySelector("#gameOverDialog").showModal();

//     // Create VC
//     const vc = await VerifiableCredential.create({
//         type: 'EmojiMatchAchievement',
//         issuer: issuer.did,
//         subject: player.did,
//         data: {
//           "bestTime": "00:59"
//         }
//       });

//     // Sign with Issuer DID
//     const signedVcJwt = await vc.sign({ did: issuer });

//     console.log(signedVcJwt);
// }