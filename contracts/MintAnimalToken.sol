// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

// SaleAnimalToken.sol 은 MintAnimalToken에 종속 되어 있기 떄문에
// 여기서 SaleAnimalToken을 사용하려면 import 로 가져와야 됨
import "./SaleAnimalToken.sol";

contract MintAnimalToken is ERC721Enumerable {
    constructor() ERC721("h662Animals", "HAS"){}

    SaleAnimalToken public saleAnimalToken;

    // 구조체 설정 (CODE!: 프론트에서 요청했던걸 솔리디티에서 처리하도록 리팩토링 중-> 페이지 성능 향상 목적)
    struct AnimalTokenData {
        uint256 animalTokenId;
        uint256 animalType;
        uint256 animalPrice;
    }
    //토큰별 타입
    mapping(uint256=>uint256) public animalTypes;

    function mintAnimalToken() public {
        uint256 animalTokenId = totalSupply() + 1;
        uint256 animalType = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, animalTokenId)))  % 5 + 1;

        animalTypes[animalTokenId] = animalType;

        _mint(msg.sender, animalTokenId);
    }

    // CODE! 
     function getAnimalTokens(address _animalTokenOwner) view public returns (AnimalTokenData[] memory) {
        uint256 balanceLength = balanceOf(_animalTokenOwner);

        require(balanceLength != 0, "Owner did not have token.");

        AnimalTokenData[] memory animalTokenData = new AnimalTokenData[](balanceLength);

        for(uint256 i = 0; i < balanceLength; i++) {
            uint256 animalTokenId = tokenOfOwnerByIndex(_animalTokenOwner, i);
            uint256 animalType = animalTypes[animalTokenId];
            uint256 animalPrice = saleAnimalToken.getAnimalTokenPrice(animalTokenId);

            animalTokenData[i] = AnimalTokenData(animalTokenId, animalType, animalPrice);
        }

        return animalTokenData;
    }

    // CODE!
    function setSaleAnimalToken(address _saleAnimalToken) public {
        saleAnimalToken = SaleAnimalToken(_saleAnimalToken);
    }
}


//remixd -s . --remix-ide https://remix.ethereum.org

/* 
    balanceOf(address) : 갖고 있는 NFT 갯수
    tokenOfOwnerByIndex(address, index) : 뽑은 NFT의 토큰id
    animalType(index): 특정 NFT
 */ 

