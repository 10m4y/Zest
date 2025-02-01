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
    this.moveSpeed = 5.0;

    this.jumpForce = 10;
    this.gravity = 20;

    this.isGrounded = false;

    this.cameraOffset = new THREE.Vector3(5, 5, 5);
    this.targetRotation = 0;
    this.rotationSpeed = 0.2;

    this.baseSpeed = 5.0;  // Base movement speed
    this.speedMultiplier = 1.0; // Multiplier for speed boosts
    this.maxSpeed = 10.0; // Maximum allowed speed
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

    this.mesh.position.add(this.velocity.clone().multiplyScalar(deltaTime));

    const airControl = this.isGrounded ? 1 : 0.2;
    this.velocity.x *= 0.90 * airControl;
    this.velocity.z *= 0.90 * airControl;

    if (this.direction.length() > 0.1) {
      this.mesh.rotation.y = THREE.MathUtils.lerp(
        this.mesh.rotation.y,
        this.targetRotation,
        this.rotationSpeed
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

    const targetSpeed = Math.min(
        this.baseSpeed * this.speedMultiplier, 
        this.maxSpeed
      );
      
      this.velocity.x = this.direction.x * targetSpeed;
      this.velocity.z = this.direction.z * targetSpeed;
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