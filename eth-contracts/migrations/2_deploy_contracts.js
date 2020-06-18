// migrating the appropriate contracts
var verifier = artifacts.require("./verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = async function(deployer) {
  await deployer.deploy(verifier);
  await deployer.deploy(SolnSquareVerifier, verifier.address);
};