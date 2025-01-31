import * as THREE from 'three';

export class World {
    constructor(cube) {
        this.scene = new THREE.Scene();
        this.cube = cube;
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 10, 5);
        this.scene.add(light);

        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.scene.add(this.ground);

        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        this.cube = cube;
    }

    updateCamera() {
        if (this.cube && this.cube.mesh) {
            this.camera.position.x = this.cube.mesh.position.x + 5;
            this.camera.position.y = this.cube.mesh.position.y + 5;
            this.camera.position.z = this.cube.mesh.position.z + 5;
            this.camera.lookAt(this.cube.mesh.position);
        }
    }

    render() {
        this.updateCamera();
        this.renderer.render(this.scene, this.camera);
    }
}
