// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
import "./Auth.sol";
import "./Appointment.sol";

contract MedicalRecord{
    Auth auth;
    Appointment appointment;

    constructor(address _authAddress, address _appointmentAddress){
        auth = Auth(_authAddress);
        appointment = Appointment(_appointmentAddress);
    }

    uint public totalPrescriptions = 0; 
    prescription[] public allPrescriptions;

    mapping(string => prescription[]) prescriptions;


    struct prescription{
        address owner;
        string clinicalNotes;
        string prescription;
        string patientAddress;
    }

    event prescriptionCreated(
        address owner,
        string clinicalNotes,
        string prescription,
        string patientAddress
    );

    function storePrescription(
    string memory _patientAddress,
    string memory _clinicalNotes,
    string memory _prescriptionText
) public {
    // Ensure the caller of the function is authorized, e.g., a verified doctor.
    // This step is crucial for security and data integrity but is not implemented here.

    // Create a new prescription object
    prescription memory newPrescription = prescription({
        owner: msg.sender, // The sender's address is considered the owner (doctor) of the prescription
        clinicalNotes: _clinicalNotes,
        prescription: _prescriptionText,
        patientAddress: _patientAddress
    });

    // Store the new prescription in the array for the patient
    prescriptions[_patientAddress].push(newPrescription);

    // Also store it in the global array of all prescriptions
    allPrescriptions.push(newPrescription);

    // Increment the total number of prescriptions
    totalPrescriptions += 1;
    emit prescriptionCreated(
        msg.sender,
        _clinicalNotes,
        _prescriptionText,
        _patientAddress
    );
    
}

    
}