import Cell from './cell.js'

const BOARD_SIZE = 4;
const CELLS_COUNT = BOARD_SIZE * BOARD_SIZE;

export default class Board {
    constructor(boardElement) {
        this.init(boardElement)
    }

    init(boardElement) {
        this.boardElement = boardElement;
        this.cells = [];

        for (let i = 0; i < CELLS_COUNT; i++) {
            this.cells.push(new Cell(boardElement, i % BOARD_SIZE, Math.floor(i / BOARD_SIZE)))
        }

        this.cellsGroupedByColumn = this.getGroupedCellsByColumn();
        this.cellsGroupedByColumnReversed = this.reversedGroupedCells(this.cellsGroupedByColumn);

        this.cellsGroupedByRow = this.getGroupedCellsByRow();
        this.cellsGroupedByRowReversed = this.reversedGroupedCells(this.cellsGroupedByRow);
    }

    getRandomEmptyCell() {
        const emptyCells = this.cells.filter(cell => cell.isEmpty());
        const randomIndex = Math.floor(Math.random() * emptyCells.length);

        return emptyCells[randomIndex];
    }

    getGroupedCellsByColumn() {
        return this.cells.reduce((groupedCells, cell) => {
            groupedCells[cell.x] = groupedCells[cell.x] || [];
            groupedCells[cell.x][cell.y] = cell;
            return groupedCells;
        }, [])
    }

    getGroupedCellsByRow() {
        return this.cells.reduce((groupedCells, cell) => {
            groupedCells[cell.y] = groupedCells[cell.y] || [];
            groupedCells[cell.y][cell.x] = cell;
            return groupedCells;
        }, [])
    }

    reversedGroupedCells(groupedCells) {
        return groupedCells.map(cells => [...cells].reverse());
    }
}