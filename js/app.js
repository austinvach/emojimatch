const transitionDelayTimeInMS = 400;
// Variables to hold timeout and interval ids
let previewTimerId;
let stopwatchIntervalId;
let countdownIntervalId;
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
let selectedCardCount;
let selectedCardPreviewTime;
// Other variables
let selectedCards = [];
let ignoreClicks = true;
let emojiStyle = "flat";
let cardsObserver = new ResizeObserver(debounce(adjustCardSize, 500));

// Event listener to call setBodyHeight when the window is resized
window.addEventListener("resize", debounce(setBodyHeight, 100));

// Helper function to add event listeners.
function addEventListenerById(id, event, handler) {
  document.getElementById(id).addEventListener(event, handler);
}

// Updates the value of the primary emoji category dropdown and resets the game when the secondary emoji category dropdown changes.
addEventListenerById("secondaryEmojiCategoryDropdown", "change", (e) => {
  primaryEmojiCategoryDropdown.value = secondaryEmojiCategoryDropdown.value;
  reset();
});

// Updates the value of the secondary emoji category dropdown and resets the game when the primary emoji category dropdown changes.
addEventListenerById("primaryEmojiCategoryDropdown", "change", (e) => {
  secondaryEmojiCategoryDropdown.value = primaryEmojiCategoryDropdown.value;
  reset();
});

// Calls the reset function when the reset button is clicked. 
addEventListenerById("bannerReset", "click", reset);
// Calls the reset function when the reset button is clicked. 
addEventListenerById("endScreenReset", "click", reset);
// Calls the reset function when a new emoji skin tone is selected.
addEventListenerById("emojiSkinToneDropdown", "change", reset);
// Calls the reset function when a new card preview time is selected.
addEventListenerById("cardCountDropdown", "change", reset);
// Calls the reset function when a new card preview time is selected.
addEventListenerById("cardPreviewTimeDropdown", "change", reset);

// Calls the onLoad function when the document is fully loaded.
document.addEventListener("DOMContentLoaded", (e) => {
  onLoad();
});

///////////////////////////////////////////
// SETUP FUNCTIONS - ONLY RUN WHEN THE PAGE IS LOADED/RELOADED
///////////////////////////////////////////

// This function is called when the page loads.
async function onLoad() {
  // Fetches the emoji JSON file.
  const response = await fetch("emoji.json");
  // Parses the JSON response and stores it in the emoji variable.
  emoji = await response.json();
  // Checks if there are any user preferences saved in local storage.
  checkLocalStorage();
  // Populates the emoji category dropdowns.
  populateCategories();
  // Populates the emoji skin tone dropdown.
  populateSkinTones();
  // Populates the card count dropdown.
  populateCardCounts();
  // Populates the card preview time dropdown.
  populateCardPreviewTimes();
  // Picks the emoji pairs for the game.
  pickPairs();
  // Sets the height of the body element.
  setBodyHeight();
  // Sets the initial state of the cards face up.
  setCardsFaceUp();
  // Starts observing the card elements for size changes.
  cardsObserver.observe(cards);
  // Starts the countdown timer.
  startCountdown();
}

