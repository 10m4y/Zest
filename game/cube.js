import * as THREE from 'three';

export class Cube {
    constructor(scene) {
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, 0.5, 0);
        scene.add(this.mesh);
    }

    move(direction) {
        const speed = 0.2;
        if (direction === 'left') this.mesh.position.x -= speed;
        if (direction === 'right') this.mesh.position.x += speed;
        if (direction === 'up') this.mesh.position.z -= speed;
        if (direction === 'down') this.mesh.position.z += speed;
    }
}
