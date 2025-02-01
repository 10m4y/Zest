"use client"

import { useWriteContract, useWaitForTransaction } from "wagmi";
import ExchangeABI from "../constants/ExchangeABI.json";
import { EXCHANGE_CONTRACT } from "../constants";
import { parseEther } from "viem";

export function TradeSkin({skinType}:{skinType:number}){

    const {data,write:tradeSkin}=useWriteContract({
        address:EXCHANGE_CONTRACT,
        abi:ExchangeABI,
        functionName:"tradeSkin",
        args:[skinType],
        value: parseEther("0.01"), // Adjust price
    });

    const { isLoading } = useWaitForTransaction({
        hash: data?.hash,
      });
      return (
        <button onClick={() => tradeSkin?.()} disabled={isLoading}>
          {isLoading ? "Buying..." : "Buy Skin"}
        </button>
      );
}