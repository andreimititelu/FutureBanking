var FutureBanking = artifacts.require("./FutureBanking.sol");

module.exports = function(deployer) {
  deployer.deploy(FutureBanking);
};
