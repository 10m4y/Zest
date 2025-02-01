import * as THREE from 'three';

export class Market {
    constructor(scene, position) {
        this.geometry = new THREE.BoxGeometry(2, 2, 2);
        this.material = new THREE.MeshStandardMaterial({ color: 0xffd700 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.copy(position);
        scene.add(this.mesh);
    }
}
