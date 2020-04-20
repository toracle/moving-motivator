const keyboardMapping = {
  37: "left",
  39: "right",
  38: "up",
  40: "down",
  13: "enter",
};

const keyboardCtrlMapping = {
  37: "shift-left",
  39: "shift-right",
}

function mapKey(event) {
  const ctrlPressed = event.ctrlKey;

  if (ctrlPressed) {
    return keyboardCtrlMapping[event.keyCode];
  }
  return keyboardMapping[event.keyCode];
}

function getCardHolder() {
  return document.getElementById("card-holder");
}


function getCards() {
  const cards = document.querySelectorAll(".card");
  return cards;
}

function getActiveCard() {
  const activeElement = document.activeElement;

  if (!activeElement.classList.contains("card")) {
    return null;
  }
  return activeElement;
}

function getNextCard(direction = 1, card) {
  const cards = getCards();
  const activeCard = card || getActiveCard();

  if (activeCard == null) {
    return cards[0];
  }

  var index = null;

  for (var i = 0; i < cards.length; i++) {
    if (cards[i].id == activeCard.id) {
      index = i;
      break;
    }
  }

  if (index == cards.length - 1 && direction == 1) {
    return null;
  }
  if (index == 0 && direction == -1) {
    return null;
  }
  return cards[index + direction];
}

function setContent(text) {
  const descBox = document.getElementById('card-description');
  descBox.textContent = text;
}

function focusNextCard(direction = 1) {
  const nextCard = getNextCard(direction);
  if (!nextCard) {
    return;
  }
  nextCard.focus();
  setContent(nextCard.getAttribute('name') + ': ' + nextCard.getAttribute('content'));
}

function actionToDirection(action) {
  const actionToDirectionMap = {
    "left": -1,
    "right": 1,
    "shift-left": -1,
    "shift-right": 1,
  }
  return actionToDirectionMap[action];
}

function shiftCard(direction) {
  const cardHolder = getCardHolder();
  const activeCard = getActiveCard();
  const nextCard = getNextCard(direction);

  if (!nextCard) {
    return;
  }

  if (direction > 0) {
    cardHolder.insertBefore(nextCard, activeCard);
    return;
  }

  if (direction < 0) {
    const prevCard = getNextCard(direction * -1, nextCard);
    cardHolder.insertBefore(prevCard, nextCard);
    activeCard.focus();
    return;
  }
}

function setLevel(card, level) {
  card.classList.remove("level-veryhigh",
                        "level-high",
                        "level-normal",
                        "level-low",
                        "level-verylow");
  card.classList.add("level-" + level);
  card.setAttribute("level", level);
}

function getLevel(card) {
  for (var i = 0; i < card.classList.length; i++) {
    const className = card.classList[i];
    if (className.startsWith("level-")) {
      return className.slice(6);
    }
  }
  return null;
}

const cardLevel = [
  "veryhigh",
  "high",
  "normal",
  "low",
  "verylow"
];

function getLowerLevel(level) {
  const index = cardLevel.indexOf(level);
  if (index + 2 > cardLevel.length) {
    return cardLevel[index];
  }
  return cardLevel[index + 1];
}

function getHigherLevel(level) {
  const index = cardLevel.indexOf(level);
  if (index - 1 < 0) {
    return cardLevel[index];
  }
  return cardLevel[index - 1];
}

function increaseLevel(card) {
  const activeCard = card || getActiveCard();
  if (!activeCard) {
    return;
  }

  const level = getLevel(activeCard);
  const nextLevel = getHigherLevel(level);
  setLevel(activeCard, nextLevel);
}

function decreaseLevel(card) {
  const activeCard = card || getActiveCard();
  if (!activeCard) {
    return;
  }

  const level = getLevel(activeCard);
  const nextLevel = getLowerLevel(level);
  setLevel(activeCard, nextLevel);
}

function keyboardHandler(event) {
  var action = mapKey(event);

  if (action === undefined) {
    return;
  }

  const actionToFunction = {
    "right": focusNextCard,
    "left": focusNextCard,
    "shift-right": shiftCard,
    "shift-left": shiftCard,
    "up": increaseLevel,
    "down": decreaseLevel,
    "enter": submit,
  }

  const fn = actionToFunction[action];
  if (!fn) {
    return;
  }

  const direction = actionToDirection(action);
  fn(direction);
}

function gather() {
  const cards = getCards();

  const results = new Array();
  cards.forEach(function(item, idx) {
    item.setAttribute('final-order', idx + 1);
    results.push({
      'id': item.getAttribute('uid'),
      'initial-order': parseInt(item.getAttribute('initial-order')),
      'final-order': parseInt(item.getAttribute('final-order')),
      'level': item.getAttribute('level'),
    });
  });
  return results;
}

function submit() {
  const result = gather();
  console.table(result);
  setFlash('결과를 제출했습니다.');
}

function setFlash(text, timeout = 3000) {
  const flashElement = document.getElementById('flash');
  flashElement.textContent = text;

  setTimeout(function() {
    const flashElement = document.getElementById('flash');
    flashElement.textContent = '';
  }, timeout);
}

function initCard() {
  const cardHolder = getCardHolder();
  cardModels.forEach(function(item) {
    // cardHolder.
    const card = document.createElement("div");
    card.setAttribute("class", "card level-normal");
    card.setAttribute("draggable", true);
    card.setAttribute("tabindex", 0);
    card.setAttribute("id", 'card-' + item['id']);
    card.setAttribute("uid", item['id']);
    card.setAttribute("name", item['name']);
    card.setAttribute("content", item['content']);
    card.setAttribute("level", "normal");
    card.setAttribute("initial-order", item['initial-order']);
    card.setAttribute("final-order", item['initial-order']);
    card.textContent = item['name'];

    cardHolder.appendChild(card);
  });
}
