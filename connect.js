// import { ethers } from "ethers";
import axios from "axios";

async function connectMetamask() {
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
    }

    try {
        console.log("Connecting to MetaMask...");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        console.log("Connected address:", address);
        localStorage.setItem("wallet_address", address);

        document.getElementById('connect-button').textContent = 'Connected';
        document.getElementById('wallet-info').style.display = 'block';
        document.getElementById('wallet-info').textContent = `${address.slice(0, 6)}...${address.slice(-4)}`;

        // After connection, redirect to the game
        document.getElementById("connect-screen").style.display = "none";
        document.getElementById("game-container").style.display = "block";

        startGame(address); // Pass wallet address to the game
    } catch (error) {
        console.error("MetaMask connection error:", error);
        alert(`MetaMask Error: ${error.message || error}`);
    }
}

document.getElementById('connect-button').addEventListener('click', connectMetamask);
const defaultNFTDetails = {
  1: {
    image:
      "https://gateway.pinata.cloud/ipfs/bafkreidnt4fcdokrw5pterkwapf4mfqxnqq7smexmauomeyynptfrek66y",
    name: "skin_woman",
    description: "A brave warrior with unmatched skill.",
  },
  2: {
    image:
      "https://gateway.pinata.cloud/ipfs/bafkreiebl7cxougnm7p6cezszceu4ujjitouoyqxyevaedpqvcdlcoc5gq",
    name: "skin_adventurer",
    description: "An adventurous traveler seeking treasures.",
  },
};
const fetchNFTs = async (wallet_address) => {
  try {
    console.log("Fetching NFTs for wallet:", wallet_address);
    const url = `https://deep-index.moralis.io/api/v2/${wallet_address}/nft`;
    const response = await axios.get(url, {
      headers: {
        "X-API-Key":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImI5NzRlNmI2LTA4NWMtNDY0Ni04NTAzLTA0MjdkMThjZDQ3NCIsIm9yZ0lkIjoiNDI4NzYxIiwidXNlcklkIjoiNDQxMDM2IiwidHlwZUlkIjoiNGJkYzliMzktNjRhZC00NWZkLTk4NTktZjE2NzhmODA0ZTg3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mzg0MDYyOTAsImV4cCI6NDg5NDE2NjI5MH0.Uk-eecGq8n00z7Ky1yw1ubkibGKZc2g8uWCpBiBqdaE",
      },
      params: {
        chain: "sepolia",
        format: "decimal",
        limit: 100,
      },
    });

    const allNFTs = response.data.result;
    console.log(`Found ${allNFTs.length} NFTs total`); // Fixed template literal

    return allNFTs.map((nft) => {
        const tokenId = nft.token_id.toString(); // Ensure string key match
        const metadata = typeof nft.metadata === 'string' ? 
            JSON.parse(nft.metadata) : 
            nft.metadata || {};
        
        const defaultDetails = defaultNFTDetails[tokenId] || {
            image: '/default-nft.png',
            name: `skin_${tokenId}`, // Ensure default names have skin_ prefix
            description: 'A unique digital collectible'
        };
    
        return {
            id: tokenId,
            name: metadata.name || defaultDetails.name,
            image: metadata.image || defaultDetails.image,
            description: metadata.description || defaultDetails.description,
            contractAddress: nft.token_address,
            tokenURI: nft.token_uri
        };
    });
    
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
};

export { fetchNFTs };

// async function fetchNFTs(walletAddress) {
//     try {
//         const url = `https://deep-index.moralis.io/api/v2/nft/${walletAddress}`;
//         const response = await axios.get(url, {
//             headers: {
// "X-API-Key": process.env.MORALIS_API_KEY, // Replace with your actual API key
//             },
//         });

//         const allNFTs = response.data.result;

//         const skinsNFTs = allNFTs.filter(nft =>
//             nft.metadata &&
//             (nft.metadata.toLowerCase().includes('skin') ||
//             JSON.stringify(nft.metadata).toLowerCase().includes('skin'))
//         );

//         if (skinsNFTs.length > 0) {
//             const skinColors = skinsNFTs.map(nft => {
//                 if (nft.metadata) {
//                     const metadata = JSON.parse(nft.metadata);
//                     if (metadata.attributes) {
//                         const skinTrait = metadata.attributes.find(trait => trait.trait_type.toLowerCase() === 'skincode');
//                         return skinTrait ? skinTrait.value : null;
//                     }
//                 }
//                 return null;
//             }).filter(color => color);

//             window.updateSkinBar(skinColors);
//         } else {
//             console.log('No skins found');
//         }
//     } catch (error) {
//         console.error("Error fetching NFTs:", error);
//     }
// }

// function updateGameCrates(skinsNFTs) {
//     if (!game?.crates) return;

//     // Get colors from NFTs or generate random ones
//     const colors = skinsNFTs.map(nft =>
//         nft.background_color ?
//         `#${nft.background_color}` :
//         `#${Math.floor(Math.random()*16777215).toString(16)}`
//     );

//     // Update existing crates with NFT colors
//     game.crates.forEach((crate, index) => {
//         if (colors[index]) {
//             crate.mesh.material.color.setStyle(colors[index]);
//         }
//     });
// }

// window.onload = () => {
//     document.getElementById('connect-button').addEventListener('click', connectMetamask);

// };
