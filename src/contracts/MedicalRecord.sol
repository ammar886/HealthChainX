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

    // Billing related code
    uint public totalBillings = 0;
    billing[] public allBillings;

    // New mappings
    mapping(address => billing[]) billingsByReceptionistAddress;
    mapping(address => billing[]) billingsByPatientAddress;

    struct billing {
        address receptionistAddress;
        address patientAddress;
        string appointmentDate;
        string[] services;
        uint cost;
    }

    event billingCreated(
        address receptionistAddress,
        address patientAddress,
        string appointmentDate,
        string[] services,
        uint cost
    );

    function storeBilling(
        address _receptionistAddress,
        address _patientAddress,
        string memory _appointmentDate,
        string[] memory _services,
        uint _cost
    ) public {
        // Create a new billing object
        billing memory newBilling = billing({
            receptionistAddress: _receptionistAddress,
            patientAddress: _patientAddress,
            appointmentDate: _appointmentDate,
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
            _appointmentDate,
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
            string[] memory appointmentDates,
            string[][] memory services,
            uint[] memory costs
        )
    {
        uint256 billingCount = billingsByPatientAddress[_patientAddress].length;

        receptionistAddresses = new address[](billingCount);
        appointmentDates = new string[](billingCount);
        services = new string[][](billingCount);
        costs = new uint[](billingCount);

        for (uint256 i = 0; i < billingCount; i++) {
            billing memory currentBilling = billingsByPatientAddress[_patientAddress][i];
            receptionistAddresses[i] = currentBilling.receptionistAddress;
            appointmentDates[i] = currentBilling.appointmentDate;
            services[i] = currentBilling.services;
            costs[i] = currentBilling.cost;
        }

        return (receptionistAddresses, appointmentDates, services, costs);
    }
}
