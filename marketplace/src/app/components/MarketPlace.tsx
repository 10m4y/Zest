"use client"

import { useState } from "react";
import { SkinCard } from "./SkinCard";
import axios from "axios";
import { SellSkin } from "./SellSkin";
const fetchNFTs = async (walletAddress:string) => {
  try {
    console.log("Fetching NFTs for wallet:", walletAddress);
    const url = `https://deep-index.moralis.io/api/v2/nft/${walletAddress}`;
    const response = await axios.get(url, {
      headers: {
        "X-API-Key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImI5NzRlNmI2LTA4NWMtNDY0Ni04NTAzLTA0MjdkMThjZDQ3NCIsIm9yZ0lkIjoiNDI4NzYxIiwidXNlcklkIjoiNDQxMDM2IiwidHlwZUlkIjoiNGJkYzliMzktNjRhZC00NWZkLTk4NTktZjE2NzhmODA0ZTg3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mzg0MDYyOTAsImV4cCI6NDg5NDE2NjI5MH0.Uk-eecGq8n00z7Ky1yw1ubkibGKZc2g8uWCpBiBqdaE",
      },
    });

    // const allNFTs = response.data.result;

    return response.data.result
      .filter((nft) => nft.metadata && JSON.stringify(nft.metadata).toLowerCase().includes("skin"))
      .map((nft) => ({
        id: nft.token_id,
        name: nft.name || "Unknown Skin",
        image: nft.image || "/placeholder.svg",
      }));
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
};

export function Marketplace({ walletAddress }:{walletAddress:string}) {
    const [skins, setSkins] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
  
    const handleSellSkins = async () => {
      if (!walletAddress) {
        alert("Please connect your wallet first!");
        return;
      }
  
      const fetchedSkins = await fetchNFTs(walletAddress);
    //   console.log("Fetched skins:", fetchedSkins);
      setSkins(fetchedSkins);
      setIsDialogOpen(true);
    };
  
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <button onClick={handleSellSkins} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
          Sell Skins
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skins.map((skin) => (
            <div key={skin.id} className="border p-2">
              <img src={skin.image} alt={skin.name} className="w-full h-32 object-cover" />
              <p className="text-center mt-2">{skin.name}</p>
              <SellSkin tokenId={skin.id} />
            </div>
          ))}
        </div>
  
        {/* Dialog for selling skins */}
        {isDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
              <h2 className="text-xl font-bold">Select Skins to Sell</h2>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {skins.map((skin) => (
                  <div key={skin.id} className="border p-2">
                    <img src={skin.image} alt={skin.name} className="w-full h-32 object-cover" />
                    <p className="text-center mt-2">{skin.name}</p>
                    <SellSkin tokenId={skin.id} />
                  </div>
                ))}
              </div>
              <button onClick={() => setIsDialogOpen(false)} className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
