// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MultiSkins.sol";

contract Queue {
    address[] public queue;
    uint256 first = 1;
    uint256 last = 0;

    function enqueue(address data) public {
        last += 1;
        queue[last] = data;
    }

    function dequeue() public returns (address) {
        if (last < first) {
            revert("Queue is empty");
        }
        address value = queue[first];
        delete queue[first];
        first += 1;
        return value;
    }

    // Getter for 'last'
    function getLast() public view returns (uint256) {
        return last;
    }

    // Getter for 'first'
    function getFirst() public view returns (uint256) {
        return first;
    }
}

contract Exchange {
    MultiSkins multiSkins = MultiSkins(0x2213ddB69ef531E112Ec3677c5A96A653cD94C05); // Correct address of MultiSkins contract after its deployment

    mapping(uint256 => Queue) public sellerQueues;
    uint256[4] public skinPrices = [0.01 ether, 0.02 ether, 0.03 ether, 0.04 ether];

    function listSkin(uint256 tokenId) external {
        require(msg.sender == multiSkins.ownerOf(tokenId), "You are not the owner of this NFT");

        uint256 skinType = multiSkins.getSkinType(tokenId);
        sellerQueues[skinType].enqueue(msg.sender);
    }

    function buySkin(uint256 skinType) external {
        require(sellerQueues[skinType].getLast() >= sellerQueues[skinType].getFirst(), "No sellers available");

        address buyer = msg.sender;
        uint256 price = skinPrices[skinType];
        uint256 tokenId = sellerQueues[skinType].getFirst();

        (bool paymentSuccessful, ) = buyer.call{value: price}("");
        require(paymentSuccessful, "Buyer payment failed");

        // Dequeue and pay the seller
        address seller = sellerQueues[skinType].dequeue();
        (bool sellerReceived, ) = seller.call{value: price}("");
        require(sellerReceived, "Seller payment failed");

        // Transfer the NFT
        multiSkins.transferFrom(multiSkins.ownerOf(tokenId), buyer, tokenId); // 'this' contract is already approved for that NFT
    }

    function checkAvailability(uint256 skinType) external view returns (uint256 available) {
        if (sellerQueues[skinType].getLast() >= sellerQueues[skinType].getFirst()) {
            return sellerQueues[skinType].getLast() - sellerQueues[skinType].getFirst() + 1;
        }
    }
}