// Helper function to check if the specified type of web storage is available.
function storageAvailable(type) {
  let storage;
  try {
    // Try to use the storage.
    storage = window[type];
    const x = "STORAGE_TEST";
    // Try to set an item.
    storage.setItem(x, x);
    // Try to remove the item.
    storage.removeItem(x);
    // If all the above operations are successful, then the storage is available.
    return true;
  } catch (e) {
    // If any of the operations fail, then the storage might not be available.
    // The function checks for specific error codes and names that indicate quota exceeded errors.
    // It also checks if there's already something in the storage.
    return (
      e instanceof DOMException &&
      (e.code === 22 ||
        e.code === 1014 ||
        e.name === "QuotaExceededError" ||
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      storage &&
      storage.length !== 0
    );
  }
}

// This function checks if local storage is available and retrieves any saved user preferences.
function checkLocalStorage() {
  // Checks if local storage is available.
  if (// This function checks if a specific type of web storage is available.
function storageAvailable(type) {
  try {
    // Define a test string.
    const x = "__storage_test__";
    // Try to use the storage.
    window[type].setItem(x, x);
    // Try to remove the test item from the storage.
    window[type].removeItem(x);
    // If both operations are successful, then the storage is available.
    return true;
  } catch (e) {
    // If any of the operations fail, then the storage might not be available.
    // The function checks for specific error codes and names that indicate quota exceeded errors.
    // It also checks if there's already something in the storage.
    return (
      e instanceof DOMException &&
      (e.code === 22 ||
        e.code === 1014 ||
        e.name === "QuotaExceededError" ||
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      window[type] &&
      window[type].length !== 0
    );
  }
}("localStorage")) {
    // Retrieves the user's selected emoji category, skin tone, and card preview time from local storage.
    selectedEmojiCategory = localStorage.getItem("selectedEmojiCategory");
    selectedEmojiSkinTone = localStorage.getItem("selectedEmojiSkinTone");
    selectedCardPreviewTime = localStorage.getItem("selectedCardPreviewTime") || "8000";
    selectedCardCount = localStorage.getItem("selectedCardCount") || 32;
  } else {
    // Logs a message to the console if local storage is not available.
    console.log("LOCAL STORAGE NOT AVAILABLE");
  }
}

// Helper function to create emoji category options and append them to a dropdown.
function createAndAppendEmojiCategoryOptions(dropdown, categories) {
  const options = categories.map((category) => {
    const displayName = `${category.icon} ${category.name}`;
    const isSelected = selectedEmojiCategory === category.value;
    return new Option(displayName, category.value, false, isSelected);
  });
  dropdown.append(...options);
}

// This function populates the emoji category dropdowns with options.
function populateCategories() {
  // Gets the emoji category dropdown elements.
  const secondaryEmojiCategoryDropdown = document.getElementById("secondaryEmojiCategoryDropdown");
  const primaryEmojiCategoryDropdown = document.getElementById("primaryEmojiCategoryDropdown");
  // Defines the emoji categories.
  const emojiCategories = [
    { icon: "🙂", name: "Smileys & Emotion", value: "smileys_and_emotion" },
    { icon: "🧙‍♂️", name: "People & Body", value: "people_and_body" },
    { icon: "🕸️", name: "Animals & Nature", value: "animals_and_nature" },
    { icon: "🍪", name: "Food & Drink", value: "food_and_drink" },
    { icon: "🌎", name: "Travel & Places", value: "travel_and_places" },
    { icon: "⚽", name: "Activities", value: "activities" },
    { icon: "🧮", name: "Objects", value: "objects" },
    { icon: "⛔", name: "Symbols & Flags", value: "symbols_and_flags" }
  ];

  // Creates and appends the emoji category options to both dropdowns.
  createAndAppendEmojiCategoryOptions(primaryEmojiCategoryDropdown, emojiCategories);
  createAndAppendEmojiCategoryOptions(secondaryEmojiCategoryDropdown, emojiCategories);
}

// This function populates the emoji skin tone dropdown with options.
function populateSkinTones() {
  // Gets the emoji skin tone dropdown element.
  const emojiSkinToneDropdown = document.getElementById("emojiSkinToneDropdown");
  // Defines the emoji skin tones.
  const emojiSkinTones = [
    { icon: "✌️", name: "Default", value: "default" },
    { icon: "✌🏻", name: "Light", value: "light" },
    { icon: "✌🏼", name: "Medium-Light", value: "medium_light" },
    { icon: "✌🏽", name: "Medium", value: "medium" },
    { icon: "✌🏾", name: "Medium-Dark", value: "medium_dark" },
    { icon: "✌🏿", name: "Dark", value: "dark" }
  ];
  // Creates the dropdown options for each skin tone.
  const options = emojiSkinTones.map((emojiSkinTone) => {
    const displayName = `${emojiSkinTone.icon} ${emojiSkinTone.name}`;
    const isSelected = selectedEmojiSkinTone === emojiSkinTone.value;
    return new Option(displayName, emojiSkinTone.value, false, isSelected);
  });
  // Appends the options to the dropdown.
  emojiSkinToneDropdown.append(...options);
}

// This function populates the card preview time dropdown with options.
function populateCardPreviewTimes() {
  // Gets the card preview time dropdown element.
  const cardPreviewTimeDropdown = document.getElementById("cardPreviewTimeDropdown");
  // Defines the card preview times.
  const cardPreviewTimes = [
    { name: "4 Seconds", value: "4000" },
    { name: "8 Seconds", value: "8000" },
    { name: "16 Seconds", value: "16000" },
  ];
  // Creates the dropdown options for each card preview time.
  const options = cardPreviewTimes.map((cardPreviewTime) => {
    // Checks if the current card preview time is the selected one.
    const isSelected = selectedCardPreviewTime === cardPreviewTime.value;
    // Creates a new option element for the dropdown.
    return new Option(
      cardPreviewTime.name,
      cardPreviewTime.value,
      false,
      isSelected
    );
  });
  // Appends the options to the dropdown.
  cardPreviewTimeDropdown.append(...options);
}

// This function populates the card preview time dropdown with options.
function populateCardCounts() {
  // Gets the card preview time dropdown element.
  const cardCountDropdown = document.getElementById("cardCountDropdown");
  // Defines the card preview times.
  const cardCounts = [
    { name: "16", value: 16 },
    { name: "32", value: 32 },
    { name: "48", value: 48 },
  ];
  // Creates the dropdown options for each card preview time.
  const options = cardCounts.map((cardCount) => {
    // Checks if the current card preview time is the selected one.
    const isSelected = selectedCardCount === cardCount.value;
    // Creates a new option element for the dropdown.
    return new Option(
      cardCount.name,
      cardCount.value,
      false,
      isSelected
    );
  });
  // Appends the options to the dropdown.
  cardCountDropdown.append(...options);
}

///////////////////////////////////////////
// CARD PREP FUNCTIONS - RUN ON PAGE LOAD/RELOAD AND WHENEVER THE USER CLICKS THE RESET BUTTON
///////////////////////////////////////////

// Helper function to get the selected value from a dropdown.
function getSelectedValue(id) {
  return document.getElementById(id).selectedOptions[0].value;
}

// This function picks the pairs of emojis for the game.
function pickPairs() {
  // Gets the selected values from the dropdowns.
  selectedEmojiCategory = getSelectedValue("primaryEmojiCategoryDropdown");
  selectedEmojiSkinTone = getSelectedValue("emojiSkinToneDropdown");
  selectedCardPreviewTime = getSelectedValue("cardPreviewTimeDropdown");
  selectedCardCount = getSelectedValue("cardCountDropdown");
  // Gets the emoji from the selected category.
  let selectedEmoji = emoji[primaryEmojiCategoryDropdown.selectedIndex].emojis;
  // Randomizes the array.
  selectedEmoji.sort(() => Math.random() - 0.5);
  // Picks half the number of cards requested in cardCount variable.
  pairs = selectedEmoji.slice(0, selectedCardCount / 2);
  // Duplicates each value in the array so that each emoji has a match.
  pairs = [...pairs, ...pairs];
  // Randomize the pairs.
  pairs.sort(() => Math.random() - 0.5); // Randomizes the pairs
}

// This function sets the initial state of the cards to face up.
function setCardsFaceUp() {
  // Gets the cards container.
  const cards = document.getElementById("cards");
  // Creates a document fragment to store all the cards.for performance.
  const fragment = document.createDocumentFragment();
  // Creates a card element with an image and adds it to the document fragment.
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
    // Adds a click event listener to the card.
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
    // Appends the card to the document fragment.
    fragment.appendChild(card);
  });
  // Appends the document fragment to the cards container.
  cards.appendChild(fragment);
  adjustCardSize();
}

