const cardCount = 32; // Must be an even number since every card needs a pair
const transitionDelayTimeInMS = 400;
// Variables to hold timeout and interval ids
let previewTimerId;
let stopwatchIntervalId = 0;
let transitionDelayTimerId;
// Variables to hold time values
let minutes = 0;
let seconds = 0;
// Variables to hold display values
let displayMinutes = 0;
let displaySeconds = 0;
// Variables to hold emojis
let emoji = [];
let pairs = [];
// Variables to store user settings
let selectedEmojiCategory;
let selectedEmojiSkinTone;
let selectedCardPreviewTime;
// Other variables
let selectedCards = [];
let ignoreClicks = true;
let emojiStyle = "flat";

// EVENT LISTENERS
document.addEventListener("DOMContentLoaded", (e) => {
  onLoad();
});

addEventListenerById("emojiCategoryDropdownInHeader", "change", (e) => {
  emojiCategoryDropdown.value = emojiCategoryDropdownInHeader.value;
  reset();
});

addEventListenerById("emojiCategoryDropdown", "change", (e) => {
  emojiCategoryDropdownInHeader.value = emojiCategoryDropdown.value;
  reset();
});

addEventListenerById("reset", "click", reset);
addEventListenerById("emojiSkinToneDropdown", "change", reset);
addEventListenerById("cardPreviewTimeDropdown", "change", reset);

// SETUP FUNCTIONS - ONLY RUN WHEN THE PAGE IS LOADED/RELOADED

async function onLoad() {
  // console.log('onLoad');
  const response = await fetch("emoji.json"); // Makes an HTTP/HTTPS GET request
  emoji = await response.json(); // Parses the body as a JSON object and saves it to the emojis variable
  checkLocalStorage(); // Checks for any saved customer preferences
  populateCategories(); // Populates the dropdown with the emoji categories
  populateSkinTones(); // Populates the dropdown with the emoji skin tones
  populateCardPreviewTimes(); // Populates the dropdown with the card preview times
  pickPairs();
  setCardsFaceUp();
}

function checkLocalStorage() {
  // console.log('checkLocalStorage');
  if (storageAvailable("localStorage")) {
    selectedEmojiCategory = localStorage.getItem("selectedEmojiCategory");
    selectedEmojiSkinTone = localStorage.getItem("selectedEmojiSkinTone");
    selectedCardPreviewTime =
      localStorage.getItem("selectedCardPreviewTime") || "8000";
  } else {
    console.log("LOCAL STORAGE NOT AVAILABLE");
  }
}

function populateCategories() {
  // console.log('populateCategories');
  const emojiCategoryDropdownInHeader = document.getElementById(
    "emojiCategoryDropdownInHeader"
  );
  const emojiCategoryDropdown = document.getElementById(
    "emojiCategoryDropdown"
  );
  const emojiCategories = [
    { icon: "🙂", name: "Smileys & Emotion", value: "smileys_and_emotion" },
    { icon: "🧙‍♂️", name: "People & Body", value: "people_and_body" },
    { icon: "🕸️", name: "Animals & Nature", value: "animals_and_nature" },
    { icon: "🍪", name: "Food & Drink", value: "food_and_drink" },
    { icon: "🌎", name: "Travel & Places", value: "travel_and_places" },
    { icon: "⚽", name: "Activities", value: "activities" },
    { icon: "🧮", name: "Objects", value: "objects" },
    { icon: "⛔", name: "Symbols & Flags", value: "symbols_and_flags" },
  ];

  const options = emojiCategories.map((emojiCategory) => {
    const categoryDisplayName = `${emojiCategory.icon} ${emojiCategory.name}`;
    const isSelected = selectedEmojiCategory === emojiCategory.value;
    return new Option(
      categoryDisplayName,
      emojiCategory.value,
      false,
      isSelected
    );
  });

  const headerOptions = emojiCategories.map((emojiCategory) => {
    const categoryDisplayName = `${emojiCategory.icon} ${emojiCategory.name}`;
    const isSelected = selectedEmojiCategory === emojiCategory.value;
    return new Option(
      categoryDisplayName,
      emojiCategory.value,
      false,
      isSelected
    );
  });

  emojiCategoryDropdown.append(...options);
  emojiCategoryDropdownInHeader.append(...headerOptions);
}

