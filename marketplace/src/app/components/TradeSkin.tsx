"use client"

import { useWriteContract, useTransaction } from "wagmi";
import ExchangeABI from "../components/abis/exchange.json";
import { EXCHANGE_CONTRACT } from "../components/constants";
import { parseEther } from "viem";
import { useState } from "react";

interface TradeSkinProps {

    skinType:number
    price?:string

}

export function TradeSkin({ skinType, price = "0.01" }: TradeSkinProps) {
    const { writeContract, data: hash } = useWriteContract()
    
    const { isLoading, isSuccess } = useTransaction({
      hash,
    })
    
    const handleTrade = () => {
      writeContract({
        address: EXCHANGE_CONTRACT,
        abi: ExchangeABI,
        functionName: "tradeSkin",
        args: [skinType],
        value: parseEther(price),
      })
    }
  
    return (
      <button 
        onClick={handleTrade} 
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isLoading ? "Buying..." : isSuccess ? "Purchase Complete!" : "Buy Skin"}
      </button>
    )
  }