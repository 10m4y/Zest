import { Game } from './game/game.js';
import axios from "axios";
import {ethers} from 'ethers';

let game;

async function connectMetamask() {
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
    }

    try {
        console.log("Connecting to MetaMask...");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        console.log("Requesting accounts...");
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Accounts:", accounts);
        
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log("Connected address:", address);
        
        document.getElementById('connect-button').textContent = 'Connected';
        document.getElementById('wallet-info').style.display = 'block';
        document.getElementById('wallet-info').textContent = `${address.slice(0, 6)}...${address.slice(-4)}`;
        
        await fetchNFTs(address);
    } catch (error) {
        console.error("Detailed error:", error);
        alert(`MetaMask Error: ${error.message || error}`);
    }
}

async function fetchNFTs(walletAddress) {
    try {
        const url = `https://api.opensea.io/api/v1/assets?owner=${walletAddress}&limit=50`;
        const response = await axios.get(url)

        const allNFTs = response.data.assets;
        const skinsNFTs = allNFTs.filter(nft =>
            nft.name.toLowerCase().includes('skin') ||
            nft.description?.toLowerCase().includes('skin') ||
            JSON.stringify(nft.traits || {}).toLowerCase().includes('skin')
        );

        if (skinsNFTs.length > 0) {
            updateGameCrates(skinsNFTs);
        }
    } catch (error) {
        console.error("Error fetching NFTs:", error);
    }
}

function updateGameCrates(skinsNFTs) {
    if (!game?.crates) return;

    // Get colors from NFTs or generate random ones
    const colors = skinsNFTs.map(nft => 
        nft.background_color ? 
        `#${nft.background_color}` : 
        `#${Math.floor(Math.random()*16777215).toString(16)}`
    );

    // Update existing crates with NFT colors
    game.crates.forEach((crate, index) => {
        if (colors[index]) {
            crate.mesh.material.color.setStyle(colors[index]);
        }
    });
}

window.onload = () => {
    game=new Game();
    document.getElementById('connect-button').addEventListener('click', connectMetamask);

};
