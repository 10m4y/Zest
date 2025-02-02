"use client"

import { useState } from "react";
import axios from "axios";
import { SellSkin } from "./SellSkin";
import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 
// Create Wagmi config
const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http()
  }
});

// Create Query client for Wagmi
const queryClient = new QueryClient();

// Default mapping for NFT images and details
const defaultNFTDetails = {
  '1': {
    image: "https://gateway.pinata.cloud/ipfs/bafkreidnt4fcdokrw5pterkwapf4mfqxnqq7smexmauomeyynptfrek66y",
    name: 'Epic Skin #2',
    description: 'A rare collectible skin'
  },
  '3': {
    image: "https://gateway.pinata.cloud/ipfs/bafkreiebl7cxougnm7p6cezszceu4ujjitouoyqxyevaedpqvcdlcoc5gq",
    name: 'Legendary Skin #2',
    description: 'Limited edition skin'
  },
  '2': {
    image: "https://gateway.pinata.cloud/ipfs/bafkreidnt4fcdokrw5pterkwapf4mfqxnqq7smexmauomeyynptfrek66y",
    name: 'Legendary Skin #2',
    description: 'Limited edition skin'
  }
};

const fetchNFTs = async (walletAddress) => {
  try {
    console.log("Fetching NFTs for wallet:", walletAddress);
    const url = `https://deep-index.moralis.io/api/v2/${walletAddress}/nft`;
    const response = await axios.get(url, {
      headers: {
        "X-API-Key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImNmZDAwZDFlLWZhYTEtNGI1NC05ZGUzLWQ3MzRlYTlmY2U2YiIsIm9yZ0lkIjoiNDI4OTA1IiwidXNlcklkIjoiNDQxMTgxIiwidHlwZUlkIjoiYzlmZmIxNGQtOTJjNy00MDFlLTk3NzQtNzczZGY0YmI5M2FlIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mzg0NTQ4MjgsImV4cCI6NDg5NDIxNDgyOH0.IdPcRyN27fN0KnEgTaRkBif-p_I56DcnOUtQTG64rGs",
      },
      params: {
        chain: "sepolia",
        format: "decimal",
        limit: 100
      }
    });

    const allNFTs = response.data.result;
    console.log(`Found ${allNFTs.length} NFTs total`);
    console.log("NFTs:", allNFTs);
    return allNFTs.map((nft) => {
      const tokenId = nft.token_id;
      const defaultDetails = defaultNFTDetails[tokenId] || {
        image: '/default-nft.png',
        name: `NFT #${tokenId}`,
        description: 'A unique digital collectible'
      };

      return {
        id: tokenId,
        name: nft.name || defaultDetails.name,
        image: nft.metadata?.image || defaultDetails.image,
        description: nft.metadata?.description || defaultDetails.description,
        contractAddress: nft.token_address,
        tokenURI: nft.token_uri
      };
    });
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
};

function MarketplaceContent({ walletAddress }) {
  const [nfts, setNFTs] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSellNFTs = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet first!");
      return;
    }

    const fetchedNFTs = await fetchNFTs(walletAddress);
    setNFTs(fetchedNFTs);
    setIsDialogOpen(true);
    console.log("Fetched NFTs:", fetchedNFTs);
  };

  const NFTCard = ({ nft }) => (
    <div className="border rounded-lg p-4 bg-white shadow-md">
      <img 
        src={nft.image} 
        alt={nft.name} 
        className="w-full h-48 object-cover rounded-md"
        onError={(e) => {
          e.target.src = '/default-nft.png';
        }}
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold">{nft.name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{nft.description}</p>
        <div className="mt-4">
          <SellSkin tokenId={nft.id} price="0.1"/>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <button 
        onClick={handleSellNFTs} 
        className="mb-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-md"
      >
        List NFTs for Sale
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">List NFTs for Sale</h2>
              <button 
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nfts.map((nft) => (
                <NFTCard key={nft.id} nft={nft} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapped Marketplace component with required providers
export function Marketplace({ walletAddress }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MarketplaceContent walletAddress={walletAddress} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}