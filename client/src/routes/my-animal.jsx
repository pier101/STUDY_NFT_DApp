import React ,{useState, useEffect} from 'react'
import {Grid, Flex, Text, Button} from "@chakra-ui/react";
import MyAnimalCard from '../components/MyAnimalCard';

const MyAnimal = (props) => {
    const { accounts, MAT_Contract, SAT_Contract_Address } = props.init
    console.log(SAT_Contract_Address)
    const [animalCardArr, setAnimalCaedArr] = useState();
    const [saleStatus, setSaleStatus] = useState(false);
    const [isSetSaleAnimalToken, setIsSetSaleAnimalToken] = useState(false);
    

    const getAnimalToken = async() =>{
        try {
            console.log(accounts)
            const balanceLength = await MAT_Contract.methods.balanceOf(accounts[0]).call();
            
            if (balanceLength === "0") return;
            const tempAnimalCardArray = [];
            const response = await MAT_Contract.methods
            .getAnimalTokens(accounts[0])
            .call();

            response.map(v => {
                tempAnimalCardArray.push({
                  animalTokenId: v.animalTokenId,
                  animalType: v.animalType,
                  animalPrice: v.animalPrice,
                });
              });

            console.log(tempAnimalCardArray)
            setAnimalCaedArr(tempAnimalCardArray);

        } catch (error) {
            console.error(error)
        }
    }

    // 판매권한 상태 가져오는 함수
    const getIsApprovedForAll = async () => {
        try {  
            const response =  await MAT_Contract.methods.isApprovedForAll(accounts[0],SAT_Contract_Address).call();
            
            if (response) {
                setSaleStatus(response);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // 판매권한 여부 토글 버튼
    const onClickApproveToggle = async () =>{
        try {
            const response = await MAT_Contract.methods.setApprovalForAll(SAT_Contract_Address, !saleStatus).send({from:accounts[0]});

            if (response.status) {
                setSaleStatus(!saleStatus);
            }
        } catch (error) {
            console.error(error)
        }
    }

    const setSaleAnimalToken = async () =>{
        try {
            await MAT_Contract.methods.setSaleAnimalToken(SAT_Contract_Address).send({from:accounts[0]});
            setIsSetSaleAnimalToken(true)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(async() => {
        if(!accounts) return;

        await getIsApprovedForAll();
        await getAnimalToken();
    }, [accounts])
    
    useEffect(() => {
        if (isSetSaleAnimalToken) return;
        setSaleAnimalToken();
    }, [])
    


  return (
    <>
        <Flex alignItems="center">
            <Text display="inline-block">Sale Status : {saleStatus? "True" : "False"}</Text>
            <Button size="xs" ml={2} colorScheme={saleStatus? "red" : "blue"} onClick={onClickApproveToggle}>
            {saleStatus? "Cancel" : "Approve"}
            </Button>
        </Flex >
        <Grid templateColumns="repeat(4,1fr)" gap={8} mt={4}>
            {animalCardArr && animalCardArr.map((v,i)=>{
                return (
                    <MyAnimalCard key={i}  
                    animalTokenId={v.animalTokenId}
                    animalType={v.animalType}
                    animalPrice={v.animalPrice}
                    saleStatus={saleStatus}
                    init={props.init}
                    />
                )
            })}
        </Grid>
    </>
  )
}

export default MyAnimal