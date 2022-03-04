import React from 'react'
import { Stack,Flex,Box,Text,Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
const Layout = ({children}) => {


  return (
      <Stack h="100vh"  bgGradient='linear(to-l, #fcfdfd, #cacecb)'>
          <Flex bg="#234E52" p={4} justifyContent="space-around" alignItems="center">
            <Box>
                <Text color="white" fontWeight="bold"  bgClip='text' bgGradient='linear(to-l, #88bfdf, #7dcc8e)'>wooks-Animals</Text>
            </Box>
            <Link to="/">
                <Button size="sm" colorScheme="orange">Main</Button>
            </Link>
            <Link to="/my-animal">
                <Button size="sm" colorScheme="orange">My-animal</Button>
            </Link>
            <Link to="/sale-animal">
                <Button size="sm" colorScheme="orange">Sale-animal</Button>
            </Link>
          </Flex>
           <Flex direction="column" h="full" justifyContent="center" alignItems="center" >
               {children}
           </Flex>
      </Stack>
  )
}

export default Layout