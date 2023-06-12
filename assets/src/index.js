import Board from './components/board.js';
import Tile from './components/tile.js';


/* CREATE GAME BOARD */

const boardElement = document.querySelector('.board');
const board = new Board(boardElement);


/* CREATE FIRST TILES */

createTile();
createTile();

function createTile() {
    board.getRandomEmptyCell()?.linkTile(new Tile(boardElement));
}


/* HANDLE KEYS INPUT */

window.addEventListener('keydown', handleInput);

function handleInput(event) {
    switch (event.key) {
        case 'ArrowUp':
            if(!canMoveUp()) {
                return
            }

            moveTilesUp();
            break;
        
        case 'ArrowDown':
            if(!canMoveDown()) {
                return
            }

            moveTilesDown();
            break;

        case 'ArrowLeft':
            if(!canMoveLeft()) {
                return
            }

            moveTilesLeft();
            break;

        case 'ArrowRight':
            if(!canMoveRight()) {
                return
            }

            moveTilesRight();
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

function moveTilesUp() {
    slideTiles(board.cellsGroupedByColumn);
}

function moveTilesDown() {
    slideTiles(board.cellsGroupedByColumnReversed);
}

function moveTilesLeft() {
    slideTiles(board.cellsGroupedByRow);
}

function moveTilesRight() {
    slideTiles(board.cellsGroupedByRowReversed);
}


/* SLIDE TILES */

function slideTiles(groupedCells) {
    groupedCells.forEach(cellsGroup => slideTilesInGroup(cellsGroup));
    
    /* Merge Tiles */
    board.cells.forEach(cell => cell.hasTileForMerge() && cell.mergeCells());
}

function slideTilesInGroup(cellsGroup) {
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