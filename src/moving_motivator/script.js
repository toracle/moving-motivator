function mapKey(keyCode) {
  const mapping = {
    37: "left",
    39: "right",
    38: "up",
    40: "down",
  };

  return mapping[keyCode];
}

function focusNextCard(direction = 1) {
  const cards = document.querySelectorAll(".card");
  const activeElement = document.activeElement;

  if (activeElement.className != "card") {
    cards[0].focus();
    return;
  }

  const nextCard = getNextCard(cards, activeElement, direction);
  nextCard.focus();
}

function getNextCard(cards, activeCard, direction = 1) {
  var index = null;

  for (var i = 0; i < cards.length; i++) {
    if (cards[i].id == activeCard.id) {
      index = i;
      break;
    }
  }

  if (index == cards.length - 1 && direction == 1) {
    return cards[0];
  }
  if (index == 0 && direction == -1) {
    return cards[cards.length-1];
  }
  return cards[index + direction];
}

function actionToDirection(action) {
  const actionToDirectionMap = {
    "left": -1,
    "right": 1,
  }
  return actionToDirectionMap[action];
}
