// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
import "./Auth.sol";

contract Appointment {
    Auth auth;
    constructor(address _authAddress) {
        // Initialize the auth variable with the address of the deployed Auth contract
        auth = Auth(_authAddress);
    }

    uint public totalAppointmets = 0; 
    appointment[] public allAppointments;

    mapping(address => appointment[]) appointments;
    mapping(uint => uint) public allAppointmentsToUserAppointments;

    struct appointment {
        address owner;
        string firstName;
        string lastName;
        string email;
        string number;
        string adr;
        string doctor;
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
        string doctor,
        string appointmentDate,
        string timeSlot,
        string status
    );

    event AppointmentStatusUpdated(
        address indexed userAddress,
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
        string memory _doctor,
        string memory _appointmentDate,
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
            _appointmentDate,
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
            _appointmentDate,
            _timeSlot,
            _status
        );
        allAppointmentsToUserAppointments[allAppointments.length - 1] = appointments[_owner].length - 1;
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
            doctors[i] = getEmployeeUsernameAndSpecialization(userAppointments[i].doctor);
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

    function getAppointmentsByDoctor(string memory _doctor)
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
            string[] memory appointmentDate,
            string[] memory timeSlots,
            string[] memory status
        )
    {
        // Count the number of appointments for the doctor
        uint count = 0;
        for (uint i = 0; i < allAppointments.length; i++) {
            if (keccak256(abi.encodePacked(allAppointments[i].doctor)) == keccak256(abi.encodePacked(_doctor))) {
                count++;
            }
        }

        // Initialize the result arrays
        owners = new address[](count);
        firstNames = new string[](count);
        lastNames = new string[](count);
        emails = new string[](count);
        numbers = new string[](count);
        adrs = new string[](count);
        doctors = new string[](count);
        appointmentDate = new string[](count);
        timeSlots = new string[](count);
        status = new string[](count);

        // Add the appointments to the result arrays
        uint j = 0;
        for (uint i = 0; i < allAppointments.length; i++) {
            if (keccak256(abi.encodePacked(allAppointments[i].doctor)) == keccak256(abi.encodePacked(_doctor))) {
                owners[j] = allAppointments[i].owner;
                firstNames[j] = allAppointments[i].firstName;
                lastNames[j] = allAppointments[i].lastName;
                emails[j] = allAppointments[i].email;
                numbers[j] = allAppointments[i].number;
                adrs[j] = allAppointments[i].adr;
                doctors[j] = getEmployeeUsernameAndSpecialization(allAppointments[i].doctor);
                appointmentDate[j] = allAppointments[i].appointmentDate;
                timeSlots[j] = allAppointments[i].timeSlot;
                status[j] = allAppointments[i].status;
                j++;
            }
        }

        return (
            owners,
            firstNames,
            lastNames,
            emails,
            numbers,
            adrs,
            doctors,
            appointmentDate,
            timeSlots,
            status
        );
    }

    function getAllAppointments()
        public
        view
        returns (
            address[] memory owner,
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
        appointment[] memory appointmentList = allAppointments;

        owner = new address[](appointmentList.length);
        firstNames = new string[](appointmentList.length);
        lastNames = new string[](appointmentList.length);
        emails = new string[](appointmentList.length);
        numbers = new string[](appointmentList.length);
        adrs = new string[](appointmentList.length);
        doctors = new string[](appointmentList.length);
        timeSlots = new string[](appointmentList.length);
        status = new string[](appointmentList.length);

        for (uint256 i = 0; i < appointmentList.length; i++) {
            owner[i] = appointmentList[i].owner;
            firstNames[i] = appointmentList[i].firstName;
            lastNames[i] = appointmentList[i].lastName;
            emails[i] = appointmentList[i].email;
            numbers[i] = appointmentList[i].number;
            adrs[i] = appointmentList[i].adr;
            doctors[i] = getEmployeeUsernameAndSpecialization(appointmentList[i].doctor);
            timeSlots[i] = appointmentList[i].timeSlot;
            status[i] = appointmentList[i].status;
        }

        return (
            owner,
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

    function getEmployeeUsernameAndSpecialization(string memory blockChainAddress) public view returns (string memory) {
        // Call the getEmployeeDetails function from the Auth contract
        Auth.employee memory emp = auth.getEmployeeDetails(blockChainAddress);

        // Concatenate the username and specialization with parentheses in between
        return string(abi.encodePacked(emp.username, "(", emp.specialization, ")"));
    }

    function updateAppointmentStatus(
        address userAddress,
        uint allAppointmentsIndex,
        string memory newStatus
    ) public {
        uint userAppointmentsIndex = allAppointmentsToUserAppointments[allAppointmentsIndex];

        require(
            userAppointmentsIndex < appointments[userAddress].length,
            "appointment does not exist"
        );

        string memory originalStatus = appointments[userAddress][userAppointmentsIndex].status;

        appointments[userAddress][userAppointmentsIndex].status = newStatus;
        allAppointments[allAppointmentsIndex].status = newStatus;

        emit AppointmentStatusUpdated(
            userAddress,
            allAppointmentsIndex,
            originalStatus,
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
                keccak256(abi.encodePacked(allAppointments[i].appointmentDate)) == keccak256(abi.encodePacked(_currentDate))
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
                keccak256(abi.encodePacked(allAppointments[i].appointmentDate)) == keccak256(abi.encodePacked(_currentDate))
            ) {
                count++;
            }
        }

        return count;
    }
}