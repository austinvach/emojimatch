// import { VerifiableCredential } from "@web5/credentials";
const cardCount = 32; // Must be an even number since every card needs a pair
let cardPreviewInMS;
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
let emojiCategory;
let emojiSkinTone;
let emojiStyle = 'flat';
// let cardBackgroundColor;
// Other variables
let selectedCards = [];
let ignoreClicks = true;

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', e => {
    // console.log('DOMContentLoaded EventListener');
    onLoad();
    // IS THIS NECESSARY?
    checkLocalStorage();
});

document.getElementById('reset').addEventListener('click', e => {
    // console.log('Reset EventListener');
    reset();
});

document.getElementById('emojiCategoriesInHeader').addEventListener('change', e => {
    // console.log('emojiCategoriesInHeader EventListener');
    emojiCategoriesInOptions.value = emojiCategoriesInHeader.value;
    reset();
});

document.getElementById('emojiCategoriesInOptions').addEventListener('change', e => {
    // console.log('emojiCategoriesInOptions EventListener');
    emojiCategoriesInHeader.value = emojiCategoriesInOptions.value;
    reset();
});

document.getElementById('skinTones').addEventListener('change', e => {
    // console.log('skinTones EventListener');
    reset();
});

document.getElementById('cardPreviews').addEventListener('change', e => {
    // console.log('cardPreviews EventListener');
    reset();
});

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
    populateSkinTones(); // Populates the dropdown with the emoji categories
    // populateCardPreviewDropdown(); // Populates the dropdown with the emoji categories
    pickPairs();
    setCardsFaceUp();
};

// GAME SETUP FUNCTIONS

function checkLocalStorage() {
    // console.log('checkLocalStorage');
    if (storageAvailable('localStorage')) {
        if (localStorage.getItem('emojiCategory')) {
            emojiCategory = localStorage.getItem('emojiCategory');
        }
        if (localStorage.getItem('emojiSkinTone')) {
            emojiSkinTone = localStorage.getItem('emojiSkinTone');
        }
        else {
            emojiSkinTone = "default";
        }
        if (localStorage.getItem('emojiStyle')) {
            emojiStyle = localStorage.getItem('emojiStyle');
        }
        else {
            emojiStyle = "flat";
        }
        if (localStorage.getItem('cardPreviewInMS')) {
            cardPreviewInMS = localStorage.getItem('cardPreviewInMS');
        }
        else {
            cardPreviewInMS = "8000";
        }
    } else {
        console.log('LOCAL STORAGE NOT AVAILABLE');
    }
}

function populateCategories() {
    // console.log('populateCategories');
    const categoryIcons = {
        "Smileys & Emotion": "🙂",
        "People & Body": "🧙‍♂️",
        "Animals & Nature": "🕸️",
        "Food & Drink": "🍪",
        "Travel & Places": "🌎",
        "Activities": "⚽",
        "Objects": "🧮",
        "Symbols & Flags": "⛔"
    };
    const emojiCategoriesInHeader = document.getElementById('emojiCategoriesInHeader');
    const emojiCategoriesInOptions = document.getElementById('emojiCategoriesInOptions');
    for (var i = 0; i < emoji.length; i++) {
        var categoryName = emoji[i].name;
        var categoryIcon = categoryIcons[categoryName];
        var displayName = categoryIcon ? `${categoryIcon} ${categoryName}` : categoryName;
        if (emojiCategory && emojiCategory === categoryName) { // If user settings exist, honor their selected category
            emojiCategoriesInHeader.add(new Option(displayName, categoryName, false, true));
            emojiCategoriesInOptions.add(new Option(displayName, categoryName, false, true));
        }
        else {
            emojiCategoriesInHeader.add(new Option(displayName, categoryName));
            emojiCategoriesInOptions.add(new Option(displayName, categoryName));
        }
    }
};

function populateSkinTones() {
    // console.log('populateSkinTones');
    const skinTones = [
        { icon: "✌️", name: "Default", value: "default" },
        { icon: "✌🏻", name: "Light",  value: "light" },
        { icon: "✌🏼", name: "Medium-Light", value: "medium_light" },
        { icon: "✌🏽", name: "Medium", value: "medium" },
        { icon: "✌🏾", name: "Medium-Dark", value: "medium_dark" },
        { icon: "✌🏿", name: "Dark", value: "dark" }
      ];
    const skinToneList = document.getElementById('skinTones');
    for (let skinTone of skinTones) {
        var skinToneValue = skinTone.value;
        var displayName = `${skinTone.icon} ${skinTone.name}`;
    
        if (emojiSkinTone && emojiSkinTone === skinToneValue) { // If user settings exist, honor their selected skin tone
            skinToneList.add(new Option(displayName, skinToneValue, false, true));
        }
        else {
            skinToneList.add(new Option(displayName, skinToneValue));
        }
    }
};

// CORE GAME FUNCTIONS

