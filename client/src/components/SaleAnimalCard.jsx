import { Box, Button, Text } from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import AnimalCard from "./AnimalCard";



const SaleAnimalCard = ({
  animalType,
  animalPrice,
  animalTokenId,
  getOnSaleAnimalTokens,
  init
}) => {
    const {web3, MAT_Contract, SAT_Contract, accounts} = init;
    const [isBuyable, setIsBuyable] = useState(false);

    const onClickBuy = async () => {
        try {
          if (!accounts[0]) return;
    
          const response = await SAT_Contract.methods
            .purchaseAnimalToken(animalTokenId)
            .send({ from: accounts[0], value: animalPrice });
    
          if (response.status) {
            getOnSaleAnimalTokens();
          }
        } catch (error) {
          console.error(error);
        }
      };

    const getAnimalTokenOnwer = async () => {
        try {
          const response = await MAT_Contract.methods
            .ownerOf(animalTokenId)
            .call();
    
          setIsBuyable(response.toLocaleLowerCase() === accounts[0].toLocaleLowerCase());

        } catch (error) {
          console.error(error);
        }
    };
    
    useEffect(() => {
    getAnimalTokenOnwer();
    }, []);

    return (
        <Box textAlign="center" w={150}>
        <AnimalCard animalType={animalType} />
        <Box>
            <Text d="inline-block">{web3.utils.fromWei(animalPrice)} Matic</Text>
            <Button size="sm" colorScheme="green" m={2} disabled={isBuyable}  onClick={onClickBuy}>
            Buy
            </Button>
        </Box>
        </Box>
    );
};

export default SaleAnimalCard;