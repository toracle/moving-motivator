const keyboardMapping = {
  37: "left",
  39: "right",
  38: "up",
  40: "down",
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

  if (activeElement.className != "card") {
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

function focusNextCard(direction = 1) {
  const nextCard = getNextCard(direction);
  if (!nextCard) {
    return;
  }
  nextCard.focus();
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

function keyboardHandler(event) {
  var action = mapKey(event);

  if (action === undefined) {
    return;
  }

  const direction = actionToDirection(action);
  if (!direction) {
    return;
  }

  const actionToFunction = {
    "right": focusNextCard,
    "left": focusNextCard,
    "shift-right": shiftCard,
    "shift-left": shiftCard,
  }

  const fn = actionToFunction[action];
  if (!fn) {
    return;
  }
  fn(direction);
}

function initCard() {
  const cardModels = [
    {
      'id': 'curiosity',
      'name': '호기심',
    },
    {
      'id': 'honor',
      'name': '명예',
    },
    {
      'id': 'acceptance',
      'name': '수용',
    },
    {
      'id': 'mastery',
      'name': '전문성',
    },
    {
      'id': 'power',
      'name': '파워',
    },
    {
      'id': 'freedom',
      'name': '자유',
    },
    {
      'id': 'relatedness',
      'name': '연결됨',
    },
    {
      'id': 'order',
      'name': '질서',
    },
    {
      'id': 'goal',
      'name': '목표',
    },
    {
      'id': 'status',
      'name': '지위',
    },
  ];

  const cardHolder = getCardHolder();
  cardModels.forEach(function(item) {
    // cardHolder.
    const card = document.createElement("div");
    card.setAttribute("class", "card");
    card.setAttribute("draggable", true);
    card.setAttribute("tabindex", 0);
    card.setAttribute("id", 'card-' + item['id']);
    card.textContent = item['name'];

    cardHolder.appendChild(card);
  });
}
