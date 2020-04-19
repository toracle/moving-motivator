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
  const cardModels = [
    {
      'id': 'curiosity',
      'name': '호기심',
      'content': '나는 탐구하거나 생각할 것이 많다',
      'initial-order': 1,
    },
    {
      'id': 'honor',
      'name': '명예',
      'content': '나는 내가 일하는 방식에, 내 개인적인 가치관이 반영되는 것이 자랑스럽게 느껴진다',
      'initial-order': 2,
    },
    {
      'id': 'acceptance',
      'name': '수용',
      'content': '내 주위에 있는 사람들은 내가 하는 것과 내가 어떤 사람인지를 인정한다',
      'initial-order': 3,
    },
    {
      'id': 'mastery',
      'name': '전문성',
      'content': '내 업무가 내 역량에 도전이 되면서도, 여전히 내 능력 범위 안에 있다',
      'initial-order': 4,
    },
    {
      'id': 'power',
      'name': '파워',
      'content': '내게는 내 주위에서 일어나는 일들에 대해 영향력을 미칠 수 있는 충분한 공간이 있다',
      'initial-order': 5,
    },
    {
      'id': 'freedom',
      'name': '자유',
      'content': '나는 내 일과 책임에서 다른 사람과 독립되어 있다',
      'initial-order': 6,
    },
    {
      'id': 'relatedness',
      'name': '연결됨',
      'content': '나는 내 업무에서 사람들과 좋은 사회적 관계를 이루고 있다',
      'initial-order': 7,
    },
    {
      'id': 'order',
      'name': '질서',
      'content': '안정된 환경을 위해서 충분한 규칙과 정책이 존재한다',
      'initial-order': 8,
    },
    {
      'id': 'goal',
      'name': '목표',
      'content': '내 삶의 목적이 내가 하는 일에 잘 반영되어 있다',
      'initial-order': 9,
    },
    {
      'id': 'status',
      'name': '지위',
      'content': '내 포지션은 괜찮다. 그리고 함께 일하는 사람들도 그걸 인정한다',
      'initial-order': 10,
    },
  ];

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
