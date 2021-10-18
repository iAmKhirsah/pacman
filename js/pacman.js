'use strict';
var PACMAN = '<img class="pacman" src="img/pacmanLEFT.png" </img>';
var gPacman;
var gDeadGhosts = [];
var gCherryInterval;
var gNextGhostIdx = null;
function createPacman(board) {
  gPacman = {
    location: {
      i: 3,
      j: 5,
    },
    isSuper: false,
    isSuperFoodDrop: false,
  };
  board[gPacman.location.i][gPacman.location.j] = PACMAN;
}
function movePacman(ev) {
  if (!gGame.isOn) return;
  // console.log('ev', ev);
  // its a cheat as well
  if (gGame.score === 1) {
    gCherryInterval = setInterval(createCherry, 8000);
  }
  //// cheating lads
  var isSuperFood = gPacman.isSuperFoodDrop;
  var nextLocation = getNextLocation(ev);

  if (!nextLocation) return;
  // console.log('nextLocation', nextLocation);

  var nextCell = gBoard[nextLocation.i][nextLocation.j];
  // console.log('NEXT CELL', nextCell);

  if (nextCell === WALL) return;
  if (nextCell === SUPERFOOD) {
    if (!gPacman.isSuper) {
      gPacman.isSuper = true;
      changeGhostColor();
      setTimeout(() => superDone(), 5000);
    } else if (gPacman.isSuper) {
      gPacman.isSuperFoodDrop = true;
    }
  }
  if (nextCell === CHERRY) {
    updateScore(10);
  }
  if (nextCell === FOOD) {
    if (nextLocation.i === 6 && nextLocation.j === 6) gGhostSpawnFood = false;
    updateScore(1);
    gGame.currFood--;
    if (gGame.currFood === 0) victory();
  } else if (gPacman.isSuper && nextCell === GHOST) {
    for (var i = 0; i < gGhosts.length; i++) {
      if (
        nextLocation.i === gGhosts[i].location.i &&
        nextLocation.j === gGhosts[i].location.j
      ) {
        gNextGhostIdx = i;
        if (gGhosts[i].currCellContent === FOOD) {
          if (nextLocation.i === 6 && nextLocation.j === 6)
            gGhostSpawnFood = false;
          gGame.currFood--;
          gGame.score++;
          gGhosts[i].currCellContent === EMPTY;
        }
        var splicedGhost = gGhosts.splice(i, 1)[0];
        // console.log(splicedGhost);
        gDeadGhosts.push(splicedGhost);
      }
    }
  } else if (nextCell === GHOST) {
    gameOver();
    renderCell(gPacman.location, EMPTY);
    return;
  }
  if (gPacman.isSuper && isSuperFood) {
    gBoard[gPacman.location.i][gPacman.location.j] = SUPERFOOD;
    renderCell(gPacman.location, SUPERFOOD);
    gPacman.isSuperFoodDrop = false;
  } else {
    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
    // update the dom
    renderCell(gPacman.location, EMPTY);
  }

  gPacman.location = nextLocation;

  // update the model
  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
  // update the dom
  renderCell(gPacman.location, PACMAN);
}
function getNextLocation(eventKeyboard) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j,
  };
  switch (eventKeyboard.code) {
    case 'ArrowUp':
      PACMAN = '<img class="pacman" src="img/pacmanUP.png" </img>';
      nextLocation.i--;
      break;
    case 'ArrowDown':
      nextLocation.i++;
      PACMAN = '<img class="pacman" src="img/pacmanDOWN.png" </img>';
      break;
    case 'ArrowLeft':
      nextLocation.j--;
      PACMAN = '<img class="pacman" src="img/pacmanLEFT.png" </img>';
      break;
    case 'ArrowRight':
      PACMAN = '<img class="pacman" src="img/pacmanRIGHT.png" </img>';
      nextLocation.j++;
      break;
    default:
      return null;
  }
  return nextLocation;
}

function superDone() {
  while (gDeadGhosts.length) {
    // gGhosts.push(gDeadGhosts.pop());
    createGhostNewGen();
  }
  gPacman.isSuper = false;
  for (var i = 0; i < gGhosts.length; i++) {
    gGhosts[i].color = gGhosts[i].prevColor;
  }
}

function changeGhostColor() {
  for (var i = 0; i < gGhosts.length; i++) {
    gGhosts[i].prevColor = gGhosts[i].color;
    gGhosts[i].color = 'blue';
    getGhostHTML(gGhosts[i]);
  }
}
function victory() {
  var elModal = document.querySelector('.modal');
  var elBtn = document.querySelector('.restart');
  gGame.isOn = false;
  clearInterval(gIntervalGhosts);
  clearInterval(gCherryInterval);
  elModal.style.backgroundColor = 'rgb(142, 99, 155)';
  elModal.style.border = '5px solid rgb(117, 70, 131)';
  elModal.innerHTML = `Oh wow, impressive, you have won the game with a score of: <span class="victory"> ${gGame.score} </span>, what a chad you are`;
  elBtn.innerHTML = 'Play again <span class="champ"> champ?</span>';
  elModal.style.display = 'block';
  elBtn.style.display = 'inline-block';
}
