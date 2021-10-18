'use strict';
const WALL = '🟪';
const FOOD = '.';
const EMPTY = ' ';
const SUPERFOOD = '🥦';
const CHERRY = '🍒';
var gBoard;
var gGame = {
  score: 0,
  currFood: 111,
  isOn: false,
};
var gGhostSpawnFood = true;
function init() {
  var elModal = document.querySelector('.modal');
  var elBtn = document.querySelector('.restart');
  elBtn.style.display = 'none';
  elModal.style.display = 'none';
  gGame.currFood = 111;
  updateScore(-gGame.score);
  gBoard = buildBoard();
  createPacman(gBoard);
  createGhosts(gBoard);
  printMat(gBoard, '.board-container');
  gGame.isOn = true;
}

function buildBoard() {
  var SIZE = 13;
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board.push([]);
    for (var j = 0; j < SIZE; j++) {
      board[i][j] = FOOD;
      // if (i < 7 && i > 4 && j < 8 && j > 4) {
      // board[i][j] = EMPTY;
      // }

      if (
        i === 0 ||
        i === SIZE - 1 ||
        j === 0 ||
        j === SIZE - 1 ||
        (i === 7 && j > 3 && j < 9)
      ) {
        board[i][j] = WALL;
      }
      if (
        (i === 1 && j === 1) ||
        (i === 1 && j === SIZE - 2) ||
        (i === SIZE - 2 && j === 1) ||
        (i === SIZE - 2 && j === SIZE - 2)
      )
        board[i][j] = SUPERFOOD;
    }
  }
  return board;
}

function createCherry() {
  var emptyCells = getEmptyCells(gBoard);
  var randomCell = getRandomIntInt(0, emptyCells.length);
  gBoard[emptyCells[randomCell].i][emptyCells[randomCell].j] = CHERRY;
  renderCell(emptyCells[randomCell], CHERRY);
}

function updateScore(diff) {
  gGame.score += diff;
  document.querySelector('h2 span').innerText = gGame.score;
}

function gameOver() {
  var elModal = document.querySelector('.modal');
  var elBtn = document.querySelector('.restart');
  gGame.isOn = false;
  clearInterval(gIntervalGhosts);
  clearInterval(gCherryInterval);
  elModal.innerHTML = `Looks like you lost there buddy, with a pathetic score of: <span> ${gGame.score} </span>, go ahead and try again`;
  elBtn.innerText = 'Try again?';
  elModal.style.display = 'block';
  elBtn.style.display = 'block';
}
