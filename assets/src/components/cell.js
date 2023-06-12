export default class Cell {
    constructor(boardElement, x, y) {
        this.createCellElement(boardElement);

        this.x = x;
        this.y = y;
    }

    createCellElement(boardElement) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        boardElement.append(cell);
    }

    linkTile(tile) {
        this.linkedTile = tile;
        tile.setXY(this.x, this.y);
    }

    unlinkTile() {
        this.linkedTile = null;
    }

    linkTileForMerge(tile) {
        this.linkedTileForMerge = tile;
        tile.setXY(this.x, this.y);
    }

    unlinkTileForMerge() {
        this.linkedTileForMerge = null;
    }

    isEmpty() {
        return !this.linkedTile;
    }

    hasTileForMerge() {
        return !!this.linkedTileForMerge;
    }

    mergeCells() {
        if (this.linkedTile && this.linkedTileForMerge) {
            this.linkedTile.setValue(this.linkedTile.value + this.linkedTileForMerge.value);
            this.linkedTileForMerge.removeFromDOM();
            this.unlinkTileForMerge();
        }
    }

    canAccept(tile) {
        return this.isEmpty() || (!this.hasTileForMerge() && this.linkedTile.value === tile.value);
    }
}