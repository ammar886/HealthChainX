// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Appointment {
    uint public totalAppointmets = 0; 
    mapping(address => appointment[]) appointments;
    appointment[] public allAppointments;  
    address public adminAddress; //fix this 

    struct appointment {
        address owner;
        string firstName;
        string lastName;
        string email;
        string number;
        string adr;
        string doctor;
        string currentDate;
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
        string doctor,
        string currentDate,
        string timeSlot,
        string status
    );

    function bookAppointment(
        address _owner,
        string memory _firstName,
        string memory _lastName,
        string memory _email,
        string memory _number,
        string memory _adr,
        string memory _doctor,
        string memory _currentDate,
        string memory _timeSlot,
        string memory _status
    ) public {
        totalAppointmets++;
        appointment memory newAppointment = appointment(
            _owner,
            _firstName,
            _lastName,
            _email,
            _number,
            _adr,
            _doctor,
            _currentDate,
            _timeSlot,
            _status
        );
        appointments[_owner].push(newAppointment);
        allAppointments.push(newAppointment);
        emit appointmentCreated(
            _owner,
            _firstName,
            _lastName,
            _email,
            _number,
            _adr,
            _doctor,
            _currentDate,
            _timeSlot,
            _status
        );
    }

    function getAppointmentCount() public view returns (uint) {
        return totalAppointmets;
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
            string[] memory doctors,
            string[] memory timeSlots,
            string[] memory status
        )
    {
        appointment[] memory userAppointments = appointments[msg.sender];
        firstNames = new string[](userAppointments.length);
        lastNames = new string[](userAppointments.length);
        emails = new string[](userAppointments.length);
        numbers = new string[](userAppointments.length);
        adrs = new string[](userAppointments.length);
        doctors = new string[](userAppointments.length);
        timeSlots = new string[](userAppointments.length);
        status = new string[](userAppointments.length);

        for (uint256 i = 0; i < userAppointments.length; i++) {
            firstNames[i] = userAppointments[i].firstName;
            lastNames[i] = userAppointments[i].lastName;
            emails[i] = userAppointments[i].email;
            numbers[i] = userAppointments[i].number;
            adrs[i] = userAppointments[i].adr;
            doctors[i] = userAppointments[i].doctor;
            timeSlots[i] = userAppointments[i].timeSlot;
            status[i] = userAppointments[i].status;
        }

        return (
            firstNames,
            lastNames,
            emails,
            numbers,
            adrs,
            doctors,
            timeSlots,
            status
        );
    }

    function getAppointmentsAdmin(
        address userAddress
    )
        public
        view
        returns (
            string[] memory firstNames,
            string[] memory lastNames,
            string[] memory emails,
            string[] memory numbers,
            string[] memory adrs,
            string[] memory doctors,
            string[] memory timeSlots,
            string[] memory status
        )
    {
        require(msg.sender == adminAddress, "only admin can call this func");
        appointment[] memory userAppointments = appointments[userAddress]; // Use the provided userAddress
        firstNames = new string[](userAppointments.length);
        lastNames = new string[](userAppointments.length);
        emails = new string[](userAppointments.length);
        numbers = new string[](userAppointments.length);
        adrs = new string[](userAppointments.length);
        doctors = new string[](userAppointments.length);
        timeSlots = new string[](userAppointments.length);
        status = new string[](userAppointments.length);

        for (uint256 i = 0; i < userAppointments.length; i++) {
            firstNames[i] = userAppointments[i].firstName;
            lastNames[i] = userAppointments[i].lastName;
            emails[i] = userAppointments[i].email;
            numbers[i] = userAppointments[i].number;
            adrs[i] = userAppointments[i].adr;
            doctors[i] = userAppointments[i].doctor;
            timeSlots[i] = userAppointments[i].timeSlot;
            status[i] = userAppointments[i].status;
        }

        return (
            firstNames,
            lastNames,
            emails,
            numbers,
            adrs,
            doctors,
            timeSlots,
            status
        );
    }

    function getAllAppointments()
        public
        view
        returns (
            string[] memory firstNames,
            string[] memory lastNames,
            string[] memory emails,
            string[] memory numbers,
            string[] memory adrs,
            string[] memory doctors,
            string[] memory timeSlots,
            string[] memory status,
            address[] memory owner
        )
    {
        appointment[] memory appointmentList = allAppointments;
        firstNames = new string[](appointmentList.length);
        lastNames = new string[](appointmentList.length);
        emails = new string[](appointmentList.length);
        numbers = new string[](appointmentList.length);
        adrs = new string[](appointmentList.length);
        doctors = new string[](appointmentList.length);
        timeSlots = new string[](appointmentList.length);
        status = new string[](appointmentList.length);
        owner = new address[](appointmentList.length);

        for (uint256 i = 0; i < appointmentList.length; i++) {
            firstNames[i] = appointmentList[i].firstName;
            lastNames[i] = appointmentList[i].lastName;
            emails[i] = appointmentList[i].email;
            numbers[i] = appointmentList[i].number;
            adrs[i] = appointmentList[i].adr;
            doctors[i] = appointmentList[i].doctor;
            timeSlots[i] = appointmentList[i].timeSlot;
            status[i] = appointmentList[i].status;
            owner[i] = appointmentList[i].owner;
        }

        return (
            firstNames,
            lastNames,
            emails,
            numbers,
            adrs,
            doctors,
            timeSlots,
            status,
            owner
        );
    }

    function getAllAppointmentsLength() public view returns (uint) {
        return allAppointments.length;
    }

    event AppointmentStatusUpdated(
        address indexed userAddress,
        uint indexed appointmentIndex,
        string originalStatus,
        string newStatus
    );

    function updateAppointmentStatus(
        address userAddress,
        uint appointmentIndex,
        string memory newStatus
    ) public {
        // require(msg.sender == adminAddress, "only admin can call this func");
        require(
            appointmentIndex < appointments[userAddress].length,
            "appointment does not exist"
        );

        appointments[userAddress][appointmentIndex].status = newStatus;
        allAppointments[appointmentIndex].status = newStatus;

        emit AppointmentStatusUpdated(
            userAddress,
            appointmentIndex,
            appointments[userAddress][appointmentIndex].status,
            newStatus
        );
    }

    function getBookedTimeSlots(string memory _doctorAdd, string memory _currentDate)
    public
    view
    returns (string[] memory)
    {
        string[] memory bookedTimeSlots = new string[](totalAppointmets);
        uint count = 0;
        for (uint i = 0; i < allAppointments.length; i++) {
            if (
                keccak256(abi.encodePacked(allAppointments[i].doctor)) == keccak256(abi.encodePacked(_doctorAdd)) &&
                keccak256(abi.encodePacked(allAppointments[i].currentDate)) == keccak256(abi.encodePacked(_currentDate))
            ) {
                bookedTimeSlots[count] = allAppointments[i].timeSlot;
                count++;
            }
        }

        // Create a new dynamic array with the exact length
        string[] memory exactBookedTimeSlots = new string[](count);
        for (uint i = 0; i < count; i++) {
            exactBookedTimeSlots[i] = bookedTimeSlots[i];
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
                keccak256(abi.encodePacked(allAppointments[i].currentDate)) == keccak256(abi.encodePacked(_currentDate))
            ) {
                count++;
            }
        }

        return count;
    }
}