// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MultiSkins is ERC721, Ownable {
    using Strings for uint256;

// Array that will store URIs for each skin
    string[4] private imageURIs;
    
    // Array to track number of mints for each skin
    uint256[4] public mintCounts;
        
    // Total number of skin NFTs minted
    uint256 private _skinIds;

    // Mapping from token ID to skin type
    mapping(uint256 => uint256) private _skinTypes;

    constructor(
        string memory name,
        string memory symbol,
        string[4] memory _imageURIs
    ) ERC721(name, symbol) Ownable(msg.sender) {  
        imageURIs = _imageURIs;
    }

    // Function to mint a specific type of skin NFT
    function mint(uint256 skinType) public {
        require(skinType < 4, "Invalid NFT type");
        
        _skinIds++;
        uint256 newSkinId = _skinIds;
        
        _safeMint(msg.sender, newSkinId);
        _skinTypes[newSkinId] = skinType;
        mintCounts[skinType]++;
    }

    // ✅ Public wrapper for _exists
    function tokenExists(uint256 tokenId) public view returns (bool) {
        return ownerOf(tokenId) != address(0);
    }



    // Function to get the URI for a specific skin
    function tokenURI(uint256 skinId) public view virtual override returns (string memory) {
        require(tokenExists(skinId), "Token does not exist");  
        
        uint256 skinType = _skinTypes[skinId];
        return imageURIs[skinType];
    }

    // Function to get mint count for a specific skin type
    function getMintCount(uint256 skinType) public view returns (uint256) {
        require(skinType < 4, "Invalid NFT type");
        return mintCounts[skinType];
    }

    // Function to update image URI for a specific type (only owner)
    function setImageURI(uint256 skinType, string memory newURI) public onlyOwner {
        require(skinType < 4, "Invalid NFT type");
        imageURIs[skinType] = newURI;
    }

    // Function to get all mint counts
    function getAllMintCounts() public view returns (uint256[4] memory) {
        return mintCounts;
    }

    // Function to get skin type for a specific token
    function getSkinType(uint256 skinId) public view returns (uint256) {
        require(tokenExists(skinId), "Token does not exist");
        return _skinTypes[skinId];
    }
}