import * as THREE from 'three';
import THREEx from '../lib/threex.md2characterratmahatta.js';

export class Character {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;
        this.character = null;
        this.currentAnimation = 'stand';
        this.currentSkin = 'ratamahatta';
        this.availableSkins = [
            'ratamahatta',
            'ctf_b',
            'ctf_r',
            'dead',
            'gearwhore'
        ];
        
        this.availableAnimations = [
            'stand',
            'run',
            'attack',
            'pain',
            'jump',
            'flip',
            'salute',
            'taunt',
            'wave',
            'point',
            'crstand',
            'crwalk',
            'crattack',
            'crpain',
            'crdeath',
            'death'
        ];

        this.init();
    }

    async init() {
        this.character = new THREEx.MD2CharacterRatmahatta();
        await this.character.load();
        this.mesh = this.character.object3d;
        this.mesh.scale.set(0.1, 0.1, 0.1);
        this.scene.add(this.mesh);
        
        // Set initial animation
        this.character.animation(this.currentAnimation);
    }

    update(delta) {
        if (this.character) {
            this.character.update(delta);
        }
    }

    setSkin(skinName) {
        if (this.availableSkins.includes(skinName)) {
            this.currentSkin = skinName;
            this.character.loadSkin(`models/ratamahatta/skins/${skinName}.png`);
        }
    }

    setAnimation(animationName) {
        if (this.availableAnimations.includes(animationName)) {
            this.currentAnimation = animationName;
            this.character.animation(animationName);
        }
    }

    getCurrentSkin() {
        return this.currentSkin;
    }

    getAvailableSkins() {
        return this.availableSkins;
    }

    getAvailableAnimations() {
        return this.availableAnimations;
    }
}