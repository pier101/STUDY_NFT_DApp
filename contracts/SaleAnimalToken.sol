// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./MintAnimalToken.sol";

contract SaleAnimalToken {
    MintAnimalToken public mintAnimalTokenAddress;

    constructor (address _mintAnimalTokenAddress) {
        mintAnimalTokenAddress = MintAnimalToken(_mintAnimalTokenAddress);
    }

    //토큰별 가격
    mapping(uint256 => uint256) public animalTokenPrices;

    //판매중인 토큰
    uint256[] public onSaleAnimalTokenArray;

    // @ 판매 함수
    function setForSaleAnimalToken(uint256 _animalTokenId, uint256 _price) public {
        // 토큰 주인
        address animalTokenOwner = mintAnimalTokenAddress.ownerOf(_animalTokenId);

        //주인이어야 등록
        require(animalTokenOwner == msg.sender, "Caller is not aninal token owner.");
        require(_price > 0 , "price is zero or lower");
        require(animalTokenPrices[_animalTokenId] == 0,"this animal token is already on a sale");
        // 토큰 소유자에게 판매 권한을 받아야 됨
        require(mintAnimalTokenAddress.isApprovedForAll(animalTokenOwner, address(this)), "Animal token owner did not approve token.");
    
        animalTokenPrices[_animalTokenId] = _price;

        // 판매중인 토큰에 매개변수 넣음
        onSaleAnimalTokenArray.push(_animalTokenId);
    
    }

    // 구매 함수
    function purchaseAnimalToken(uint256 _animalTokenId) public payable{
        uint256 price = animalTokenPrices[_animalTokenId];
        address animalTokenOwner = mintAnimalTokenAddress.ownerOf(_animalTokenId);
        require(price > 0, "Animal token not sale.");
        require(price <= msg.value, "Caller sent lower than price");
        require(animalTokenOwner != msg.sender, "Caller is aninal token owner.");
    
        payable(animalTokenOwner).transfer(msg.value);

        mintAnimalTokenAddress.safeTransferFrom(animalTokenOwner, msg.sender, _animalTokenId); //토큰 구매자에게 이동
        
        animalTokenPrices[_animalTokenId] = 0;

        for(uint256 i=0; i < onSaleAnimalTokenArray.length; i++){
            if(animalTokenPrices[onSaleAnimalTokenArray[i]] == 0){
                onSaleAnimalTokenArray[i] = onSaleAnimalTokenArray[onSaleAnimalTokenArray.length - 1];
                onSaleAnimalTokenArray.pop();
            }
        }
    }

    // 길이를 통해 for문 돌려서 프론트에 판매중인 리스트 가져올 용도
    function getOnSaleAnimalTokenArrayLength() view public returns(uint256){
        return onSaleAnimalTokenArray.length;
    }

    // CODE!
    function getAnimalTokenPrice(uint256 _animalTokenId) view public returns (uint256) {
        return animalTokenPrices[_animalTokenId];
    }

}