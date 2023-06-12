export default class Cell {
    constructor(boardElement, x, y) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        boardElement.append(cell);

        this.x = x;
        this.y = y;
    }

    linkTile(tile) {
        this.linkedTile = tile;
        tile.setXY(this.x, this.y);
    }

    unlinkTile() {
        this.linkedTile = null;
    }

    linkTileForMerge(tile) {
        tile.setXY(this.x, this.y);
        this.linkedTileForMerge = tile;
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
        return this.isEmpty() || (this.linkedTile.value === tile.value && !this.hasTileForMerge());
    }
}