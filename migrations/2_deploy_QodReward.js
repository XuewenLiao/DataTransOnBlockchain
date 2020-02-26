var QodReward = artifacts.require("./QodReward.sol");

module.exports = function(deployer) {
  deployer.deploy(QodReward,"defaultaesPublicKey");
};
