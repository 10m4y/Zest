import * as THREE from "three";
import { Cube } from "./cube.js";
import { Crate } from "./crate.js";
import { World } from "./world.js";
import { Controls } from "./controls.js";
import { Market } from "./market.js";

export class Game {
  constructor() {
    this.world = new World();
    this.cube = new Cube(this.world.scene);
    this.market = new Market(this.world.scene, new THREE.Vector3(8, 0.5, -8));
    this.controls = new Controls(this.cube);
    this.skins = new Set();

    const n = 5;
    this.crates = [];
    for (let i = 0; i < n; i++) {
      const randomX = (Math.random() - 0.25) * 10;
      const randomZ = (Math.random() - 0.25) * 10;
      const crate = new Crate(
        this.world.scene,
        new THREE.Vector3(randomX, 0.5, randomZ)
      );
      this.crates.push(crate);
    }

    this.dummySkins = ["ff5733", "33ff57", "5733ff", "f7a500", "ff5733"];
    this.isMarketOpen = false;
    this.currentMarketView = null;

    // Bind updateSkinBar to window with the correct context
    window.updateSkinBar = (skinColors) => {
      const skinBar = document.getElementById("skin");
      if (!skinBar) return;
      skinBar.innerHTML = "";

      // If skinColors is provided, update the skins Set
      if (skinColors && Array.isArray(skinColors)) {
        skinColors.forEach(color => {
          if (color) this.skins.add(color);
        });
      }

      this.skins.forEach((color) => {
        const skinBox = document.createElement("div");
        skinBox.className = "skin-box";
        skinBox.style.backgroundColor = `#${color}`;
        skinBox.onclick = () => {
          // Change cube color when clicking on a skin
          this.cube.mesh.material.color.setHex(parseInt(color, 16));
        };
        skinBar.appendChild(skinBox);
      });
    };

    this.initializeEventListeners();
    this.animate();
  }

  updateSkinBar() {
    window.updateSkinBar([]); // Call the window method with no new colors
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

  checkCrateCollision() {
    for (let i = this.crates.length - 1; i >= 0; i--) {
      const crate = this.crates[i];

      if (this.cube.mesh.position.distanceTo(crate.mesh.position) < 1) {
        this.cube.mesh.material.color.copy(crate.mesh.material.color);

        const skinCode = crate.mesh.material.color.getHexString();
        if (!this.skins.has(skinCode)) {
          this.skins.add(skinCode);
          window.updateSkinBar([skinCode]); // Pass as array
        }

        this.world.scene.remove(crate.mesh);
        this.crates.splice(i, 1);
      }
    }
  }

  checkMarketPopup() {
    const isNearMarket = this.cube.mesh.position.distanceTo(this.market.mesh.position) < 2;
    
    if (isNearMarket && !this.isMarketOpen) {
      this.isMarketOpen = true;
      this.showMarketMain();
    } else if (!isNearMarket && this.isMarketOpen) {
      this.closeMarket();
    }
  }

  buySkin(skinCode) {
    if (!this.skins.has(skinCode)) {
      this.skins.add(skinCode);
      this.updateSkinBar();
      this.showAvailableSkins();
      console.log(`Bought skin: ${skinCode}`);
    } else {
      console.log(`You already own this skin: ${skinCode}`);
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

    this.dummySkins.forEach((skinCode) => {
      if (!this.skins.has(skinCode)) {
        const skinBox = document.createElement("div");
        skinBox.className = "skin-box";
        skinBox.style.backgroundColor = `#${skinCode}`;

        const buyButton = document.createElement("button");
        buyButton.textContent = "Buy";
        buyButton.onclick = () => this.buySkin(skinCode);

        const skinContainer = document.createElement("div");
        skinContainer.appendChild(skinBox);
        skinContainer.appendChild(buyButton);

        buySkinList.appendChild(skinContainer);
      }
    });
  }

  listUserSkins() {
    const sellSkinList = document.getElementById("list-user-skins");
    if (!sellSkinList) return;
    sellSkinList.innerHTML = "";

    this.skins.forEach((skinCode) => {
      const skinBox = document.createElement("div");
      skinBox.className = "skin-box";
      skinBox.style.backgroundColor = `#${skinCode}`;

      const sellButton = document.createElement("button");
      sellButton.textContent = "Sell";
      sellButton.onclick = () => this.sellSkin(skinCode);

      const skinContainer = document.createElement("div");
      skinContainer.appendChild(skinBox);
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