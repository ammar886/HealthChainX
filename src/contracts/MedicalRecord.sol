// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
import "./Auth.sol";
import "./Appointment.sol";

contract MedicalRecord {
    Auth auth;
    Appointment appointment;

    constructor(address _authAddress, address _appointmentAddress) {
        auth = Auth(_authAddress);
        appointment = Appointment(_appointmentAddress);
    }

    uint public totalPrescriptions = 0; 
    prescription[] public allPrescriptions;

    // New mappings
    mapping(address => prescription[]) prescriptionsByDoctorAddress;
    mapping(address => prescription[]) prescriptionsByPatientAddress;

    struct prescription {
        address doctorAddress;
        address patientAddress;
        string appointmentDate;
        string timeSlot;
        string clinicalNotes;
        string prescriptionDetails;
    }

    event prescriptionCreated(
        address doctorAddress,
        address patientAddress,
        string appointmentDate,
        string timeSlot,
        string clinicalNotes,
        string prescriptionDetails
    );

    function storePrescription(
        address _doctorAddress,
        address _patientAddress,
        uint _index,
        string memory _appointmentDate,
        string memory _timeSlot,
        string memory _clinicalNotes,
        string memory _prescriptionDetails
    ) public {
        // Create a new prescription object
        prescription memory newPrescription = prescription({
            doctorAddress: _doctorAddress,
            patientAddress: _patientAddress,
            appointmentDate: _appointmentDate,
            timeSlot: _timeSlot,
            clinicalNotes: _clinicalNotes,
            prescriptionDetails: _prescriptionDetails
        });

        // Store the new prescription in the mappings
        prescriptionsByDoctorAddress[_doctorAddress].push(newPrescription); // Update mapping for owner
        prescriptionsByPatientAddress[_patientAddress].push(newPrescription); // Update mapping for patient

        // Also store it in the global array of all prescriptions
        allPrescriptions.push(newPrescription);

        // Increment the total number of prescriptions
        totalPrescriptions += 1;

        // Call the function on the Appointment contract
        appointment.updateAppointmentStatusByDoctor(
            _patientAddress,
            _doctorAddress,
            _index
        );

        emit prescriptionCreated(
            _doctorAddress,
            _patientAddress,
            _appointmentDate,
            _timeSlot,
            _clinicalNotes,
            _prescriptionDetails
        );
    }

    // Function to retrieve prescription details by patient address
    function getPrescriptionsByPatient(address _patientAddress) 
        public 
        view 
        returns (
            address[] memory doctorAddresses,
            string[] memory doctorNames, 
            string[] memory appointmentDates, 
            string[] memory timeSlots, 
            string[] memory clinicalNotes, 
            string[] memory prescriptionDetails
        ) 
    {
        uint256 prescriptionCount = prescriptionsByPatientAddress[_patientAddress].length;
        
        doctorAddresses = new address[](prescriptionCount);
        doctorNames = new string[](prescriptionCount);
        appointmentDates = new string[](prescriptionCount);
        timeSlots = new string[](prescriptionCount);
        clinicalNotes = new string[](prescriptionCount);
        prescriptionDetails = new string[](prescriptionCount);

        for (uint256 i = 0; i < prescriptionCount; i++) {
            prescription memory currentPrescription = prescriptionsByPatientAddress[_patientAddress][i];
            doctorAddresses[i] = currentPrescription.doctorAddress;
            doctorNames[i] = appointment.getEmployeeUsernameAndSpecialization(currentPrescription.doctorAddress);
            appointmentDates[i] = currentPrescription.appointmentDate;
            timeSlots[i] = currentPrescription.timeSlot;
            clinicalNotes[i] = currentPrescription.clinicalNotes;
            prescriptionDetails[i] = currentPrescription.prescriptionDetails;
        }

        return (doctorAddresses, doctorNames, appointmentDates, timeSlots, clinicalNotes, prescriptionDetails);
    }

    function getPrescriptionsByDoctor(address _DoctorAddress) 
        public 
        view 
        returns (
            address[] memory patientAddresses,
            string[] memory patientNames,
            string[] memory appointmentDates, 
            string[] memory timeSlots, 
            string[] memory clinicalNotes, 
            string[] memory prescriptionDetails
        ) 
    {
        uint256 prescriptionCount = prescriptionsByDoctorAddress[_DoctorAddress].length;
        
        patientAddresses = new address[](prescriptionCount);
        patientNames = new string[](prescriptionCount);
        appointmentDates = new string[](prescriptionCount);
        timeSlots = new string[](prescriptionCount);
        clinicalNotes = new string[](prescriptionCount);
        prescriptionDetails = new string[](prescriptionCount);

        for (uint256 i = 0; i < prescriptionCount; i++) {
            prescription memory currentPrescription = prescriptionsByDoctorAddress[_DoctorAddress][i];
            patientAddresses[i] = currentPrescription.patientAddress;
            patientNames[i] = appointment.getUserUsername(currentPrescription.patientAddress);
            appointmentDates[i] = currentPrescription.appointmentDate;
            timeSlots[i] = currentPrescription.timeSlot;
            clinicalNotes[i] = currentPrescription.clinicalNotes;
            prescriptionDetails[i] = currentPrescription.prescriptionDetails;
        }

        return (patientAddresses, patientNames, appointmentDates, timeSlots, clinicalNotes, prescriptionDetails);
    }

    // Billing related code
    uint public totalBillings = 0;
    billing[] public allBillings;

    // New mappings
    mapping(address => billing[]) billingsByReceptionistAddress;
    mapping(address => billing[]) billingsByPatientAddress;

    struct billing {
        address receptionistAddress;
        address patientAddress;
        address doctorAddress;
        string appointmentDate;
        string timeSlot;
        string[] services;
        uint cost;
    }

    event billingCreated(
        address receptionistAddress,
        address patientAddress,
        address doctorAddress,
        string appointmentDate,
        string timeSlot,
        string[] services,
        uint cost
    );

    function storeBilling(
        address _receptionistAddress,
        address _patientAddress,
        address _doctorAddress,
        string memory _appointmentDate,
        string memory _timeSlot,
        string[] memory _services,
        uint _cost
    ) public {
        // Create a new billing object
        billing memory newBilling = billing({
            receptionistAddress: _receptionistAddress,
            patientAddress: _patientAddress,
            doctorAddress: _doctorAddress,
            appointmentDate: _appointmentDate,
            timeSlot: _timeSlot,
            services: _services,
            cost: _cost
        });

        // Store the new billing in the mappings
        billingsByReceptionistAddress[_receptionistAddress].push(newBilling);
        billingsByPatientAddress[_patientAddress].push(newBilling);

        // Also store it in the global array of all billings
        allBillings.push(newBilling);

        // Increment the total number of billings
        totalBillings += 1;

        emit billingCreated(
            _receptionistAddress,
            _patientAddress,
            _doctorAddress,
            _appointmentDate,
            _timeSlot,
            _services,
            _cost
        );
    }

    // Function to retrieve billing details by patient address
    function getBillingsByPatient(address _patientAddress)
        public
        view
        returns (
            address[] memory receptionistAddresses,
            string[] memory receptionistNames,
            address[] memory doctorAddresses,
            string[] memory doctorNames,
            string[] memory appointmentDates,
            string[] memory timeSlots,
            string[][] memory services,
            uint[] memory costs
        )
    {
        uint256 billingCount = billingsByPatientAddress[_patientAddress].length;

        receptionistAddresses = new address[](billingCount);
        receptionistNames = new string[](billingCount);
        doctorAddresses = new address[](billingCount);
        doctorNames = new string[](billingCount);
        appointmentDates = new string[](billingCount);
        timeSlots = new string[](billingCount);
        services = new string[][](billingCount);
        costs = new uint[](billingCount);

        for (uint256 i = 0; i < billingCount; i++) {
            billing memory currentBilling = billingsByPatientAddress[_patientAddress][i];
            receptionistAddresses[i] = currentBilling.receptionistAddress;
            receptionistNames[i] = appointment.getEmployeeUsername(currentBilling.receptionistAddress);
            doctorAddresses[i] = currentBilling.doctorAddress;
            doctorNames[i] = appointment.getEmployeeUsernameAndSpecialization(currentBilling.doctorAddress);
            appointmentDates[i] = currentBilling.appointmentDate;
            timeSlots[i] = currentBilling.timeSlot;
            services[i] = currentBilling.services;
            costs[i] = currentBilling.cost;
        }

        return (receptionistAddresses, receptionistNames, doctorAddresses, doctorNames, appointmentDates, timeSlots, services, costs);
    }

    function getAllBillings() 
        public 
        view 
        returns (
            address[] memory receptionistAddresses,
            string[] memory receptionistNames,
            address[] memory patientAddresses,
            string[] memory patientNames,
            address[] memory doctorAddresses,
            string[] memory doctorNames,
            string[] memory appointmentDates,
            string[] memory timeSlots,
            string[][] memory services,
            uint[] memory costs
        ) 
    {
        uint256 billingCount = allBillings.length;

        receptionistAddresses = new address[](billingCount);
        receptionistNames = new string[](billingCount);
        patientAddresses = new address[](billingCount);
        patientNames = new string[](billingCount);
        doctorAddresses = new address[](billingCount);
        doctorNames = new string[](billingCount);
        appointmentDates = new string[](billingCount);
        timeSlots = new string[](billingCount);
        services = new string[][](billingCount);
        costs = new uint[](billingCount);

        for (uint256 i = 0; i < billingCount; i++) {
            billing memory currentBilling = allBillings[i];
            receptionistAddresses[i] = currentBilling.receptionistAddress;
            receptionistNames[i] = appointment.getEmployeeUsername(currentBilling.receptionistAddress);
            patientAddresses[i] = currentBilling.patientAddress;
            patientNames[i] = appointment.getUserUsername(currentBilling.patientAddress);
            doctorAddresses[i] = currentBilling.doctorAddress;
            doctorNames[i] = appointment.getEmployeeUsernameAndSpecialization(currentBilling.doctorAddress);
            appointmentDates[i] = currentBilling.appointmentDate;
            timeSlots[i] = currentBilling.timeSlot;
            services[i] = currentBilling.services;
            costs[i] = currentBilling.cost;
        }

        return (patientAddresses, patientNames, receptionistAddresses, receptionistNames, doctorAddresses, doctorNames, appointmentDates, timeSlots, services, costs);
    }
}