// This function flips all cards that are face up, face down.
function flipCardsFaceDown() {
  // Selects all cards that are currently face up.
  const faceUpCards = document.querySelectorAll(".faceUp");
  // Replaces the "faceUp" class with "faceDown".
  faceUpCards.forEach((card) => {
    card.classList.replace("faceUp", "faceDown");
  });
  // Allows clicks on the cards again.
  ignoreClicks = false;
  // Starts the stopwatch.
  startStopwatch();
}

// This function starts the stopwatch.
function startStopwatch() {
  // Sets an interval to call the stopwatch function every 1000 milliseconds (1 second).
  stopwatchIntervalId = window.setInterval(stopwatch, 1000);
}

// This function acts as a stopwatch, incrementing the seconds and minutes.
function stopwatch() {
  // Increments the seconds variable by 1.
  seconds++;
  // Resets seconds to 0 and increment minutes variable by 1 when seconds reach 60.
  if (seconds / 60 === 1) {
    seconds = 0;
    minutes++;
  }
  // Adds a leading 0 to seconds if it is less than 10.
  displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
  // Adds a leading 0 to minutes if it is less than 10.
  displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  // Updates the 'clock' element with the new time.
  document.getElementById('clock').innerHTML = `${displayMinutes}:${displaySeconds}`;
}

