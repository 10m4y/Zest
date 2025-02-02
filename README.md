# Zest

## How to run the game?

``npm install``

``npx vite``

```markdown
# Zest: NFT Skin Marketplace and Open World Game

Zest is an innovative platform that combines a blockchain-based NFT marketplace for in-game skins with an immersive open-world game. Players can buy, sell, and trade unique skins as NFTs, which can be used in the game environment.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Smart Contracts](#smart-contracts)
3. [Frontend](#frontend)
4. [Game](#game)
5. [Setup Instructions](#setup-instructions)
6. [Contributing](#contributing)
7. [License](#license)

## Project Overview

Zest consists of three main components:

1. **Smart Contracts**: Manage the creation, ownership, and trading of skin NFTs.
2. **Frontend Marketplace**: A Next.js application for listing, buying, and selling skins.
3. **Open World Game**: A Three.js-based game where players can use their NFT skins and discover new ones.

## Smart Contracts

The project uses three main Solidity contracts:

1. `MultiSkins.sol`: An ERC721 contract for minting and managing skin NFTs.
2. `Queue.sol`: A helper contract for managing seller queues.
3. `Exchange.sol`: Handles the listing and trading of skin NFTs.

Key features:
- Mint different types of skin NFTs
- List skins for sale
- Buy skins from other players
- Check availability of skins

## Frontend

The frontend marketplace is built with Next.js and provides an intuitive interface for users to interact with the smart contracts. It's located in the `marketplace` folder and includes features such as:

- Skin listings with visual previews
- Buy and sell functionality
- Wallet connection (MetaMask integration)
- User inventory management

## Game

The open-world game is built using Three.js and features:

- Minecraft-inspired UI
- Open world exploration
- Crates containing discoverable skins
- Integration with owned NFT skins

## Setup Instructions

Follow these steps to set up the Zest project locally:

1. Clone the repository:
```

git clone [https://github.com/your-username/zest.git](https://github.com/your-username/zest.git)
cd zest

```plaintext

2. Install dependencies:
```

npm install

```plaintext

3. Set up the smart contracts:
- Install Truffle: `npm install -g truffle`
- Compile contracts: `truffle compile`
- Deploy contracts (make sure you have a local blockchain running, e.g., Ganache):
```

truffle migrate --reset

```plaintext

4. Set up the frontend:
```

cd marketplace
npm install

```plaintext

5. Configure environment variables:
- Create a `.env.local` file in the `marketplace` directory
- Add the following variables:
```

NEXT_PUBLIC_CONTRACT_ADDRESS=`<deployed_contract_address>`
NEXT_PUBLIC_RPC_URL=`<your_ethereum_rpc_url>`

```plaintext

6. Run the frontend:
```

npm run dev

```plaintext

7. Set up the game:
```

- Navigate to the game directory
- Install dependencies: `npm install`
- Start the game: `npm start`