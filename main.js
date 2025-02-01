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
        const url = `https://deep-index.moralis.io/api/v2/nft/${walletAddress}`;
        const response = await axios.get(url, {
            headers: {
                // "X-API-Key": process.env.MORALIS_API_KEY, // Replace with your actual API key
                "X-API-Key":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImI5NzRlNmI2LTA4NWMtNDY0Ni04NTAzLTA0MjdkMThjZDQ3NCIsIm9yZ0lkIjoiNDI4NzYxIiwidXNlcklkIjoiNDQxMDM2IiwidHlwZUlkIjoiNGJkYzliMzktNjRhZC00NWZkLTk4NTktZjE2NzhmODA0ZTg3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mzg0MDYyOTAsImV4cCI6NDg5NDE2NjI5MH0.Uk-eecGq8n00z7Ky1yw1ubkibGKZc2g8uWCpBiBqdaE"
            },
        });

        const allNFTs = response.data.result;

        const skinsNFTs = allNFTs.filter(nft =>
            nft.metadata &&
            (nft.metadata.toLowerCase().includes('skin') ||
            JSON.stringify(nft.metadata).toLowerCase().includes('skin'))
        );

        if (skinsNFTs.length > 0) {
            const skinColors = skinsNFTs.map(nft => {
                if (nft.metadata) {
                    const metadata = JSON.parse(nft.metadata);
                    if (metadata.attributes) {
                        const skinTrait = metadata.attributes.find(trait => trait.trait_type.toLowerCase() === 'skincode');
                        return skinTrait ? skinTrait.value : null;
                    }
                }
                return null;
            }).filter(color => color); // Remove null values

            window.updateSkinBar(skinColors);
        } else {
            console.log('No skins found');
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
