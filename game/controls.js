export class Controls {
    constructor(cube) { // map the keys
        this.cube = cube;
        this.keys = {};
        window.addEventListener('keydown', (e) => (this.keys[e.code] = true));
        window.addEventListener('keyup', (e) => (this.keys[e.code] = false));
    }

    update() {
        if (this.keys['ArrowLeft']) this.cube.move('left');
        if (this.keys['ArrowRight']) this.cube.move('right');
        if (this.keys['ArrowUp']) this.cube.move('up');
        if (this.keys['ArrowDown']) this.cube.move('down');
    }
}
