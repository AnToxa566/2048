export default class Tile {
    constructor(boardElement) {
        this.tileElement = document.createElement('div');
        this.tileElement.className = 'tile';

        this.setValue(2);

        boardElement.append(this.tileElement);
    }

    setXY(x, y) {
        this.tileElement.style.setProperty('--x', x);
        this.tileElement.style.setProperty('--y', y);
    }

    setValue(value) {
        this.value = value;
        this.tileElement.textContent = this.value;

        const bgLightness = 100 - Math.log2(this.value) * 9;

        this.tileElement.style.setProperty('--bg-color-lightness', `${bgLightness}%`);
        this.tileElement.style.setProperty('--text-color-lightness', `${bgLightness < 50 ? 90 : 10}%`);
    }

    removeFromDOM() {
        this.tileElement.remove();
    }
}