const Auth = artifacts.require("Auth");
const Appointment = artifacts.require("Appointment");
const MedicalRecord = artifacts.require("MedicalRecord");

module.exports = async function(deployer) {
    // Deploy the Auth contract first
    await deployer.deploy(Auth);
    const authInstance = await Auth.deployed();

    // Deploy the Appointment contract next
    await deployer.deploy(Appointment, authInstance.address);
    const appointmentInstance = await Appointment.deployed();

    // Now deploy the MedicalRecord contract with the addresses of Auth and Appointment
    await deployer.deploy(MedicalRecord, authInstance.address, appointmentInstance.address);
};