'use client'

import { Marketplace } from "./components/MarketPlace"
import { LoginButton } from "./components/LoginButton"
import { useState } from "react";

export default function Home() {

  const [walletAddress, setWalletAddress] = useState("");
  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Skin Marketplace</h1>
          <LoginButton onLogin={setWalletAddress} />
        </div>
      </header>
      <Marketplace walletAddress={walletAddress}/>
    </main>
  )
}

