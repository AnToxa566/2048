export default class Tile {
    constructor(boardElement) {
        this.createTileElement(boardElement)
        this.setValue(2);
    }

    createTileElement(boardElement) {
        this.tileElement = document.createElement('div');
        this.tileElement.className = 'tile';

        boardElement.append(this.tileElement);
    }

    setXY(x, y) {
        this.tileElement.style.setProperty('--x', x);
        this.tileElement.style.setProperty('--y', y);
    }

    setValue(value) {
        this.value = value;
        this.tileElement.textContent = value;

        const bgLightness = 100 - Math.log2(value) * 9;

        this.tileElement.style.setProperty('--bg-color-lightness', `${bgLightness}%`);
        this.tileElement.style.setProperty('--text-color-lightness', `${bgLightness < 50 ? 90 : 10}%`);
    }

    waitForEndTransition() {
        return new Promise(resolve => {
            this.tileElement.addEventListener('transitionend', resolve, { once: true });
        });
    }

    removeFromDOM() {
        this.tileElement.remove();
    }
}