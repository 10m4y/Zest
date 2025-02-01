"use client"


import { useWriteContract, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

import MultiSkinsABI from "../abis/MultiSkins.json"; //ADD CORRECT PATH AFTER DEPLOY
import exchangeABI from "../abis/Exchange.json"; //ADD CORRECT PATH AFTER DEPLOY
import { MULTISKINS_CONTRACT, EXCHANGE_CONTRACT } from "../constants"; //ADD CORRECT PATH AFTER DEPLOY

import { useState } from "react";

export function SellSkin({tokenId}:{tokenId:number}) {
    const [approved, setApproved] = useState(false);

    // Approve NFT transfer to Exchange Contract
  const { data: approveData, write: approve } = useWriteContract({
    address: MULTISKINS_CONTRACT,
    abi: MultiSkinsABI,
    functionName: "approve",
    args: [EXCHANGE_CONTRACT, tokenId],
  });

  const { isLoading: isApproving } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: () => setApproved(true),
  });

  // List NFT for sale
  const { data: listData, write: listSkin } = useWriteContract({
    address: EXCHANGE_CONTRACT,
    abi: ExchangeABI,
    functionName: "listSkin",
    args: [tokenId],
  });

  const { isLoading: isListing } = useWaitForTransaction({
    hash: listData?.hash,
  });

  return (
    <div>
      <button onClick={() => approve?.()} disabled={isApproving || approved}>
        {isApproving ? "Approving..." : approved ? "Approved" : "Approve"}
      </button>
      <button onClick={() => listSkin?.()} disabled={!approved || isListing}>
        {isListing ? "Listing..." : "List for Sale"}
      </button>
    </div>
  );
}