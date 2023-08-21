/**
 *
 * @source: https://codeberg.org/jaerrib/maerstanas_js/js/script.js
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2023 John Beers (jaerrib@tutanota.com)
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

console.log("Javascript is connected")

const scoreP1 = document.querySelector("#score_p1")
const scoreP2 = document.querySelector("#score_p2")
const gameResult = document.querySelector("#results")
let score = [0, 0]
let activePlayer = 1
let board = createBoard()

// creates a new game
function newGame(player) {
    let score = [0, 0]
    let activePlayer = 1
    let board = createBoard()
}

// Initializes empty board and stone arrays
function createBoard() {
    let board = []
    const size = 9;
    const empty = 0;
    const edge = 3;
    // Creates a 9x9 grid for the board
    for (let rowNum = 0; rowNum < size; rowNum++) {
        let row = [];
        for (let colNum = 0; colNum < size; colNum++) {
            row.push(empty);
        }
        board.push(row);
    }
    // Assigns edge positions to the relevant array locations for use in
    // board position analysis
    for (let colNum = 0; colNum < size; colNum++) {
        board[0][colNum] = edge;
        board[8][colNum] = edge;
    }
    for (let rowNum = 1; rowNum < size - 1; rowNum++) {
        board[rowNum][0] = edge;
        board[rowNum][8] = edge;
    }
    return board
}

function changeActivePlayer() {
    if (activePlayer === 1) {
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
    const possibleRows = ["A", "B", "C", "D", "E", "F", "G"];
    for (let i = 0; i < possibleRows.length; i++) {
        if (letter === possibleRows[i]) {
            return i + 1
        }
    }
}

function findAdjacent(row, col) {
    // Returns assigned value for positions adjacent to a given board position
    return [
        [row - 1, col],
        [row, col - 1],
        [row, col - 1 + 2], // 'col + 1' adds 11 instead of 1; fix in the future
        [row + 1, col]
    ]
}

function checkAdjStones(row, col) {
    let adjacentPositions = findAdjacent(row, col);
    for (let pos = 0; pos < adjacentPositions.length; pos++) {
        let rowToCheck = adjacentPositions[pos][0]
        let colToCheck = adjacentPositions[pos][1]
        let board_value = board[rowToCheck][colToCheck]
        if (board_value === 1 || board_value === 2) {
            if (countHinges(rowToCheck, colToCheck) >= 3) {
                return true
            }
        }
    }
    return false
}

function countHinges(row, col) {
    // Evaluates the number of hinges a stone would have
    // if played at a given board position
    let adjacentPositions = findAdjacent(row, col)
    let hinges = 0;
    for (let pos = 0; pos < adjacentPositions.length; pos++) {
        let rowToCheck = adjacentPositions[pos][0]
        let colToCheck = adjacentPositions[pos][1]
        let positionCheck = board[rowToCheck][colToCheck]
        if (positionCheck === 3) {
            hinges += 1;
        }
        else if (positionCheck === 1 || positionCheck === 2) {
            hinges += 1;
        }
    }
    return hinges
}

function hasFourHinges(row, col) {
    return countHinges(row, col) > 3
}

function assignBoardPos(row, col) {
    board[row][col] = activePlayer;
}

function isValidMove(row, col) {
    if (board[row][col] !== 0) {
        // Invalid move - space occupied
        return false
    }
    if (hasFourHinges(row, col)) {
        // Invalid move - move would have 4 immediate hinges
        return false;
    }
    // Valid move if none of the adjacent stones would have 4 hinges
    return !checkAdjStones(row, col)
}

function placeStone(location) {
    let locArr = Array.from(location.id);
    let rowNum = convertToRowNum(locArr[0]);
    let colNum = locArr[1];
    if (isValidMove(rowNum, colNum)) {
        assignBoardPos(rowNum, colNum)
        location.innerHTML += '<img src="img/dark_stone.svg" style="width:1.5em;" class="mb-1 rounded-circle" alt="dark stone" role=img">'
        calculateScore()
        updateScore()
        changeActivePlayer()
        makeComputerMove()
    }
    if (gameOver()) {
        displayResult()
    }
}

function calculateScore() {
    score[0] = checkScore(1)
    score[1] = checkScore(2)
}

function checkScore(player) {
    // Evaluates the score of current board positions, first looping through the
    // vertical hinges then the horizontal ones.
    let calcScore = 0
    // Scores all vertical hinges
    for (let rowIndex = 1; rowIndex < board.length; rowIndex++) {
        for (let colIndex = 0; colIndex < board.length; colIndex++) {
            let boardPos = board[rowIndex][colIndex];
            let comparisonPos = board[rowIndex - 1][colIndex]
            if (comparisonPos === player && boardPos === player) {
                calcScore++
            }
            else if (comparisonPos === 3 && boardPos === player) {
                calcScore++
            }
            else if (boardPos === 3 && comparisonPos === player) {
                calcScore++
            }
        }
    }
    // Score all horizontal hinges
    for (let rowIndex = 1; rowIndex < board.length; rowIndex++) {
        for (let colIndex = 0; colIndex < board.length; colIndex++) {
            let boardPos = board[rowIndex][colIndex];
            let comparisonPos = board[rowIndex][colIndex - 1]
            if (comparisonPos === player && boardPos === player) {
                calcScore++
            }
            else if (comparisonPos === 3 && boardPos === player) {
                calcScore++
            }
            else if (boardPos === 3 && comparisonPos === player) {
                calcScore++
            }
        }
    }
    return calcScore
}

function gameOver() {
    // Cycles through board positions starting at A1 (1,1). If a position is
    // valid, viable_moves is True and play is allowed to continue. If a
    // position is not valid, the next position is assessed until the entire
    // board has been checked.
    let movesLeft = 0
    for (let rowIndex = 1; rowIndex < board.length; rowIndex++) {
        for (let colIndex = 1; colIndex < board.length; colIndex++) {
            if (board[rowIndex][colIndex] === 0) {
                if (!hasFourHinges(rowIndex, colIndex)) {
                    if (!checkAdjStones(rowIndex, colIndex)) {
                        movesLeft++
                    }
                }
            }
        }
    }
    return movesLeft === 0
}

function displayResult() {
    let result = ""
    if (score[0] === score[1]) {
        result = "It's a tie!"
    }
    else if (score[0] > score[1]) {
        result = "Player 1 wins!"
    }
    else result = "Player 2 wins!"
    let displayText = result + " Refresh the page (F5) or select New Game to play again."
    gameResult.innerText = (displayText)
    gameResult.style.padding = "5px"
}


function remainingMoves() {
    // Cycles through board positions starting at A1 (1,1). If a position is
    // a potentially valid move, it is appended to an array which is then used
    // when the pseudo AI randomly selects its move.
    let possibleMoves = []
    for (let rowIndex = 1; rowIndex < board.length; rowIndex++) {
        for (let colIndex = 1; colIndex < board.length; colIndex++) {
            if (board[rowIndex][colIndex] === 0) {
                if (!hasFourHinges(rowIndex, colIndex)) {
                    if (!checkAdjStones(rowIndex, colIndex)) {
                        possibleMoves.push([rowIndex, colIndex])
                    }
                }
            }
        }
    }
    return possibleMoves
}

function makeComputerMove() {
    // Pseudo AI placeholder that generates random moves for computer player
    let movesList = remainingMoves()
    let moveChoice = Math.floor((Math.random() * movesList.length))
    let rowChoice = movesList[moveChoice][0]
    let colChoice = movesList[moveChoice][1]
    if (isValidMove(rowChoice, colChoice)) {
        assignBoardPos(rowChoice, colChoice)
        let location = "#" + convertedRow(rowChoice) + colChoice
        let compElement = document.querySelector(location)
        compElement.innerHTML += '<img src="img/light_stone.svg" style="width:1.5em;" class="mb-1 rounded-circle" alt="light stone" role=img">'
        calculateScore()
        updateScore()
        changeActivePlayer()
    }
    if (gameOver()) {
        displayResult()
    }
}

function convertedRow(num) {
    // Converts computer row to a letter usable for accessing square element
    const possibleRows = ["A", "B", "C", "D", "E", "F", "G"];
    return possibleRows[num - 1]
}
