// migrating the appropriate contracts
var verifier = artifacts.require("./verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function(deployer) {
  deployer.deploy(verifier).then(() => {
    deployer.deploy(SolnSquareVerifier, verifier.address)
  });
}