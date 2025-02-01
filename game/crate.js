import * as THREE from 'three';

export class Crate {
  constructor(scene, position, skinCode) {
    this.skinCode = skinCode; // Store the skin code
    
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: this.getSkinColor(skinCode),
      transparent: true,
      opacity: 0.8
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
    scene.add(this.mesh);
  }

  getSkinColor(skinCode) {
    const skinColors = {
      skin_man: 0xffaaaa,
      skin_woman: 0xaaffaa,
      skin_orc: 0x00ff00,
      skin_robot: 0x888888,
      skin_soldier: 0x5555ff,
      skin_adventurer: 0xffaa00
    };
    return skinColors[skinCode];
  }
}