function pickPairs() {
    // console.log('pickPairs');
    const emojiCategoriesInOptions = document.getElementById('emojiCategoriesInOptions');
    const emojiSkinTones = document.getElementById('skinTones');
    const cardPreview = document.getElementById('cardPreviews');
    emojiCategory = emojiCategoriesInOptions.selectedOptions[0].value;
    emojiSkinTone = emojiSkinTones.selectedOptions[0].value;
    cardPreviewInMS = cardPreview.selectedOptions[0].value;
    let selectedEmoji = emoji[emojiCategoriesInOptions.selectedIndex].emojis;
    selectedEmoji.sort(() => Math.random() - 0.5); // Randomizes the array
    pairs = selectedEmoji.slice(0, (cardCount / 2)); // Picks half the number of cards requested in cardCount variable
    pairs = pairs.concat(pairs) // Duplicates each value in the array so that each emoji has a pair
    pairs.sort(() => Math.random() - 0.5); // Randomizes the pairs
};

function setCardsFaceUp() {
    // console.log('setCardsFaceUp');
    const cards = document.getElementById('cards');
    for (var i = 0; i < pairs.length; i++) {
        const card = document.createElement('div');
        card.setAttribute('class', 'faceUp');
        card.setAttribute('id', i);
        const img = document.createElement('img');
        img.setAttribute('alt', `${pairs[i].name} emoji`);        
        if(pairs[i].skin_tone_support){
            img.setAttribute('src', `assets/emoji/${emojiStyle}/${pairs[i].slug}_${emojiStyle}_${emojiSkinTone}.svg`);
        }else{
            img.setAttribute('src', `assets/emoji/${emojiStyle}/${pairs[i].slug}_${emojiStyle}.svg`);
        }
        cards.appendChild(card);
        card.appendChild(img);
        card.addEventListener('click', e => {
            selectedCards = document.querySelectorAll('.faceUp')
            if (selectedCards.length === 0 && !ignoreClicks) {
                flipSelectedCardFaceUp(e.target);
            }
            else if (selectedCards.length === 1 && e.target.id != selectedCards[0].id) {
                flipSelectedCardFaceUp(e.target);
                checkCards();
            }
        });
    }
    previewTimerId = setTimeout(flipCardsFaceDown, cardPreviewInMS); // Waits the amount of milliseconds specificed in the cardPreviewInMS variable before flipping the cards face down.
};

function flipCardsFaceDown() {
    // console.log('flipCardsFaceDown');
    let cards = document.querySelectorAll('.faceUp');
    for (var i = 0; i < cards.length; i++) {
        cards[i].classList.replace('faceUp','faceDown');
    }
    ignoreClicks = false;
    startStopwatch();
};

function flipSelectedCardFaceUp(card) {
    // console.log('flipSelectedCardFaceUp');
    card.classList.replace('faceDown','faceUp');
};

function checkCards() {
    // console.log('checkCards');
    selectedCards = document.querySelectorAll('.faceUp')
    if (selectedCards[0].firstChild.src === selectedCards[1].firstChild.src) {
        transitionDelayTimerId = setTimeout(clearMatch, transitionDelayTimeInMS); // Waits before clearing cards.
    }
    else {
        transitionDelayTimerId = setTimeout(flipSelectedCardsFaceDown, transitionDelayTimeInMS); // Waits before flipping cards face down.
    }
}

function flipSelectedCardsFaceDown() {
    // console.log('flipSelectedCardsFaceDown');
    for (var i = 0; i < selectedCards.length; i++) {
        selectedCards[i].classList.replace('faceUp','faceDown');
    }
}

function clearMatch() {
    // console.log('clearMatch');
    for (var i = 0; i < selectedCards.length; i++) {
        selectedCards[i].classList.toggle('faceUp');
        selectedCards[i].classList.add('notVisible');
    }
    hiddenCards = document.querySelectorAll('.notVisible');
    if (hiddenCards.length === cardCount) {
        document.getElementById('cards').style.setProperty('display', 'none');
        document.getElementById('endScreen').style.setProperty('display', 'block');
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
    // document.getElementById('stopwatch').innerHTML = `${displayMinutes}:${displaySeconds}`; // Displays updated time to user
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
    // document.getElementById('stopwatch').innerHTML = '00:00';
};

// RESET FUNCTIONS

function reset() {
    // console.log('reset');
    ignoreClicks = true;
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
    let cards = document.getElementById('cards');
    cards.innerHTML = '';
    cards.removeAttribute('style');
    document.getElementById('endScreen').removeAttribute('style');
};

window.onkeydown = function (k) { // Resets the game when the user presses the space bar
    // console.log('SPACEBAR');
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
    console.log(emojiCategory, emojiSkinTone, cardPreviewInMS);
    localStorage.setItem('emojiCategory', emojiCategory);
    localStorage.setItem('emojiSkinTone', emojiSkinTone);
    localStorage.setItem('selectedcardPreviewInMS', cardPreviewInMS);
}

// WEB5 STUFF - NEEDS WORK

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
