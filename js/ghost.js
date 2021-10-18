'use strict';
const GHOST = '&#78564;';

var gGhosts = [];
var gIntervalGhosts;

function createGhostNewGen() {
  while (gDeadGhosts.length) {
    gGhosts.push(gDeadGhosts.pop());
    gGhosts[gGhosts.length - 1].location.i = 6;
    gGhosts[gGhosts.length - 1].location.j = 6;
    if (gGhostSpawnFood) {
      gGhosts[gGhosts.length - 1].currCellContent = FOOD;
    } else gGhosts[gGhosts.length - 1].currCellContent = EMPTY;
  }
  for (var i = 0; i < gGhosts.length; i++) {
    gGhosts[i].color = gGhosts[i].prevColor;
  }
}

function createGhost(board) {
  var randomColor = getRandomColor();
  var ghost = {
    location: {
      i: 6,
      j: 6,
    },
    currCellContent: FOOD,
    color: randomColor,
  };

  gGhosts.push(ghost);
  board[ghost.location.i][ghost.location.j] = GHOST;
}

function createGhosts(board) {
  gGhosts = [];
  createGhost(board);
  createGhost(board);
  createGhost(board);
  gIntervalGhosts = setInterval(moveGhosts, 1000);
}

function moveGhosts() {
  for (var i = 0; i < gGhosts.length; i++) {
    var ghost = gGhosts[i];
    if (gPacman.isSuper && i === gNextGhostIdx) {
    }
    moveGhost(ghost);
  }
}
function moveGhost(ghost) {
  var moveDiff = getMoveDiff();
  var nextLocation = {
    i: ghost.location.i + moveDiff.i,
    j: ghost.location.j + moveDiff.j,
  };
  var nextCell = gBoard[nextLocation.i][nextLocation.j];
  if (nextCell === WALL) return;
  if (nextCell === GHOST) return;
  if (nextCell === PACMAN && gPacman.isSuper) return;
  if (nextCell === PACMAN && !gPacman.isSuper) {
    gameOver();
    return;
  }

  // model
  gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
  // dom
  renderCell(ghost.location, ghost.currCellContent);

  // model
  ghost.location = nextLocation;
  ghost.currCellContent = gBoard[ghost.location.i][ghost.location.j];
  gBoard[ghost.location.i][ghost.location.j] = GHOST;
  // dom
  renderCell(ghost.location, getGhostHTML(ghost));
}

function getMoveDiff() {
  var randNum = getRandomIntInt(0, 100);
  if (randNum < 25) {
    return { i: 0, j: 1 };
  } else if (randNum < 50) {
    return { i: -1, j: 0 };
  } else if (randNum < 75) {
    return { i: 0, j: -1 };
  } else {
    return { i: 1, j: 0 };
  }
}
function getGhostHTML(ghost) {
  return `<span style="color:${ghost.color}">${GHOST}</span>`;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
