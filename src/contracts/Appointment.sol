// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
import "./Auth.sol";

contract Appointment {
    Auth auth;
    constructor(address _authAddress) {
        // Initialize the auth variable with the address of the deployed Auth contract
        auth = Auth(_authAddress);
    }

    uint public totalAppointments = 0; 
    appointment[] public allAppointments;

    mapping(address => appointment[]) appointmentsByPatient;
    mapping(address => appointment[]) appointmentsByDoctor;

    mapping(uint => uint) public allAppointmentsToUserAppointments;
    mapping(uint => uint) public allAppointmentsToDoctorAppointments;

    mapping(uint => uint) public userAppointmentsToAllAppointments;
    mapping(uint => uint) public doctorAppointmentsToAllAppointments;

    struct appointment {
        address owner;
        string firstName;
        string lastName;
        string email;
        string number;
        string adr;
        address doctor;
        string appointmentDate;
        string timeSlot;
        string status;
    }

    event appointmentCreated(
        address owner,
        string firstName,
        string lastName,
        string email,
        string number,
        string adr,
        address doctor,
        string appointmentDate,
        string timeSlot,
        string status
    );

    event AppointmentStatusUpdated(
        address indexed userAddress,
        address indexed doctorAddress,
        uint indexed appointmentIndex,
        string originalStatus,
        string newStatus
    );

    function bookAppointment(
        address _owner,
        string memory _firstName,
        string memory _lastName,
        string memory _email,
        string memory _number,
        string memory _adr,
        address _doctor,
        string memory _appointmentDate,
        string memory _timeSlot,
        string memory _status
    ) public {
        totalAppointments++;
        
        // Create a new appointment struct
        appointment memory newAppointment = appointment(
            _owner,
            _firstName,
            _lastName,
            _email,
            _number,
            _adr,
            _doctor,
            _appointmentDate,
            _timeSlot,
            _status
        );

        // Push the new appointment to arrays
        appointmentsByPatient[_owner].push(newAppointment);
        appointmentsByDoctor[_doctor].push(newAppointment);
        allAppointments.push(newAppointment);

        // Emit the appointmentCreated event
        emit appointmentCreated(
            _owner,
            _firstName,
            _lastName,
            _email,
            _number,
            _adr,
            _doctor,
            _appointmentDate,
            _timeSlot,
            _status
        );

        // Get the lengths once and reuse them
        uint256 allAppointmentsLength = allAppointments.length;
        uint256 patientAppointmentsLength = appointmentsByPatient[_owner].length;
        uint256 doctorAppointmentsLength = appointmentsByDoctor[_doctor].length;

        // Directly assign the lengths to the mappings without using temporary variables
        allAppointmentsToUserAppointments[allAppointmentsLength - 1] = patientAppointmentsLength - 1;
        allAppointmentsToDoctorAppointments[allAppointmentsLength - 1] = doctorAppointmentsLength - 1;
        userAppointmentsToAllAppointments[patientAppointmentsLength - 1] = allAppointmentsLength - 1;
        doctorAppointmentsToAllAppointments[doctorAppointmentsLength - 1] = allAppointmentsLength - 1;
    }


    function getAppointments()
        public
        view
        returns (
            string[] memory firstNames,
            string[] memory lastNames,
            string[] memory emails,
            string[] memory numbers,
            string[] memory adrs,
            address[] memory doctorAdds,
            string[] memory doctors,
            string[] memory appointmentDates,
            string[] memory timeSlots,
            string[] memory status
        )
    {
        appointment[] memory userAppointments = appointmentsByPatient[msg.sender];

        firstNames = new string[](userAppointments.length);
        lastNames = new string[](userAppointments.length);
        emails = new string[](userAppointments.length);
        numbers = new string[](userAppointments.length);
        adrs = new string[](userAppointments.length);
        doctorAdds = new address[](userAppointments.length);
        doctors = new string[](userAppointments.length);
        appointmentDates = new string[](userAppointments.length);
        timeSlots = new string[](userAppointments.length);
        status = new string[](userAppointments.length);

        for (uint256 i = 0; i < userAppointments.length; i++) {
            firstNames[i] = userAppointments[i].firstName;
            lastNames[i] = userAppointments[i].lastName;
            emails[i] = userAppointments[i].email;
            numbers[i] = userAppointments[i].number;
            adrs[i] = userAppointments[i].adr;
            doctorAdds[i] = userAppointments[i].doctor;
            doctors[i] = getEmployeeUsernameAndSpecialization(userAppointments[i].doctor);
            appointmentDates[i] = userAppointments[i].appointmentDate;
            timeSlots[i] = userAppointments[i].timeSlot;
            status[i] = userAppointments[i].status;
        }

        return (
            firstNames,
            lastNames,
            emails,
            numbers,
            adrs,
            doctorAdds,
            doctors,
            appointmentDates,
            timeSlots,
            status
        );
    }

    function getAppointmentByDateAndTime(address patientAddress, string memory appDate, string memory tSlot) 
        public 
        view 
        returns (
            string memory firstName,
            string memory lastName,
            string memory email,
            string memory number,
            string memory adr,
            string memory doctor,
            string memory appointmentDate,
            string memory timeSlot,
            string memory status
        ) 
    {
        appointment[] memory appointments = appointmentsByPatient[patientAddress];
        
        for (uint i = 0; i < appointments.length; i++) {
            if (keccak256(abi.encodePacked(appointments[i].appointmentDate)) == keccak256(abi.encodePacked(appDate)) &&
                keccak256(abi.encodePacked(appointments[i].timeSlot)) == keccak256(abi.encodePacked(tSlot))) {
                    firstName = appointments[i].firstName;
                    lastName = appointments[i].lastName;
                    email = appointments[i].email;
                    number = appointments[i].number;
                    adr = appointments[i].adr;
                    doctor = getEmployeeUsernameAndSpecialization(appointments[i].doctor);
                    appointmentDate = appointments[i].appointmentDate;
                    timeSlot = appointments[i].timeSlot;
                    status = appointments[i].status;
                
                return (
                    firstName,
                    lastName,
                    email,
                    number,
                    adr,
                    doctor,
                    appointmentDate,
                    timeSlot,
                    status
                );
            }
        }

        // Return an empty Appointment if not found; Solidity requires a return value even if not found
        // Consider an alternative approach to indicate not found, as Solidity does not support returning null for non-pointer types
        revert("Appointment not found.");
    }

    function getAppointmentsByDoctor()
        public
        view
        returns (
            address[] memory owners,
            string[] memory firstNames,
            string[] memory lastNames,
            string[] memory emails,
            string[] memory numbers,
            string[] memory adrs,
            string[] memory doctors,
            string[] memory appointmentDates,
            string[] memory timeSlots,
            string[] memory status
        )
    {
        appointment[] memory doctorAppointments = appointmentsByDoctor[msg.sender];

        owners = new address[](doctorAppointments.length);
        firstNames = new string[](doctorAppointments.length);
        lastNames = new string[](doctorAppointments.length);
        emails = new string[](doctorAppointments.length);
        numbers = new string[](doctorAppointments.length);
        adrs = new string[](doctorAppointments.length);
        doctors = new string[](doctorAppointments.length);
        appointmentDates = new string[](doctorAppointments.length);
        timeSlots = new string[](doctorAppointments.length);
        status = new string[](doctorAppointments.length);

        for (uint256 i = 0; i < doctorAppointments.length; i++) {
            owners[i] = doctorAppointments[i].owner;
            firstNames[i] = doctorAppointments[i].firstName;
            lastNames[i] = doctorAppointments[i].lastName;
            emails[i] = doctorAppointments[i].email;
            numbers[i] = doctorAppointments[i].number;
            adrs[i] = doctorAppointments[i].adr;
            doctors[i] = getEmployeeUsernameAndSpecialization(doctorAppointments[i].doctor);
            appointmentDates[i] = doctorAppointments[i].appointmentDate;
            timeSlots[i] = doctorAppointments[i].timeSlot;
            status[i] = doctorAppointments[i].status;
        }

        return (
            owners,
            firstNames,
            lastNames,
            emails,
            numbers,
            adrs,
            doctors,
            appointmentDates,
            timeSlots,
            status
        );
    }

    function getAllAppointments()
        public
        view
        returns (
            address[] memory owners,
            string[] memory firstNames,
            string[] memory lastNames,
            string[] memory emails,
            string[] memory numbers,
            string[] memory adrs,
            address[] memory doctorAdds,
            string[] memory doctors,
            string[] memory appointmentDates,
            string[] memory timeSlots,
            string[] memory status
        )
    {
        appointment[] memory appointmentList = allAppointments;

        owners = new address[](appointmentList.length);
        firstNames = new string[](appointmentList.length);
        lastNames = new string[](appointmentList.length);
        emails = new string[](appointmentList.length);
        numbers = new string[](appointmentList.length);
        adrs = new string[](appointmentList.length);
        doctorAdds = new address[](appointmentList.length);
        doctors = new string[](appointmentList.length);
        appointmentDates = new string[](appointmentList.length);
        timeSlots = new string[](appointmentList.length);
        status = new string[](appointmentList.length);

        for (uint256 i = 0; i < appointmentList.length; i++) {
            owners[i] = appointmentList[i].owner;
            firstNames[i] = appointmentList[i].firstName;
            lastNames[i] = appointmentList[i].lastName;
            emails[i] = appointmentList[i].email;
            numbers[i] = appointmentList[i].number;
            adrs[i] = appointmentList[i].adr;
            doctorAdds[i] = appointmentList[i].doctor;
            doctors[i] = getEmployeeUsernameAndSpecialization(appointmentList[i].doctor);
            appointmentDates[i] = appointmentList[i].appointmentDate;
            timeSlots[i] = appointmentList[i].timeSlot;
            status[i] = appointmentList[i].status;
        }

        return (
            owners,
            firstNames,
            lastNames,
            emails,
            numbers,
            adrs,
            doctorAdds,
            doctors,
            appointmentDates,
            timeSlots,
            status
        );
    }

    function getEmployeeUsernameAndSpecialization(address blockChainAddress) public view returns (string memory) {
        // Call the getEmployeeDetails function from the Auth contract
        Auth.employee memory emp = auth.getEmployeeDetails(blockChainAddress);

        // Concatenate the username and specialization with parentheses in between
        return string(abi.encodePacked(emp.username, "(", emp.specialization, ")"));
    }

    function getEmployeeUsername(address blockChainAddress) public view returns (string memory) {
        // Call the getEmployeeDetails function from the Auth contract
        Auth.employee memory emp = auth.getEmployeeDetails(blockChainAddress);

        // Return the username
        return emp.username;
    }

    function getUserUsername(address blockChainAddress) public view returns (string memory) {
        // Call the getEmployeeDetails function from the Auth contract
        Auth.user memory us = auth.getUserDetails(blockChainAddress);

        // Return the username
        return us.username;
    }

    function updateAppointmentStatus(
        address userAddress,
        address doctorAddress,
        uint allAppointmentsIndex,
        string memory newStatus
    ) public {
        uint userAppointmentsIndex = allAppointmentsToUserAppointments[allAppointmentsIndex];
        uint doctorAppointmentsIndex = allAppointmentsToDoctorAppointments[allAppointmentsIndex];

        require(
            userAppointmentsIndex < appointmentsByPatient[userAddress].length,
            "appointment does not exist"
        );

        string memory originalStatus = appointmentsByPatient[userAddress][userAppointmentsIndex].status;

        appointmentsByPatient[userAddress][userAppointmentsIndex].status = newStatus;
        appointmentsByDoctor[doctorAddress][doctorAppointmentsIndex].status = newStatus;
        allAppointments[allAppointmentsIndex].status = newStatus;

        emit AppointmentStatusUpdated(
            userAddress,
            doctorAddress,
            allAppointmentsIndex,
            originalStatus,
            newStatus
        );
    }

    function updateAppointmentStatusByIndex(
        address userAddress,
        address doctorAddress,
        uint userAppointmentsIndex,
        string memory newStatus
    ) public {
        require(
            userAppointmentsIndex < appointmentsByPatient[userAddress].length,
            "appointment does not exist"
        );

        uint allAppointmentsIndex = userAppointmentsToAllAppointments[userAppointmentsIndex];
        uint doctorAppointmentsIndex = allAppointmentsToDoctorAppointments[allAppointmentsIndex];

        string memory originalStatus = appointmentsByPatient[userAddress][userAppointmentsIndex].status;

        appointmentsByPatient[userAddress][userAppointmentsIndex].status = newStatus;
        appointmentsByDoctor[doctorAddress][doctorAppointmentsIndex].status = newStatus;
        allAppointments[allAppointmentsIndex].status = newStatus;

        emit AppointmentStatusUpdated(
            userAddress,
            doctorAddress,
            allAppointmentsIndex,
            originalStatus,
            newStatus
        );
    }

    function updateAppointmentStatusByDoctor(
        address userAddress,
        address doctorAddress,
        uint doctorAppointmentsIndex
    ) public {
        uint allAppointmentsIndex = doctorAppointmentsToAllAppointments[doctorAppointmentsIndex];
        uint userAppointmentsIndex = allAppointmentsToUserAppointments[allAppointmentsIndex];
        
        require(
            doctorAppointmentsIndex < appointmentsByDoctor[doctorAddress].length,
            "appointment does not exist"
        );

        string memory newStatus = "completed";
        string memory originalStatus = appointmentsByDoctor[doctorAddress][doctorAppointmentsIndex].status;

        appointmentsByPatient[userAddress][userAppointmentsIndex].status = newStatus;
        appointmentsByDoctor[doctorAddress][doctorAppointmentsIndex].status = newStatus;
        allAppointments[allAppointmentsIndex].status = newStatus;

        emit AppointmentStatusUpdated(
            userAddress,
            doctorAddress,
            allAppointmentsIndex,
            originalStatus,
            newStatus
        );
    }

    function getBookedTimeSlots(address _doctorAdd, string memory _currentDate)
    public
    view
    returns (string[] memory)
    {
        appointment[] memory doctorAppointments = appointmentsByDoctor[_doctorAdd];

        // Allocate memory array with the exact count
        string[] memory exactBookedTimeSlots = new string[](doctorAppointments.length);

        // Second pass: populate the results
        uint index = 0;
        for (uint256 i = 0; i < doctorAppointments.length && index < doctorAppointments.length; i++) {
            if (
                keccak256(abi.encodePacked(doctorAppointments[i].appointmentDate)) == keccak256(abi.encodePacked(_currentDate))
            ) {
                exactBookedTimeSlots[index] = doctorAppointments[i].timeSlot;
                index++;
            }
        }

        return exactBookedTimeSlots;
    }

    function getCurrentDateAppointementCount(string memory _currentDate)
    public
    view
    returns (uint256)
    {
        uint count = 0;
        for (uint i = 0; i < allAppointments.length; i++) {
            if (
                keccak256(abi.encodePacked(allAppointments[i].appointmentDate)) == keccak256(abi.encodePacked(_currentDate))
            ) {
                count++;
            }
        }

        return count;
    }
}