function populateSkinTones() {
  // console.log('populateSkinTones');
  const emojiSkinToneDropdown = document.getElementById(
    "emojiSkinToneDropdown"
  );
  const emojiSkinTones = [
    { icon: "✌️", name: "Default", value: "default" },
    { icon: "✌🏻", name: "Light", value: "light" },
    { icon: "✌🏼", name: "Medium-Light", value: "medium_light" },
    { icon: "✌🏽", name: "Medium", value: "medium" },
    { icon: "✌🏾", name: "Medium-Dark", value: "medium_dark" },
    { icon: "✌🏿", name: "Dark", value: "dark" },
  ];

  const options = emojiSkinTones.map((emojiSkinTone) => {
    const displayName = `${emojiSkinTone.icon} ${emojiSkinTone.name}`;
    const isSelected = selectedEmojiSkinTone === emojiSkinTone.value;
    return new Option(displayName, emojiSkinTone.value, false, isSelected);
  });

  emojiSkinToneDropdown.append(...options);
}

function populateCardPreviewTimes() {
  // console.log('populateCardPreviewTimes');
  const cardPreviewTimeDropdown = document.getElementById(
    "cardPreviewTimeDropdown"
  );
  const cardPreviewTimes = [
    { name: "4 Seconds", value: "4000" },
    { name: "8 Seconds", value: "8000" },
    { name: "16 Seconds", value: "16000" },
  ];

  const options = cardPreviewTimes.map((cardPreviewTime) => {
    const isSelected = selectedCardPreviewTime === cardPreviewTime.value;
    return new Option(
      cardPreviewTime.name,
      cardPreviewTime.value,
      false,
      isSelected
    );
  });

  cardPreviewTimeDropdown.append(...options);
}

// CARD PREP FUNCTIONS - RUN ON PAGE LOAD/RELOAD AND WHENEVER THE USER CLICKS THE RESET BUTTON

function pickPairs() {
  // console.log('pickPairs');
  selectedEmojiCategory = getSelectedValue("emojiCategoryDropdown");
  selectedEmojiSkinTone = getSelectedValue("emojiSkinToneDropdown");
  selectedCardPreviewTime = getSelectedValue("cardPreviewTimeDropdown");

  let selectedEmoji = emoji[emojiCategoryDropdown.selectedIndex].emojis;
  selectedEmoji.sort(() => Math.random() - 0.5); // Randomizes the array

  pairs = selectedEmoji.slice(0, cardCount / 2); // Picks half the number of cards requested in cardCount variable
  pairs = [...pairs, ...pairs]; // Duplicates each value in the array so that each emoji has a pair

  pairs.sort(() => Math.random() - 0.5); // Randomizes the pairs
}

function setCardsFaceUp() {
  // console.log('setCardsFaceUp');
  const cards = document.getElementById("cards");
  const fragment = document.createDocumentFragment();

  pairs.forEach((emoji, i) => {
    const card = document.createElement("div");
    card.classList.add("faceUp");
    card.id = i;
    const img = document.createElement("img");
    img.alt = `${emoji.name} emoji`;
    img.src =
      `assets/emoji/${emojiStyle}/${emoji.slug}_${emojiStyle}` +
      (emoji.skin_tone_support ? `_${selectedEmojiSkinTone}` : "") +
      ".svg";
    card.appendChild(img);
    card.addEventListener("click", (e) => {
      selectedCards = document.querySelectorAll(".faceUp");
      if (selectedCards.length === 0 && !ignoreClicks) {
        flipSelectedCardFaceUp(e.target);
      } else if (
        selectedCards.length === 1 &&
        e.target.id != selectedCards[0].id
      ) {
        flipSelectedCardFaceUp(e.target);
        checkCards();
      }
    });
    fragment.appendChild(card);
  });

  cards.appendChild(fragment);
  previewTimerId = setTimeout(flipCardsFaceDown, selectedCardPreviewTime); // Waits the amount of milliseconds specificed in the cardPreviewInMS variable before flipping the cards face down.
}

