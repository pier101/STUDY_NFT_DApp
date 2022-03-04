
import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MintAnimalToken from "./contracts/MintAnimalToken.json";
import SaleAnimalToken from "./contracts/SaleAnimalToken.json";

import getWeb3 from "./getWeb3";
import Layout from "./components/Layout";

import "./App.css";
import Main from "./routes/main";
import MyAnimal from "./routes/my-animal";
import SaleAnimal from "./routes/sale-animal";

const App = () => {
  const [web3, setWeb3] = useState()
  const [accounts, setAccounts] = useState()
  const [MAT_Contract, setMAT_Contract] = useState()
  const [SAT_Contract, setSAT_Contract] = useState()
  const [SAT_Contract_Address, setSAT_Contract_Address] = useState()


  const init = async () => {
    try {
      console.log("유즈이펙트1")

      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts(); 
      const networkId = await web3.eth.net.getId();
      const deployedNetwork_m = await MintAnimalToken.networks[networkId];
      const deployedNetwork_s = await SaleAnimalToken.networks[networkId];

      console.log(web3)
      console.log(accounts)
      console.log(networkId)

      //MintAnimalToken Contract
      const MAT_contract = await new web3.eth.Contract(
        MintAnimalToken.abi,
        deployedNetwork_m && deployedNetwork_m.address,
      );
      // SaleAnimalToken Contract
      const SAT_contract = await new web3.eth.Contract(
        SaleAnimalToken.abi,
        deployedNetwork_s && deployedNetwork_s.address,
      );

      setWeb3(web3);
      setAccounts(accounts);
      setMAT_Contract(MAT_contract)
      setSAT_Contract(SAT_contract)
      setSAT_Contract_Address(deployedNetwork_s.address)

    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  }

  useEffect(async () => {
    init();
  }, [])

//--------------------------------------------


const initialization = { web3, accounts, MAT_Contract, SAT_Contract ,SAT_Contract_Address};
    
  //----------------------------------------------------

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Main init={initialization}/>}></Route>
          <Route path="/my-animal" element={<MyAnimal init={initialization}/>}></Route>
          <Route path="/sale-animal" element={<SaleAnimal init={initialization}/>}></Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App