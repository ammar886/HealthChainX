const Auth = artifacts.require("Auth");
const Appointment = artifacts.require("Appointment");


module.exports = function (deployer) {
  deployer.deploy(Auth);
  deployer.deploy(Appointment);
  
};
