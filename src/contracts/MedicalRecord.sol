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

    // New mappings
    mapping(address => prescription[]) prescriptionsByOwner; // Mapping from owner's address to prescriptions
    mapping(string => prescription[]) prescriptionsByPatientAddress; // Mapping from patient's address to prescriptions

    struct prescription{
        address owner;
        string patientAddress;
        string appointmentData;
        string timeSlot;
        string clinicalNotes;
        string prescriptionDetails;
    }

    event prescriptionCreated(
        address owner,
        string patientAddress,
        string appointmentData,
        string timeSlot,
        string clinicalNotes,
        string prescriptionDetails
    );

    function storePrescription(
        address _owner,
        string memory _patientAddress,
        string memory _appointmentData,
        string memory _timeSlot,
        string memory _clinicalNotes,
        string memory _prescriptionDetails
    ) public {
        // Create a new prescription object
        prescription memory newPrescription = prescription({
            owner: _owner,
            patientAddress: _patientAddress,
            appointmentData: _appointmentData,
            timeSlot: _timeSlot,
            clinicalNotes: _clinicalNotes,
            prescriptionDetails: _prescriptionDetails
        });

        // Store the new prescription in the mappings
        prescriptionsByOwner[msg.sender].push(newPrescription); // Update mapping for owner
        prescriptionsByPatientAddress[_patientAddress].push(newPrescription); // Update mapping for patient

        // Also store it in the global array of all prescriptions
        allPrescriptions.push(newPrescription);

        // Increment the total number of prescriptions
        totalPrescriptions += 1;

        emit prescriptionCreated(
            _owner,
            _patientAddress,
            _appointmentData,
            _timeSlot,
            _clinicalNotes,
            _prescriptionDetails
        );
    }    
}