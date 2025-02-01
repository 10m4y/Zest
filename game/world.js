import * as THREE from "three";

export class World {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });

    // Improved lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;

    this.scene.add(ambientLight);
    this.scene.add(directionalLight);

    // Renderer configuration
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);

    // Ground plane updates
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      roughness: 0.8,
      metalness: 0.2,
    });
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);

    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);
  }

  updateCamera(cube) {
    if (cube && cube.mesh) {
      this.camera.position.set(
        cube.mesh.position.x + 5,
        cube.mesh.position.y + 5,
        cube.mesh.position.z + 5
      );
      this.camera.lookAt(cube.mesh.position);
    }
  }

  render(cube) {
    this.updateCamera(cube);
    this.renderer.render(this.scene, this.camera);
  }
}
