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

    mapping(address => appointment[]) appointmentsByOwner;
    mapping(address => appointment[]) appointmentsByDoctor;

    mapping(uint => uint) public allAppointmentsToUserAppointments;
    mapping(uint => uint) public allAppointmentsToDoctorAppointments;

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
        appointmentsByOwner[_owner].push(newAppointment);
        appointmentsByDoctor[_doctor].push(newAppointment);
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
        allAppointmentsToUserAppointments[allAppointments.length - 1] = appointmentsByOwner[_owner].length - 1;
        allAppointmentsToDoctorAppointments[allAppointments.length - 1] = appointmentsByDoctor[_doctor].length - 1;
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
            string[] memory appointmentDates,
            string[] memory timeSlots,
            string[] memory status
        )
    {
        appointment[] memory userAppointments = appointmentsByOwner[msg.sender];

        firstNames = new string[](userAppointments.length);
        lastNames = new string[](userAppointments.length);
        emails = new string[](userAppointments.length);
        numbers = new string[](userAppointments.length);
        adrs = new string[](userAppointments.length);
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
            doctors,
            appointmentDates,
            timeSlots,
            status
        );
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
        appointment[] memory userAppointments = appointmentsByDoctor[msg.sender];

        owners = new address[](userAppointments.length);
        firstNames = new string[](userAppointments.length);
        lastNames = new string[](userAppointments.length);
        emails = new string[](userAppointments.length);
        numbers = new string[](userAppointments.length);
        adrs = new string[](userAppointments.length);
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
            doctors[i] = getEmployeeUsernameAndSpecialization(userAppointments[i].doctor);
            appointmentDates[i] = userAppointments[i].appointmentDate;
            timeSlots[i] = userAppointments[i].timeSlot;
            status[i] = userAppointments[i].status;
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

    function updateAppointmentStatus(
        address userAddress,
        address doctorAddress,
        uint allAppointmentsIndex,
        string memory newStatus
    ) public {
        uint userAppointmentsIndex = allAppointmentsToUserAppointments[allAppointmentsIndex];
        uint doctorAppointmentsIndex = allAppointmentsToDoctorAppointments[allAppointmentsIndex];

        require(
            userAppointmentsIndex < appointmentsByOwner[userAddress].length,
            "appointment does not exist"
        );

        string memory originalStatus = appointmentsByOwner[userAddress][userAppointmentsIndex].status;

        appointmentsByOwner[userAddress][userAppointmentsIndex].status = newStatus;
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
        uint count = 0;
        // First pass: count the number of booked time slots
        for (uint i = 0; i < allAppointments.length; i++) {
            if (
                keccak256(abi.encodePacked(allAppointments[i].doctor)) == keccak256(abi.encodePacked(_doctorAdd)) &&
                keccak256(abi.encodePacked(allAppointments[i].appointmentDate)) == keccak256(abi.encodePacked(_currentDate))
            ) {
                count++;
            }
        }

        // Allocate memory array with the exact count
        string[] memory exactBookedTimeSlots = new string[](count);

        // Second pass: populate the results
        uint index = 0;
        for (uint i = 0; i < allAppointments.length && index < count; i++) {
            if (
                keccak256(abi.encodePacked(allAppointments[i].doctor)) == keccak256(abi.encodePacked(_doctorAdd)) &&
                keccak256(abi.encodePacked(allAppointments[i].appointmentDate)) == keccak256(abi.encodePacked(_currentDate))
            ) {
                exactBookedTimeSlots[index] = allAppointments[i].timeSlot;
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