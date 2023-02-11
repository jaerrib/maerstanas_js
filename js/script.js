console.log("Javascript is connected")

const scoreP1 = document.querySelector("#score_p1")
const scoreP2 = document.querySelector("#score_p2")
const colors = ["black", "white"]
let score = [0, 0]
let activePlayer = 1
board = createBoard()

// Initializes empty board and stone arrays
function createBoard() {
    let board = []
    const size = 9;
    const empty = 0;
    const edge = 3;

    // Creates a 9x9 grid for the board
    for (var rowNum = 0; rowNum < size; rowNum++) {
        var row = [];
        for (var colNum = 0; colNum < size; colNum++) {
            row.push(empty);
        }
        board.push(row);
    }

    /* Assigns edge positions to the relevant array locations for use board position
    analysis */
    for (var colNum = 0; colNum < size; colNum++) {
        board[0][colNum] = edge;
        board[8][colNum] = edge;
    }

    for (var rowNum = 1; rowNum < size - 1; rowNum++) {
        board[rowNum][0] = edge;
        board[rowNum][8] = edge;
    }

    return board
}

function changeActivePlayer() {
    if (activePlayer == 1) {
        activePlayer = 2;
    }
    else {
        activePlayer = 1
    }
}

function updateScore() {
    scoreP1.innerText = score[0]
    scoreP2.innerText = score[1]
}

function convertToRowNum(letter) {
    // Converts player's letter input to a number usable by various functions.
    possibleRows = ["A", "B", "C", "D", "E", "F", "G"];
    for (var i = 0; i < possibleRows.length; i++) {
        if (letter == possibleRows[i]) {
            return i + 1
        }
    }
}

function assignBoardPos(row, col) {
    board[row][col] = activePlayer;
    console.log(activePlayer)
    score[activePlayer - 1]++
}

function isValidMove(row, col) {
    console.log(board[row][col])
    if (board[row][col] == 0) {
        return true;
    }
    return false
}

function placeStone(location) {
    var locArr = Array.from(location.id);
    var rowNum = convertToRowNum(locArr[0]);
    var colNum = locArr[1];
    if (isValidMove(rowNum, colNum)) {
        assignBoardPos(rowNum, colNum)
        location.innerText = "●";
        location.style.color = colors[activePlayer - 1];
        // calculateScore()
        updateScore()
        changeActivePlayer()
    }
}