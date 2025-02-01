import * as THREE from "three";

export class Crate {
  constructor(scene, position, skinCode) {
    this.skinCode = skinCode;

    const textureLoader = new THREE.TextureLoader();
    const crateTexture = textureLoader.load("../assets/textures/crate.gif");
    crateTexture.wrapS = THREE.RepeatWrapping;
    crateTexture.wrapT = THREE.RepeatWrapping;

    const materials = [ // for all faces
      new THREE.MeshPhongMaterial({ map: crateTexture }),
      new THREE.MeshPhongMaterial({ map: crateTexture }),
      new THREE.MeshPhongMaterial({ map: crateTexture }),
      new THREE.MeshPhongMaterial({ map: crateTexture }),
      new THREE.MeshPhongMaterial({ map: crateTexture }),
      new THREE.MeshPhongMaterial({ map: crateTexture }),
    ];

    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), materials);

    this.mesh.position.copy(position);
    const hue = Math.random() * 0.1; // color variation
    materials.forEach((material) => {
      material.color.setHSL(hue, 0.4, 0.6);
    });

    scene.add(this.mesh);
  }

  getSkinColor(skinCode) {
    const skinColors = {
      skin_man: 0xffaaaa,
      skin_woman: 0xaaffaa,
      skin_orc: 0x00ff00,
      skin_robot: 0x888888,
      skin_soldier: 0x5555ff,
      skin_adventurer: 0xffaa00,
    };
    return skinColors[skinCode];
  }
}