function flipCardsFaceDown() {
  // console.log('flipCardsFaceDown');
  const faceUpCards = document.querySelectorAll(".faceUp");
  faceUpCards.forEach((card) => {
    card.classList.replace("faceUp", "faceDown");
  });
  ignoreClicks = false;
  startStopwatch();
}

function startStopwatch() {
  // console.log('startStopwatch')
  stopwatchIntervalId = window.setInterval(stopwatch, 1000);
}

function stopwatch() {
  // console.log('stopwatch');
  seconds++;
  if (seconds / 60 === 1) {
    // Logic to determine when to increment next value
    seconds = 0;
    minutes++;
  }

  // Adds a leading 0 if the seconds/minutes are only one digit.
  displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
  displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  // document.getElementById('stopwatch').innerHTML = `${displayMinutes}:${displaySeconds}`; // Displays updated time to user
}

// GAME FUNCTIONS - RUN AS NEEDED BASED ON USER INTERACTION

function flipSelectedCardFaceUp(card) {
  // console.log('flipSelectedCardFaceUp');
  card.classList.replace("faceDown", "faceUp");
}

function checkCards() {
  // console.log('checkCards');
  selectedCards = document.querySelectorAll(".faceUp");
  if (selectedCards[0].firstChild.src === selectedCards[1].firstChild.src) {
    transitionDelayTimerId = setTimeout(clearMatch, transitionDelayTimeInMS); // Waits before clearing cards.
  } else {
    transitionDelayTimerId = setTimeout(
      flipSelectedCardsFaceDown,
      transitionDelayTimeInMS
    ); // Waits before flipping cards face down.
  }
}

function flipSelectedCardsFaceDown() {
  // console.log('flipSelectedCardsFaceDown');
  for (var i = 0; i < selectedCards.length; i++) {
    selectedCards[i].classList.replace("faceUp", "faceDown");
  }
}

function clearMatch() {
  // console.log('clearMatch');
  for (var i = 0; i < selectedCards.length; i++) {
    selectedCards[i].classList.toggle("faceUp");
    selectedCards[i].classList.add("notVisible");
  }
  hiddenCards = document.querySelectorAll(".notVisible");
  if (hiddenCards.length === cardCount) {
    document.getElementById("cards").style.setProperty("display", "none");
    document.getElementById("endScreen").style.setProperty("display", "block");
    stopStopwatch();
  }
}

function stopStopwatch() {
  // console.log('stopStopwatch')
  window.clearInterval(stopwatchIntervalId);
}

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
}

function clearBoard() {
  // console.log('clearBoard');
  let cards = document.getElementById("cards");
  cards.innerHTML = "";
  cards.removeAttribute("style");
  document.getElementById("endScreen").removeAttribute("style");
}

function resetStopwatch() {
  // console.log('resetStopwatch');
  seconds = 0;
  minutes = 0;
  displaySeconds = 0;
  displayMinutes = 0;
  // document.getElementById('stopwatch').innerHTML = '00:00';
}

window.onkeydown = function (k) {
  // Resets the game when the user presses the space bar
  // console.log('SPACEBAR');
  if (k.keyCode === 32) {
    reset();
  }
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
  console.log(
    "SAVE USER SETTINGS",
    selectedEmojiCategory,
    selectedEmojiSkinTone,
    selectedCardPreviewTime
  );
  localStorage.setItem("selectedEmojiCategory", selectedEmojiCategory);
  localStorage.setItem("selectedEmojiSkinTone", selectedEmojiSkinTone);
  localStorage.setItem("selectedCardPreviewTime", selectedCardPreviewTime);
}

// HELPER FUNCTIONS

function addEventListenerById(id, event, handler) {
  document.getElementById(id).addEventListener(event, handler);
}

function getSelectedValue(id) {
  return document.getElementById(id).selectedOptions[0].value;
}