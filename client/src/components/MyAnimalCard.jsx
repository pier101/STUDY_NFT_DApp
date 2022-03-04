import {
    Box,
    Button,
    Input,
    InputGroup,
    InputRightAddon,
    Text,
  } from "@chakra-ui/react";
  import React, { useState }  from "react";
  import AnimalCard from "./AnimalCard";
  
  const MyAnimalCard = ({
    animalTokenId,
    animalType,
    animalPrice,
    saleStatus,
    init
  }) => {

    const { web3 ,accounts, MAT_Contract, SAT_Contract, SAT_Contract_Address } = init
    const [sellPrice, setSellPrice] = useState("");
    const [myAnimalPrice, setMyAnimalPrice] = useState(animalPrice);

    const onChangeSellPrice = (e) => {
        setSellPrice(e.target.value);
    };

    const onClickSell = async () => {
        try {
        if (!accounts[0] || !saleStatus) return;

        const response = await SAT_Contract.methods
            .setForSaleAnimalToken(
            animalTokenId,
            web3.utils.toWei(sellPrice, "ether")
            )
            .send({ from: accounts[0] });

        if (response.status) {
            setMyAnimalPrice(web3.utils.toWei(sellPrice, "ether"));
        }
        } catch (error) {
        console.error(error);
        }
    };

    return (
      <Box textAlign="center" w={150}>
        <AnimalCard animalType={animalType} />
        <Box mt={2}>
        {myAnimalPrice === "0" ? (
          <>
            <InputGroup>
              <Input
                type="number"
                value={sellPrice}
                onChange={onChangeSellPrice}
              />
              <InputRightAddon children="Matic" />
            </InputGroup>
            <Button size="sm" colorScheme="green" mt={2} onClick={onClickSell}>
              Sell
            </Button>
          </>
          ) : (
            <Text d="inline-block">
                {web3.utils.fromWei(myAnimalPrice)} ETH
            </Text>
          )}
        </Box>
      </Box>
    );
  };
  
  export default MyAnimalCard;