// GAME FUNCTIONS - RUN AS NEEDED BASED ON USER INTERACTION

// This function flips a selected card from face down to face up.
function flipSelectedCardFaceUp(card) {
  card.classList.replace("faceDown", "faceUp");
}

// This function checks if the two selected cards match.
function checkCards() {
  // Gets all the cards that are currently face up.
  selectedCards = document.querySelectorAll(".faceUp");
  // Checks if the cards are a match and either clears them or flips them back over after a delay.
  if (selectedCards[0].firstChild.src === selectedCards[1].firstChild.src) {
    transitionDelayTimerId = setTimeout(clearMatch, transitionDelayTimeInMS);
  } else {
    transitionDelayTimerId = setTimeout(
      flipSelectedCardsFaceDown,
      transitionDelayTimeInMS
    );
  }
}

// This function flips the selected cards from face up to face down.
function flipSelectedCardsFaceDown() {
  for (var i = 0; i < selectedCards.length; i++) {
    selectedCards[i].classList.replace("faceUp", "faceDown");
  }
}

// This function clears a match by making the matched cards not visible.
function clearMatch() {
  for (var i = 0; i < selectedCards.length; i++) {
    selectedCards[i].classList.toggle("faceUp");
    selectedCards[i].classList.add("notVisible");
  }
  // Hides the cards and shows the end screen if all the cards are not visible (i.e. all matches have been found).
  hiddenCards = document.querySelectorAll(".notVisible");
  if (hiddenCards.length === Number(selectedCardCount)) {
    document.getElementById("cards").style.setProperty("display", "none");
    document.getElementById("endScreen").style.setProperty("display", "block");
    stopStopwatch();
  }
}

// This function stops the stopwatch by clearing the interval.
function stopStopwatch() {
  window.clearInterval(stopwatchIntervalId);
}

// This function resets the game state.
function reset() {
  // Ignores any clicks while resetting.
  ignoreClicks = true;
  // Clears any existing timers and intervals.
  clearTimeout(previewTimerId);
  clearTimeout(transitionDelayTimerId);
  clearInterval(countdownIntervalId);
  clearInterval(stopwatchIntervalId);
  // Resets the stopwatch and clears the game board.
  resetStopwatch();
  clearBoard();
  // Hides the end screen and show the cards container.
  document.getElementById("cards").style.setProperty("display", "flex");
  document.getElementById("endScreen").style.setProperty("display", "none");
  // Picks new cards.
  pickPairs();
  // Sets them face up.
  setCardsFaceUp();
  // Saves the user's settings and starts the countdown.
  saveUserSettings();
  startCountdown();
}

// This function clears the game board.
function clearBoard() {
  // Gets the cards container.
  let cards = document.getElementById("cards");
  // Clears the content.
  cards.innerHTML = "";
}

// This function resets the stopwatch.
function resetStopwatch() {
  // Resets the seconds, minutes, displaySeconds, and displayMinutes values.
  seconds = 0;
  minutes = 0;
  displaySeconds = 0;
  displayMinutes = 0;
}

// This function listens for keydown events.
window.onkeydown = function (k) {
  // Reset the game if the user presses the space bar, which has a key code of 32.
  if (k.keyCode === 32) {
    reset();
  }
};

// This function saves the user's settings to local storage.
function saveUserSettings() {
  // Save the selected emoji category, skin tone, and card preview time to local storage.
  localStorage.setItem("selectedEmojiCategory", selectedEmojiCategory);
  localStorage.setItem("selectedEmojiSkinTone", selectedEmojiSkinTone);
  localStorage.setItem("selectedCardPreviewTime", selectedCardPreviewTime);
  localStorage.setItem("selectedCardCount", selectedCardCount);
}

// HELPER FUNCTIONS

// Helper function to format the countdown text.
function formatCountdownText(countdown) {
  // Adds a leading zero to the countdown variable if it is less than 10.
  return `Game Begins in 00:${countdown < 10 ? "0" : ""}${countdown}`;
}

