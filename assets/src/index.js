import Board from './components/board.js';
import Tile from './components/tile.js';


/* CREATE GAME BOARD */

const boardElement = document.querySelector('.board');
const board = new Board(boardElement);


/* SCORES */

const scoreElement = document.querySelector('#score-value');
const bestScoreElement = document.querySelector('#best-value');

bestScoreElement.textContent = localStorage.getItem('bestScore') || 0;

function incrementScoreByValue(value) {
    const newScore = Number.parseInt(scoreElement.textContent) + value;
    const bestScore = Number.parseInt(bestScoreElement.textContent);

    scoreElement.textContent = newScore;

    if (newScore > bestScore) {
        updateBestScore(newScore);
    }
}

function updateBestScore(score) {
    bestScoreElement.textContent = score;
    localStorage.setItem('bestScore', score);
}


/* CREATE FIRST TILES */

createTile();
createTile();

function createTile() {
    board.getRandomEmptyCell()?.linkTile(new Tile(boardElement));
}


/* HANDLE KEYS INPUT */

window.addEventListener('keydown', handleInput);

async function handleInput(event) {
    switch (event.key) {
        case 'ArrowUp':
            if(!canMoveUp()) {
                return
            }

            await moveTilesUp();
            break;
        
        case 'ArrowDown':
            if(!canMoveDown()) {
                return
            }

            await moveTilesDown();
            break;

        case 'ArrowLeft':
            if(!canMoveLeft()) {
                return
            }

            await moveTilesLeft();
            break;

        case 'ArrowRight':
            if(!canMoveRight()) {
                return
            }

            await moveTilesRight();
            break;

        default: 
            return;
    }

    createTile();

    if (!canMove()) {
        alert("Game over!");
        location.reload();
    }
}


/* MOVE TILES */

async function moveTilesUp() {
    await slideTiles(board.cellsGroupedByColumn);
}

async function moveTilesDown() {
    await slideTiles(board.cellsGroupedByColumnReversed);
}

async function moveTilesLeft() {
    await slideTiles(board.cellsGroupedByRow);
}

async function moveTilesRight() {
    await slideTiles(board.cellsGroupedByRowReversed);
}


/* SLIDE TILES */

async function slideTiles(groupedCells) {
    const promises = [];
    groupedCells.forEach(cellsGroup => slideTilesInGroup(cellsGroup, promises));

    await Promise.all(promises);
    
    /* Merge Tiles */
    board.cells.forEach(cell => {
        if (cell.hasTileForMerge()) {
            incrementScoreByValue(cell.mergeCells());
        }
    });
}

function slideTilesInGroup(cellsGroup, promises) {
    for (let i = 0; i < cellsGroup.length; i++) {
        if (cellsGroup[i].isEmpty()) {
            continue;
        }

        const cellWithTile = cellsGroup[i];

        let j = i - 1;
        let targerCell;

        while (j >= 0 && cellsGroup[j].canAccept(cellWithTile.linkedTile)) {
            targerCell = cellsGroup[j];
            j--;
        }

        if (!targerCell) {
            continue;
        }

        promises.push(cellWithTile.linkedTile.waitForEndTransition());

        if (targerCell.isEmpty()) {
            targerCell.linkTile(cellWithTile.linkedTile);
        }
        else {
            targerCell.linkTileForMerge(cellWithTile.linkedTile);
        }

        cellWithTile.unlinkTile();
    }
}


/* CHECK IF CAN MOVES */

function canMove() {
    return canMoveUp() || canMoveDown() || canMoveLeft() || canMoveRight();
}

function canMoveUp() {
    return canMoveTiles(board.cellsGroupedByColumn);
}

function canMoveDown() {
    return canMoveTiles(board.cellsGroupedByColumnReversed);
}

function canMoveLeft() {
    return canMoveTiles(board.cellsGroupedByRow);
}

function canMoveRight() {
    return canMoveTiles(board.cellsGroupedByRowReversed);
}

function canMoveTiles(groupedCells) {
    return groupedCells.some(cellsGroup => canMoveTilesInGroup(cellsGroup));
}

function canMoveTilesInGroup(cellsGroup) {
    return cellsGroup.some((cell, index) => {
        if (index === 0) {
            return false;
        }

        if (cell.isEmpty()) {
            return false;
        }

        return cellsGroup[index - 1].canAccept(cell.linkedTile);
    })
}


/* NEW GAME BUTTON */

const newGameButton = document.querySelector('#new-game-btn');

newGameButton.onclick = event => {
    event.preventDefault();
    
    if (confirm('Are you sure you want to reload the game?')) {
        location.reload();
    }
}