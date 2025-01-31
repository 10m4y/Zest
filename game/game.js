import * as THREE from "three";
import { Cube } from "./cube.js";
import { Crate } from "./crate.js";
import { World } from "./world.js";
import { Controls } from "./controls.js";

export class Game {
  constructor() {
    this.world = new World();
    this.cube = new Cube(this.world.scene);
    this.controls = new Controls(this.cube);

    const n = 5;
    this.crates = [];
    for (let i = 0; i < n; i++) {
      const randomX = (Math.random() - 0.5) * 10;
      const randomZ = (Math.random() - 0.5) * 10;
      const crate = new Crate(
        this.world.scene,
        new THREE.Vector3(randomX, 0.5, randomZ)
      );
      this.crates.push(crate);
    }

    this.animate();
  }

  checkCrateCollision() {
    const metadata = new Set();
    for (let i = this.crates.length - 1; i >= 0; i--) {
      const crate = this.crates[i];

      if (this.cube.mesh.position.distanceTo(crate.mesh.position) < 1) {
        this.cube.mesh.material.color.copy(crate.mesh.material.color);

        const skinCode = crate.mesh.material.color.getHexString();
        metadata.add(skinCode);

        console.log([...metadata]);

        this.world.scene.remove(crate.mesh);
        this.crates.splice(i, 1);
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.controls.update();
    this.checkCrateCollision();
    this.world.render();
  }
}
