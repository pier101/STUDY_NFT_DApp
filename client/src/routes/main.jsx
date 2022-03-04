import React, {useState} from "react";
import { Box, Flex, Text,Button } from "@chakra-ui/react";
import AnimalCard from "../components/AnimalCard";

const Main = (props) =>{
    const { accounts, MAT_Contract } = props.init
    
    const [newAnimalType, setNewAnimalType] = useState();

    const onClickMint = async() =>{
        try {
            if (!accounts[0]) return;

            const response = await MAT_Contract.methods.mintAnimalToken().send({from:accounts[0]})
            
            if (response.status) {
                // 길이 반환
                const balanceLength = await MAT_Contract.methods.balanceOf(accounts[0]).call();
                console.log(typeof balanceLength)
                // 길이 참조해서 가장 최근에 생성된 인덱스 반환
                const animalTokenId = await MAT_Contract.methods.tokenOfOwnerByIndex(accounts[0], parseInt(balanceLength,10)-1).call();
                console.log(animalTokenId)
                // 인덱스 참조해서 애니멀 타입 반환
                const animalType = await MAT_Contract.methods.animalTypes(animalTokenId).call();
                console.log(animalType)

                setNewAnimalType(animalType);
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Flex  w="full"
            h="100vh"
            justifyContent="center"
            alignItems="center"
            direction="column"
        >
            <Box>
                {newAnimalType ? <AnimalCard animalType={newAnimalType}/> : <Text>Let's mint Animal Card!!</Text>}
            </Box>
            <Button mt={4} size="sm" colorScheme="blue" onClick={onClickMint}>Mint</Button>
        </Flex>   
    )
};

export default Main;