import * as THREE from "three";
import { Cube } from "./cube.js";
import { Crate } from "./crate.js";
import { World } from "./world.js";
import { Controls } from "./controls.js";
import { Market } from "./market.js";

export class Game {
  constructor() {
    this.world = new World();
    this.cube = new Cube(this.world.scene, this.world);
    this.market = new Market(this.world.scene, new THREE.Vector3(8, 0.5, -8));
    this.controls = new Controls(this.cube);
    this.skins = new Set();
    this.equippedSkin = "skin_man";

    // Available skins from Blocky Characters
    this.availableSkins = [
      "skin_man",
      "skin_woman",
      "skin_orc",
      "skin_robot",
      "skin_soldier",
      "skin_adventurer",
    ];

    const n = 5;
    this.crates = [];
    for (let i = 0; i < n; i++) {
      const randomX = (Math.random() - 0.25) * 10;
      const randomZ = (Math.random() - 0.25) * 10;
      const crate = new Crate(
        this.world.scene,
        new THREE.Vector3(randomX, 0.5, randomZ),
        this.availableSkins[
          Math.floor(Math.random() * this.availableSkins.length)
        ]
      );
      this.crates.push(crate);
    }

    this.isMarketOpen = false;
    this.currentMarketView = null;

    this.initializeEventListeners();
    this.animate();
  }

  initializeEventListeners() {
    document.getElementById("close-market").addEventListener("click", () => {
      this.closeMarket();
    });

    document.getElementById("buy-skin-button").addEventListener("click", () => {
      this.showBuyView();
    });

    document
      .getElementById("sell-skin-button")
      .addEventListener("click", () => {
        this.showSellView();
      });

    document.getElementById("Buy").addEventListener("click", () => {
      this.showMarketMain();
    });

    document.getElementById("Sell").addEventListener("click", () => {
      this.showMarketMain();
    });
  }

  showMarketMain() {
    this.currentMarketView = "main";
    document.getElementById("market-popup").style.display = "block";
    document.getElementById("buy-skin").style.display = "none";
    document.getElementById("sell-skin").style.display = "none";
    this.isMarketOpen = true;
  }

  showBuyView() {
    this.currentMarketView = "buy";
    document.getElementById("market-popup").style.display = "none";
    document.getElementById("buy-skin").style.display = "block";
    document.getElementById("sell-skin").style.display = "none";
    this.showAvailableSkins();
  }

  showSellView() {
    this.currentMarketView = "sell";
    document.getElementById("market-popup").style.display = "none";
    document.getElementById("buy-skin").style.display = "none";
    document.getElementById("sell-skin").style.display = "block";
    this.listUserSkins();
  }

  closeMarket() {
    this.isMarketOpen = false;
    this.currentMarketView = null;
    document.getElementById("market-popup").style.display = "none";
    document.getElementById("buy-skin").style.display = "none";
    document.getElementById("sell-skin").style.display = "none";
  }

  updateSkinBar() {
    const skinBar = document.getElementById("skin");
    if (!skinBar) return;
    skinBar.innerHTML = "";

    this.skins.forEach((skinName) => {
      const skinContainer = document.createElement("div");
      skinContainer.className = "skin-box";

      const img = document.createElement("img");
      img.src = `assets/blocky-chars/Skins/Basic/${skinName}.png`;
      img.className = "skin-preview";

      skinContainer.appendChild(img);
      skinBar.appendChild(skinContainer);
    });
  }

  checkCrateCollision() {
    for (let i = this.crates.length - 1; i >= 0; i--) {
      const crate = this.crates[i];
      const distance = this.cube.mesh.position.distanceTo(crate.mesh.position);

      if (distance < 1.5) {
        if (!this.skins.has(crate.skinCode)) {
          this.skins.add(crate.skinCode);
          this.updateSkinBar();
          this.equipSkin(crate.skinCode);
        }

        this.world.scene.remove(crate.mesh);
        this.crates.splice(i, 1);
      }
    }
  }

  checkMarketPopup() {
    const isNearMarket =
      this.cube.mesh.position.distanceTo(this.market.mesh.position) < 2;

    if (isNearMarket && !this.isMarketOpen) {
      this.isMarketOpen = true;
      this.showMarketMain();
    } else if (!isNearMarket && this.isMarketOpen) {
      this.closeMarket();
    }
  }

  equipSkin(skinName) {
    if (this.skins.has(skinName)) {
      this.equippedSkin = skinName;
      this.applySkinToCharacter(skinName);
      console.log(`Equipped skin: ${skinName}`);
    } else {
      console.log(`You don't own this skin: ${skinName}`);
    }
  }

  applySkinToCharacter(skinName) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      `assets/blocky-chars/Skins/Basic/${skinName}.png`,
      (texture) => {
        if (this.cube.applyTexture) {
          this.cube.applyTexture(texture);
        }
      },
      undefined,
      (error) => {
        console.error("Error loading skin texture:", error);
      }
    );
  }

  buySkin(skinName) {
    if (!this.skins.has(skinName)) {
      this.equipSkin(skinName);
      this.applySkinToCharacter(skinName);
      this.skins.add(skinName);
      this.updateSkinBar();
      this.showAvailableSkins();
    }
  }

  sellSkin(skinCode) {
    if (this.skins.has(skinCode)) {
      this.skins.delete(skinCode);
      this.updateSkinBar();
      this.listUserSkins();
      console.log(`Sold skin: ${skinCode}`);
    } else {
      console.log(`You don't own this skin: ${skinCode}`);
    }
  }

  showAvailableSkins() {
    const buySkinList = document.getElementById("buy-skin-list");
    if (!buySkinList) return;
    buySkinList.innerHTML = "";

    this.availableSkins.forEach((skinName) => {
      if (!this.skins.has(skinName)) {
        const skinContainer = document.createElement("div");
        skinContainer.className = "skin-item";

        const img = document.createElement("img");
        img.src = `assets/blocky-chars/Skins/Basic/${skinName}.png`;
        img.className = "skin-preview";

        const buyButton = document.createElement("button");
        buyButton.textContent = `Buy ${skinName.split("_")[1]}`;
        buyButton.onclick = () => this.buySkin(skinName);

        skinContainer.appendChild(img);
        skinContainer.appendChild(buyButton);
        buySkinList.appendChild(skinContainer);
      }
    });
  }

  listUserSkins() {
    const sellSkinList = document.getElementById("list-user-skins");
    if (!sellSkinList) return;
    sellSkinList.innerHTML = "";

    this.skins.forEach((skinName) => {
      const skinContainer = document.createElement("div");
      skinContainer.className = "skin-item";

      const img = document.createElement("img");
      img.src = `assets/blocky-chars/Skins/Basic/${skinName}.png`;
      img.className = "skin-preview";

      const sellButton = document.createElement("button");
      sellButton.textContent = "Sell";
      sellButton.onclick = () => this.sellSkin(skinName);

      skinContainer.appendChild(img);
      skinContainer.appendChild(sellButton);
      sellSkinList.appendChild(skinContainer);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.checkCrateCollision();
    this.checkMarketPopup();
    this.world.render(this.cube);
  }
}
