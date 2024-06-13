const Auth = artifacts.require("Auth");
const Appointment = artifacts.require("Appointment");

module.exports = function(deployer) {
  deployer.deploy(Auth).then(function(authInstance) {
    return deployer.deploy(Appointment, authInstance.address);
  });
};