
import React, { useEffect, useState } from "react";
import { Grid } from "@chakra-ui/react";
import SaleAnimalCard from "../components/SaleAnimalCard";

const SaleAnimal= (props) => {
    const { MAT_Contract, SAT_Contract,web3 } = props.init
    const [saleAnimalCardArray, setSaleAnimalCardArray] = useState();

  const getOnSaleAnimalTokens = async () => {
    try {
      const onSaleAnimalTokenArrayLength = await SAT_Contract.methods
        .getOnSaleAnimalTokenArrayLength()
        .call();

      const tempOnSaleArray= [];

      for (let i = 0; i < parseInt(onSaleAnimalTokenArrayLength, 10); i++) {
        const animalTokenId = await SAT_Contract.methods
          .onSaleAnimalTokenArray(i)
          .call();
          
          const animalType = await MAT_Contract.methods
          .animalTypes(animalTokenId)
          .call();
          
          const animalPrice = await SAT_Contract.methods
          .animalTokenPrices(animalTokenId)
          .call();

        tempOnSaleArray.push({ animalTokenId, animalType, animalPrice });
      }

      setSaleAnimalCardArray(tempOnSaleArray);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOnSaleAnimalTokens();
  }, []);


  return (
    <Grid mt={4} templateColumns="repeat(4, 1fr)" gap={8}>
      {saleAnimalCardArray &&
        saleAnimalCardArray.map((v, i) => {
          return (
            <SaleAnimalCard
              key={i}
              animalType={v.animalType}
              animalPrice={v.animalPrice}
              animalTokenId={v.animalTokenId}
              getOnSaleAnimalTokens={getOnSaleAnimalTokens}
              init={props.init}
            />
          );
        })}
    </Grid>
  );
};

export default SaleAnimal;