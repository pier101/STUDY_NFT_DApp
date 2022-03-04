var MintAnimalToken = artifacts.require("./MintAnimalToken.sol");
var SaleAnimalToken = artifacts.require("./SaleAnimalToken.sol");

module.exports = async function (deployer) {
  await deployer.deploy(MintAnimalToken);
  await deployer.deploy(SaleAnimalToken, MintAnimalToken.address);
};
