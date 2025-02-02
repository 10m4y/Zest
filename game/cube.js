import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

export class Cube {
  constructor(scene, world) {

    this.scene = scene;
    this.world = world;
    this.mesh = null;
    this.currentMaterial = null;

    this.loadCharacter();

    this.movementSpeed = 5.0;

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.jumpForce = 10;
    this.gravity = 20;

    this.isGrounded = false;

    this.cameraOffset = new THREE.Vector3(5, 5, 5);
    this.targetRotation = 0;
    this.rotationSpeed = 0.2;

    this.moveSpeed = 8.0;       // Base movement speed
    this.sprintMultiplier = 2.0; // Sprint speed multiplier
    this.currentSpeed = this.moveSpeed;
    this.acceleration = 40.0;    // Higher acceleration for faster response
    this.deceleration = 25.0;
  }

  async loadCharacter() {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    const textureLoader = new THREE.TextureLoader();

    try {
      const defaultTexture = await textureLoader.loadAsync(
        "./assets/blocky-chars/Skins/Basic/skin_man.png"
      );
      defaultTexture.colorSpace = THREE.SRGBColorSpace;

      this.currentMaterial = new THREE.MeshPhongMaterial({
        map: defaultTexture,
        shininess: 30,
      });

      const model = await objLoader.loadAsync(
        "./assets/blocky-chars/Models/Non-rigged/basicCharacter.obj"
      );

      model.traverse((child) => {
        if (child.isMesh) {
          child.material = this.currentMaterial;
          if (child.name.includes('Leg')) {
            child.name = child.name.includes('Left') ? 'LeftLeg' : 'RightLeg';
          }
        }
      });

      model.scale.set(0.15, 0.15, 0.15);
      model.position.set(0, 0.5, 0);
      model.rotation.y = Math.PI;

      this.mesh = model;
      this.scene.add(this.mesh);
    } catch (error) {
      console.error("Error loading character:", error);
    }
  }

  update(deltaTime) {
    if (!this.isGrounded) {
      this.velocity.y -= this.gravity * deltaTime;
    }

    const targetVelocity = new THREE.Vector3(
      this.direction.x * this.currentSpeed,
      0,
      this.direction.z * this.currentSpeed
    );

    this.velocity.x = THREE.MathUtils.lerp(
      this.velocity.x,
      targetVelocity.x,
      this.acceleration * deltaTime
    );
    this.velocity.z = THREE.MathUtils.lerp(
      this.velocity.z,
      targetVelocity.z,
      this.acceleration * deltaTime
    );

    this.mesh.position.add(this.velocity.clone().multiplyScalar(deltaTime));

    if (this.direction.length() > 0.1) {
      const targetYRotation = Math.atan2(this.direction.x, this.direction.z);
      this.mesh.rotation.y = THREE.MathUtils.lerp(
        this.mesh.rotation.y,
        targetYRotation,
        this.rotationSpeed * deltaTime * 60 // frame rate
      );
    }
  }

  jump() {
    if (this.isGrounded) {
      this.velocity.y = this.jumpForce;
      this.isGrounded = false;
    }
  }

  applyTexture(texture) {
    if (!this.currentMaterial) return;

    texture.colorSpace = THREE.SRGBColorSpace;
    this.currentMaterial.map = texture;
    this.currentMaterial.needsUpdate = true;
  }

  move(direction, cameraQuaternion) {
    if (!this.mesh || !this.world.terrain) return;
    
    const forward = new THREE.Vector3(0, 0, -1);
    const right = new THREE.Vector3(1, 0, 0);
    forward.applyQuaternion(cameraQuaternion);
    right.applyQuaternion(cameraQuaternion);

    this.direction.set(0, 0, 0);
    
    if (direction.includes('up')) this.direction.add(forward);
    if (direction.includes('down')) this.direction.add(forward.negate());
    if (direction.includes('left')) this.direction.add(right.negate());
    if (direction.includes('right')) this.direction.add(right);

    this.direction.y = 0;
    if (this.direction.length() > 0) {
      this.direction.normalize();
      this.targetRotation = Math.atan2(this.direction.x, this.direction.z);
    }
  }  

  updateCamera(camera) {
    if (!this.mesh) return;

    const idealOffset = new THREE.Vector3(5, 5, 5).applyQuaternion(
      this.mesh.quaternion
    );

    const cameraPosition = this.mesh.position.clone().add(idealOffset);

    camera.position.lerp(cameraPosition, 0.1);

    const lookAtPoint = this.mesh.position.clone();
    lookAtPoint.y += 1;
    camera.lookAt(lookAtPoint);
  }
}