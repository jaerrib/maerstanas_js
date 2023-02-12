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
    for (let rowNum = 0; rowNum < size; rowNum++) {
        let row = [];
        for (let colNum = 0; colNum < size; colNum++) {
            row.push(empty);
        }
        board.push(row);
    }

    /* Assigns edge positions to the relevant array locations for use board position
    analysis */
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
    let adjacentPositions = [
        [row - 1, col],
        [row, col - 1],
        [row, col + 1],
        [row + 1, col]
    ];
    console.log(adjacentPositions)
    return adjacentPositions
}


function hasFourHinges(row, col) {

    // Evaluates the number of hinges a player move would have
    // if played at a given board position
    let adjacentPositions = findAdjacent(row, col)
    // Counts the number of hinges a potential position would have
    let hinges = 0;
    for (let pos = 0; pos < adjacentPositions.length; pos++) {
        let rowToCheck = adjacentPositions[pos][1]
        let positionCheck = board[row][col]
        if (positionCheck !== 0) {
            hinges += 1;
        }
    }
    return hinges > 3;
}

function assignBoardPos(row, col) {
    board[row][col] = activePlayer;
    // console.log(activePlayer)
    score[activePlayer - 1]++
}

function isValidMove(row, col) {
    // console.log(board[row][col])
    if (board[row][col] === 0) {
        if (!hasFourHinges(row, col)){
            return true;
        }
    }
    return false
}

function placeStone(location) {
    let locArr = Array.from(location.id);
    let rowNum = convertToRowNum(locArr[0]);
    let colNum = locArr[1];
    if (isValidMove(rowNum, colNum)) {
        assignBoardPos(rowNum, colNum)
        location.innerText = "●";
        location.style.color = colors[activePlayer - 1];
        // calculateScore()
        updateScore()
        changeActivePlayer()
    }
}