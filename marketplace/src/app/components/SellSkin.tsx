"use client"


import { useWriteContract,useTransaction } from "wagmi";

import MultiSkinsABI from "../components/abis/multiSkinABI.json"; //ADD CORRECT PATH AFTER DEPLOY
import exchangeAbi from "../components/abis/exchange.json"; //ADD CORRECT PATH AFTER DEPLOY
import { MULTISKINS_CONTRACT, EXCHANGE_CONTRACT } from "../components/constants"; //ADD CORRECT PATH AFTER DEPLOY

import { useState } from "react";

// export const exchange = exchangeAbi.abi as const;
export function SellSkin({tokenId}:{tokenId:number}) {
    const [approved, setApproved] = useState(false);

    // Approve NFT transfer to Exchange Contract
  const {writeContract:writeApprove, data:approveHash} = useWriteContract()

  const { isLoading: isApproving } = useTransaction({
    hash: approveHash,
    // onSuccess: () => setApproved(true),
  })

  // List NFT for sale
  const {writeContract:writeList,data:listHash} = useWriteContract()
  const { isLoading: isListing } = useTransaction({
    hash: listHash,
  });

  const handleApprove = () => {

    writeApprove({
        address: MULTISKINS_CONTRACT,
        abi: MultiSkinsABI,
        functionName: "approve",
        args: [EXCHANGE_CONTRACT, tokenId],
    })
    setApproved(true);
  }

  const handleList=()=>{
    writeList({
        address: EXCHANGE_CONTRACT,
        abi: exchangeAbi,
        functionName: "listSkin",
        args: [tokenId=3],
    })
  }

  return (
    <div className="flex gap-2">
      <button 
        onClick={handleApprove} 
        disabled={isApproving || approved}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isApproving ? "Approving..." : approved ? "Approved" : "Approve"}
      </button>
      
      <button 
        onClick={handleList} 
        disabled={!approved || isListing}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        {isListing ? "Listing..." : "List for Sale"}
      </button>
    </div>
  )
}