// This function starts a countdown.
function startCountdown() {
  // Gets the countdown time from the selected card preview time and convert it to seconds.
  let countdown = (selectedCardPreviewTime / 1000);
  // Gets the countdown display element.
  let countdownDisplay = document.getElementById('clock');
  // Sets the initial countdown text.
  countdownDisplay.textContent = formatCountdownText(countdown);
  // Starts the countdown interval.
  countdownIntervalId = setInterval(function() {
    // Decrements the countdown by 1.
    countdown--;
    // Updates the countdown text.
    countdownDisplay.textContent = formatCountdownText(countdown);
    // If the countdown has reached 0, stops the interval, sets the countdown text to "00:00", and flips the cards face down.
    if (countdown <= 0) {
      clearInterval(countdownIntervalId);
      countdownDisplay.textContent = "00:00";
      flipCardsFaceDown();
    }
  }, 1000); // The interval is set to run every 1000 milliseconds (or 1 second).
}

// This function sets the height of the body element. Needed for mobile browsers to prevent the address bar from pushing content below the fold.
function setBodyHeight() {
  // Gets the body element.
  var body = document.body;
  // Set the height of the body to the inner height of the window.
  body.style.height = window.innerHeight + 'px';
}

// This function adjusts the size of the cards to fit within their parent container.
function adjustCardSize() {
  // Get the main, cards, and style elements
  var main = document.getElementById('main');
  var cards = document.getElementById('cards');
  var style = document.getElementById('myStyle');

  // Get the computed styles of main and cards
  var mainStyle = getComputedStyle(main);
  var cardStyle = getComputedStyle(cards);

  // Get the top and bottom padding of main
  var mainPaddingTop = parseFloat(mainStyle.getPropertyValue('padding-top'));
  var mainPaddingBottom = parseFloat(mainStyle.getPropertyValue('padding-bottom'));

  // Get the gap between cards
  var gap = parseFloat(cardStyle.getPropertyValue('gap'));

  // Calculate the total height occupied by the firstBanner, secondBanner, and footer
  var occupiedHeight = ['firstBanner', 'secondBanner', 'footer'].reduce((total, id) => {
    return total + document.getElementById(id).offsetHeight;
  }, mainPaddingTop + mainPaddingBottom);

  // Calculate the available height by subtracting the occupied height from the window height
  var availableHeight = window.innerHeight - occupiedHeight;

  // Get the number of card items
  var cardItemsCount = cards.childElementCount;

  // Get the width and height of the cards container
  var parentWidth = cards.offsetWidth;
  var parentHeight = Math.min(cards.offsetHeight, availableHeight);

  // Initialize low and high for binary search
  var low = 0; 
  var high = Math.min(parentWidth, parentHeight);

  // Binary search to find the maximum size of the cards that will fit in the container
  while (high - low > 1) {
    var mid = (low + high) / 2;
    var columns = Math.floor(parentWidth / (mid + gap));
    var rows = Math.floor(parentHeight / (mid + gap));

    // If the number of cards that can fit in the container is greater than or equal to the actual number of cards, increase low
    if (columns * rows >= cardItemsCount) {
      low = mid;
    } else {
      // Otherwise, decrease high
      high = mid;
    }
  }

  // Set the width and height of the cards to the calculated size
  style.innerHTML = `
    #cards div {
      width: ${low}px;
      height: ${low}px;
    }
  `;
}

// This function debounces a function.
function debounce(func, delay) {
  let debounceTimeout;
  return function(...args) {
    const context = this;
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => func.apply(context, args), delay);
  };
}

// This function prints a message to an onscreen overlay. Used for debugging on devices without a console.
// function printToOverlay(message) {
//   // Get the current date and time
//   let now = new Date();
//   // Convert to Pacific Time
//   let pacificTime = now.toLocaleString("en-US", {timeZone: "America/Los_Angeles"});
//   // Prepend the timestamp to the message
//   const overlayContent = document.getElementById('overlay-content');
//   overlayContent.textContent += `[${pacificTime}] ${message}\n`;
//   // PREPEND the message to the overlay content
//   // overlayContent.textContent = `[${pacificTime}] ${message}\n` + overlayContent.textContent;
// }