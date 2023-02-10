console.log("Javascript is connected")

let scoreP1 = document.querySelector("#score_p1")
let scoreP2 = document.querySelector("#score_p2")

// Initializes empty board and stone arrays
let board = [];

function createBoard() {
    var size = 9;
    var empty = 0;
    var edge = 3;

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
}

createBoard();
console.log(board)
