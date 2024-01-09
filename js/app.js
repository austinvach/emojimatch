var tileCount = 32
//Delays
// var tilePreviewInMS = 8000;
// var flipDelayInMS = 400;
//Variables to hold time values
// let seconds = 0
// let minutes = 0
//Variables to hold "display" value
// let displaySeconds = 0;
// let displayMinutes = 0;
//Variables to hold emojis
let emojis = [];
let pairs = [];
//Other variables
// let stopwatchIntervalId = 0;
// let ignoreClicks = true;
// let selectedCards = [];

// document.addEventListener("click", changeSVGOnClick);
document.addEventListener("DOMContentLoaded", e => {
    console.log("DOMContentLoaded");
    onLoad();
});

function onLoad() {
    console.log('onLoad');
    fetch('data-by-group.json')             // Makes an HTTP/HTTPS GET request
        .then(response => response.json())  // Parses the body as a JSON object 
        .then(json => prepareGame(json))    // Passes the JSON to the prepareGame() function
}

function prepareGame(json) {
    console.log('prepareGame');
    emojis = json;                          // Save the emoji JSON to the emojis variable
    populateOptions();                      // Populates the dropdown with the emoji categories
    pickPairs();
    setCards();
};

function populateOptions() {
    console.log('populateOptions');
    let value = 0;
    emojis.forEach(group => {
        const section = document.querySelector("select");
        const newOption = new Option(group.name, value);
        section.add(newOption);
        value++;
    });
};

function pickPairs() {
    console.log('pickPairs');
    const categoryDropdown = document.querySelector("select");
    let selectedEmoji = emojis[categoryDropdown.selectedIndex].emojis;
    //Randomize the array
    //selectedEmoji.sort(() => Math.random() - 0.5);
    //Pick the first 16 items (the normal game has 24 pairs)
    //pairs = selectedEmoji.slice(0, (tileCount / 2));
    //Duplicate values so there are now 16 pairs
    //pairs = pairs.concat(pairs)
    //Randomize the pairs
    //pairs.sort(() => Math.random() - 0.5);
    pairs = selectedEmoji;
};

function setCards() {
    console.log('setCards');
    //Sets cards face up.
    //We generate the cards
    pairs.forEach((item, index) => {
        // console.log(item.emoji, index)
        const section = document.querySelector(".grid");
        const card = document.createElement("div");
        card.classList = "card";
        card.setAttribute("description", item.name);
        card.setAttribute("id", index);
        card.innerHTML = `<img src="media/emoji/${item.slug}_flat.svg" alt="${item.name} emoji">`;
        section.appendChild(card);
        //   const face = document.createElement("div");
        //   face.classList = "face";
        //   face.innerHTML = item.emoji;
        //   const back = document.createElement("div");
        //   back.classList = "back";
        //   section.appendChild(card);
        //   card.appendChild(face);
        //   card.appendChild(back);
        //   card.addEventListener("click", e => {
        //     console.log('Click');
        //     if(ignoreClicks === false){
        //       console.log('Ignore Click False');
        //       selectedCards = document.querySelectorAll('.selected')
        //       console.log(selectedCards.length)
        //       if(selectedCards.length === 0){
        //         card.classList.toggle("faceDown");
        //       }
        //       else if (selectedCards.length === 1 && card.id != selectedCards[0].parentNode.id) {
        //         card.classList.toggle("faceDown");
        //       }
        //       checkCards(e);
        //     }
        //   });
    });
    //Waits 8 seconds before flipping cards face down.
    //We should do an await instead
    setTimeout(flipCards, tilePreviewInMS);
};

function reset() {
    console.log('reset');
    // resetStopwatch();
    clearBoard();
    pickPairs();
    setCards();
};

function clearBoard() {
    console.log('clearBoard');
    const section = document.querySelector(".grid");
    section.innerHTML = '';
};

window.onkeydown = function (k) {
    if (k.keyCode === 32) {
        reset();
    };
};