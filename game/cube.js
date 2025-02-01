import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

export class Cube {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.mesh = null; // Initialize mesh as null
    this.currentMaterial = null;
    this.loadCharacter();
  }

  async loadCharacter() {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    const textureLoader = new THREE.TextureLoader();

    try {
      // Load default skin
      const defaultTexture = await textureLoader.loadAsync(
        "./assets/blocky-chars/Skins/Basic/skin_man.png"
      );
      defaultTexture.colorSpace = THREE.SRGBColorSpace;

      // Create material with texture
      this.currentMaterial = new THREE.MeshPhongMaterial({
        map: defaultTexture,
        shininess: 30,
      });

      const model = await objLoader.loadAsync(
        "./assets/blocky-chars/Models/Non-rigged/basicCharacter.obj"
      );

      // Apply material to all meshes
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = this.currentMaterial;
        }
      });

      model.scale.set(0.1, 0.1, 0.1);
      model.position.set(0, 0.5, 0);
      model.rotation.y = Math.PI;

      this.mesh = model;
      this.scene.add(this.mesh);
    } catch (error) {
      console.error("Error loading character:", error);
    }
  }

  applyTexture(texture) {
    if (!this.currentMaterial) return;

    texture.colorSpace = THREE.SRGBColorSpace;
    this.currentMaterial.map = texture;
    this.currentMaterial.needsUpdate = true;
  }

  move(direction) {
    const speed = 0.2;
    if (direction === "left") this.mesh.position.x -= speed;
    if (direction === "right") this.mesh.position.x += speed;
    if (direction === "up") this.mesh.position.z -= speed;
    if (direction === "down") this.mesh.position.z += speed;
  }
}
