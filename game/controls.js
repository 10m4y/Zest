export class Controls {
  constructor(cube) {
    this.cube = cube;
    this.keys = {};
    this.direction = [];

    document.addEventListener("keydown", (e) => this.onKeyDown(e));
    document.addEventListener("keyup", (e) => this.onKeyUp(e));
  }

  onKeyDown(e) {
    this.keys[e.key] = true;

    if (e.key === " ") {
      this.cube.jump();
    }
  }

  onKeyUp(e) {
    this.keys[e.key] = false;
  }

  update(camera) {
    const direction = [];
    if (this.keys["ArrowUp"] || this.keys["w"]) direction.push("up");
    if (this.keys["ArrowDown"] || this.keys["s"]) direction.push("down");
    if (this.keys["ArrowLeft"] || this.keys["a"]) direction.push("left");
    if (this.keys["ArrowRight"] || this.keys["d"]) direction.push("right");

    this.cube.move(direction, camera.quaternion);
    this.cube.updateCamera(camera);

    if (this.keys[" "] && this.cube.isGrounded) {
      this.cube.jump();
      this.keys[" "] = false;
    }
  }
}
