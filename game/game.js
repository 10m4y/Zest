import { Cube } from './cube.js';
import { Crate } from './crate.js';
import { World } from './world.js';
import { Controls } from './controls.js';

export class Game {
    constructor() {
        this.world = new World();
        this.cube = new Cube(this.world.scene);
        this.controls = new Controls(this.cube);

        this.crates = [ // random crate gen
            new Crate(this.world.scene, { x: 2, y: 0.5, z: -3 }),
            new Crate(this.world.scene, { x: -2, y: 0.5, z: 4 }),
        ];

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.controls.update();
        this.world.render();
    }
}
