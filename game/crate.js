import * as THREE from 'three';

export class Crate {
    constructor(scene, position) {
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshStandardMaterial({ color: this.genCrateSkin() });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.copy(position);
        scene.add(this.mesh);
    }

    genCrateSkin() {
        const colorCodes = [ // our skins
            new THREE.Color(0xff5733), // Red
            new THREE.Color(0x33ff57), // Green
            new THREE.Color(0x5733ff), // Blue
            new THREE.Color(0xfff033), // Yellow
            new THREE.Color(0x33f0ff), // Light Blue
            new THREE.Color(0xff33f0), // Magenta
            new THREE.Color(0xf0f033), // Lime
        ];

        const randomColor = colorCodes[Math.floor(Math.random() * colorCodes.length)];
        return randomColor;
    }
}
