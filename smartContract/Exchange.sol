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
}

contract Exchange {
    MultiSkins multiSkins = MultiSkins(address(0)); // change the address of MultiSkins contract after deployment

    mapping(uint256 => Queue) public sellerQueues;
    uint256[4] public skinPrices = [0.01 ether, 0.02 ether, 0.03 ether, 0.04 ether];

    function listSkin(uint256 tokenId) external { // do not forget to call the approve function in MultiSkins contract along with this function to approve it for this contract
        address seller = msg.sender;

        require(msg.sender == multiSkins._owners(tokenId), "You are not the owner of this NFT");

        uint256 skinType = multiSkins._skinTypes(tokenId);
        sellerQueues[skinType].enqueue(msg.sender);
    }

    function tradeSkin(uint256 skinType) external{
        require(sellerQueues[skinType].last >= sellerQueues[skinType].first, "No sellers available");

        address buyer = msg.sender;
        uint256 price = skinPrices[skinType];
        uint256 tokenId = sellerQueues[skinType].queue[first];

        bool BuyerPayment = buyer.call{value: price}("");

        require(paymentSuccessful, "Buyer payment failed");

        bool sellerReceived = sellerQueues[skinType].dequeue().call{value: price}("");

        require(sellerReceived, "Seller payment failed");

        multiSkins.transferFrom(multiSkins._owners(tokenId), buyer, tokenId); // 'this' contract is already approved for that NFT
    }

    function checkAvailability(uint256 skinType) external view returns (uint256) {
        if(sellerQueues[skinType].last >= sellerQueues[skinType].first) {
            return sellerQueues[skinType].last - sellerQueues[skinType].first + 1;
        }
    }
}