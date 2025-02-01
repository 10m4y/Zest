import { Game } from './game/game.js';

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
    if (!walletAddress || !walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new Error("Invalid wallet address format");
    }
    try {
        const url = `https://deep-index.moralis.io/api/v2/${walletAddress}/nft`;
        console.log("Fetching NFTs for wallet:", walletAddress); 
        const response = await axios.get(url, {
            headers: {
                "X-API-Key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImI5NzRlNmI2LTA4NWMtNDY0Ni04NTAzLTA0MjdkMThjZDQ3NCIsIm9yZ0lkIjoiNDI4NzYxIiwidXNlcklkIjoiNDQxMDM2IiwidHlwZUlkIjoiNGJkYzliMzktNjRhZC00NWZkLTk4NTktZjE2NzhmODA0ZTg3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mzg0MDYyOTAsImV4cCI6NDg5NDE2NjI5MH0.Uk-eecGq8n00z7Ky1yw1ubkibGKZc2g8uWCpBiBqdaE"
            },
            params: {
                chain: "sepolia",
                format: "decimal",
                limit:100
            }
        });
        if (!response.data || !response.data.result) {
            console.error("Invalid response format:", response.data);
            throw new Error("Invalid API response format");
        }

        const allNFTs = response.data.result;
        console.log(`Found ${allNFTs.length} NFTs total`); // Debugging
        console.log("All NFTs:", allNFTs); // Debugging

        const skinsNFTs = [];

        for (const nft of allNFTs) {
            let metadata = nft.metadata;
            
            // If metadata is a URL, fetch it
            if (metadata && metadata.startsWith("http")) {
                try {
                    const metaResponse = await axios.get(metadata);
                    metadata = metaResponse.data;
                } catch (err) {
                    console.warn("Error fetching metadata:", err);
                    continue; // Skip this NFT
                }
            } else if (metadata) {
                try {
                    metadata = JSON.parse(metadata);
                } catch (err) {
                    console.warn("Error parsing metadata:", err);
                    continue;
                }
            } else {
                continue; // Skip if metadata is null
            }

            console.log("Parsed Metadata:", metadata);

            if (metadata && metadata.attributes) {
                const skinTrait = metadata.attributes.find(attr => attr.trait_type.toLowerCase() === 'skincode');
                if (skinTrait) {
                    skinsNFTs.push(skinTrait.value);
                }
            }
        }

        if (skinsNFTs.length > 0) {
            console.log("Skin Colors:", skinsNFTs);
            window.updateSkinBar(skinsNFTs);
        } else {
            console.log("No skins found.");
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
  
function startGame(walletAddress) {
    console.log(`Game started for wallet: ${walletAddress}`);
    game = new Game();
}

window.onload = () => {
    const walletAddress = localStorage.getItem("wallet_address");
    if (walletAddress) {
        document.getElementById("connect-screen").style.display = "none";
        document.getElementById("game-container").style.display = "block";
        startGame(walletAddress);
    }
};