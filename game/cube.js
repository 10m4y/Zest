import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

export class Cube {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.currentTexture = null;
    this.loadCharacter();
  }

  async loadCharacter() {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    const textureLoader = new THREE.TextureLoader();

    try {
      // Load default skin texture
      const defaultTexture = await textureLoader.loadAsync(
        "./assets/blocky-chars/Skins/Basic/skin_man.png"
      );
      defaultTexture.colorSpace = THREE.SRGBColorSpace;

      // Load materials and apply texture
      const materials = await mtlLoader.loadAsync(
        "./assets/blocky-chars/Models/Non-rigged/basicCharacter.mtl"
      );

      // Modify material to use texture
      materials.materials.Material = new THREE.MeshPhongMaterial({
        map: defaultTexture,
        shininess: 30,
      });

      objLoader.setMaterials(materials);

      const model = await objLoader.loadAsync(
        "./assets/blocky-chars/Models/Non-rigged/basicCharacter.obj"
      );

      // Apply transformations
      model.scale.set(0.1, 0.1, 0.1);
      model.position.set(0, 0.5, 0);
      model.rotation.y = Math.PI;

      this.mesh = model;
      this.scene.add(this.mesh);
    } catch (error) {
      console.error("Error loading character:", error);
    }
  }

  move(direction) {
    const speed = 0.2;
    if (direction === "left") this.mesh.position.x -= speed;
    if (direction === "right") this.mesh.position.x += speed;
    if (direction === "up") this.mesh.position.z -= speed;
    if (direction === "down") this.mesh.position.z += speed;
  }
}
