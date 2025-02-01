import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Market {
  constructor(scene, position) {
    this.scene = scene;
    new GLTFLoader().load('../assets/Market_Stalls.glb', (gltf) => {
      this.mesh = gltf.scene;
      this.mesh.position.copy(position);
      this.mesh.scale.set(12, 12, 12);
      scene.add(this.mesh);
    });
  }
}
