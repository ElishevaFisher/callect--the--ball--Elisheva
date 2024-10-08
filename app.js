var WALL = "WALL";
var FLOOR = "FLOOR";
var BALL = "BALL";
var GAMER = "GAMER";

var GAMER_IMG = '<img src="gamer.png" />';
var BALL_IMG = '<img src="ball.png" />';

var gBoard;
var gGamerPos;

var gBallCount = 0;
var gTotalBalls = 0;
var isGameActive = true;

function initGame() {
  gGamerPos = { i: 2, j: 9 };
  gBoard = buildBoard();
  renderBoard(gBoard);
  gBallCount = 0;
  gTotalBalls = countTotalBalls();
  updateBallCountDisplay();
  hideWinMessage();
  isGameActive = true;
}
function countTotalBalls() {
  let total = 0;
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].gameElement === BALL) total++;
    }
  }
  return total;
}

function buildBoard() {
  // Create the Matrix
  // var board = createMat(10, 12)
  var board = new Array(10);
  for (var i = 0; i < board.length; i++) {
    board[i] = new Array(12);
  }

  // Put FLOOR everywhere and WALL at edges
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      // Put FLOOR in a regular cell
      var cell = { type: FLOOR, gameElement: null };

      // Place Walls at edges
      if (
        i === 0 ||
        i === board.length - 1 ||
        j === 0 ||
        j === board[0].length - 1
      ) {
        cell.type = WALL;
      }

      // Add created cell to The game board
      board[i][j] = cell;
    }
  }

  // Place the gamer at selected position
  board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

  // Place the Balls (currently randomly chosen positions)
  board[3][8].gameElement = BALL;
  board[7][4].gameElement = BALL;

  console.log(board);
  return board;
}

// Render the board to an HTML table
function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>\n";
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];

      var cellClass = getClassName({ i: i, j: j });

      // TODO - change to short if statement
      if (currCell.type === FLOOR) cellClass += " floor";
      else if (currCell.type === WALL) cellClass += " wall";

      //TODO - Change To ES6 template string
      strHTML +=
        '\t<td class="cell ' +
        cellClass +
        '"  onclick="moveTo(' +
        i +
        "," +
        j +
        ')" >\n';

      // TODO - change to switch case statement
      if (currCell.gameElement === GAMER) {
        strHTML += GAMER_IMG;
      } else if (currCell.gameElement === BALL) {
        strHTML += BALL_IMG;
      }

      strHTML += "\t</td>\n";
    }
    strHTML += "</tr>\n";
  }

  console.log("strHTML is:");
  console.log(strHTML);
  var elBoard = document.querySelector(".board");
  elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
  if (!isGameActive) return;
  var targetCell = gBoard[i][j];
  if (targetCell.type === WALL) return;

  // Calculate distance to make sure we are moving to a neighbor cell
  var iAbsDiff = Math.abs(i - gGamerPos.i);
  var jAbsDiff = Math.abs(j - gGamerPos.j);

  // If the clicked Cell is one of the four allowed
  if (
    (iAbsDiff === 1 && jAbsDiff === 0) ||
    (jAbsDiff === 1 && iAbsDiff === 0)
  ) {
    if (targetCell.gameElement === BALL) {
      console.log("Collecting!");
      gBallCount++;
      updateBallCountDisplay();
    }
    if (gBallCount === gTotalBalls) {
      showWinMessage();
      isGameActive = false;
    }

    // MOVING from current position
    // Model:
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
    // Dom:
    renderCell(gGamerPos, "");

    // MOVING to selected position
    // Model:
    gGamerPos.i = i;
    gGamerPos.j = j;
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
    // DOM:
    renderCell(gGamerPos, GAMER_IMG);
  } // else console.log('TOO FAR', iAbsDiff, jAbsDiff);
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
  var cellSelector = "." + getClassName(location);
  var elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {
  var i = gGamerPos.i;
  var j = gGamerPos.j;

  switch (event.key) {
    case "ArrowLeft":
      moveTo(i, j - 1);
      break;
    case "ArrowRight":
      moveTo(i, j + 1);
      break;
    case "ArrowUp":
      moveTo(i - 1, j);
      break;
    case "ArrowDown":
      moveTo(i + 1, j);
      break;
  }
}

// Returns the class name for a specific cell
function getClassName(location) {
  var cellClass = "cell-" + location.i + "-" + location.j;
  console.log("cellClass:", cellClass);
  return cellClass;
}

function addBall() {
  if (!isGameActive) return;
  gTotalBalls++;
  const row = gBoard.length - 2;
  const column = gBoard[0].length - 2;
  const i = Math.floor(Math.random() * row + 1);
  const j = Math.floor(Math.random() * column + 1);
  if (!gBoard[i][j].gameElement) {
    gBoard[i][j].gameElement = BALL;
    renderCell({ i, j }, BALL_IMG);
  }
}
setInterval(addBall, 3000);

function updateBallCountDisplay() {
  var elBallCount = document.querySelector(".ball-count"); 
  elBallCount.innerText = "Balls Collected: " + gBallCount; 
}

function showWinMessage() {
  var elWinMessage = document.querySelector(".win-message");
  elWinMessage.style.display = "block";
}
function hideWinMessage() {
  var elWinMessage = document.querySelector(".win-message");
  elWinMessage.style.display = "none"; 
}

function refreshGame() {
  location.reload(); 
}
