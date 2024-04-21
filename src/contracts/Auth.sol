// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Auth {
    uint public userCount = 0;
    uint public employeeCount = 0;
    uint public totalAppointmets = 0;
    address public adminAddress; //fix this
    mapping(string => user) users;
    mapping(string => employee) employees;
    mapping(address => appointment[]) appointments;
    appointment[] public allAppointments;

    constructor() {
        adminAddress = 0x5b13955ab787Bb94D98EBc84ff4Af43dA605Ab84;
    }

    struct user {
        string username;
        string password;
        string email;
        string number;
        string userRole;
    }

    struct employee {
        string firstName;
        string lastName;
        string email;
        string number;
        string adr;
        string password;
        string userRole;
    }

    struct appointment {
        address owner;
        string firstName;
        string lastName;
        string email;
        string number;
        string adr;
        string timeSlot;
        string doctor;
        string status;
    }

    event userCreated(
        string username,
        string email,
        string number,
        string password,
        string userRole
    );

    event employeeCreated(
        string firstName,
        string lastName,
        string email,
        string number,
        string adr,
        string password,
        string userRole
    );

    event appointmentCreated(
        address owner,
        string firstName,
        string lastName,
        string email,
        string number,
        string adr,
        string timeSlot,
        string doctor,
        string status
    );

    function createUser(
        string memory _username,
        string memory _password,
        string memory _email,
        string memory _number,
        string memory _userRole
    ) public {
        userCount++;
        users[_username] = user(
            _username,
            _password,
            _email,
            _number,
            _userRole
        );
        emit userCreated(_username, _password, _email, _number, _userRole);
    }

    string naam = "Ammar";

    // function getUsername() public view returns (string memory) {
    //     return naam;
    // }

    function getUsername(
        string memory _username
    ) public view returns (string memory) {
        require(
            bytes(users[_username].username).length > 0,
            "User does not exist"
        );
        return users[_username].username;
    }

    function getUserOrEmployeeRole(
        string memory _username
    ) public view returns (string memory) {
        if (
            keccak256(abi.encodePacked(users[_username].userRole)) !=
            keccak256(abi.encodePacked(""))
        ) {
            return users[_username].userRole;
        } else if (
            keccak256(abi.encodePacked(employees[_username].userRole)) !=
            keccak256(abi.encodePacked(""))
        ) {
            return employees[_username].userRole;
        }
        revert("User or employee not found");
    }

    function authenticateLogin(
        string memory _username,
        string memory _password
    ) public view returns (bool) {
        user memory userInstance = users[_username];

        if (bytes(userInstance.username).length == 0) {
            employee memory employeeUser = employees[_username];
            if (bytes(employeeUser.firstName).length == 0) {
                return false;
            } else {
                return
                    keccak256(abi.encodePacked(employeeUser.password)) ==
                    keccak256(abi.encodePacked(_password));
            }
        } else {
            return
                keccak256(abi.encodePacked(userInstance.password)) ==
                keccak256(abi.encodePacked(_password));
        }
    }

    function createEmployee(
        string memory _firstName,
        string memory _lastName,
        string memory _email,
        string memory _number,
        string memory _adr,
        string memory _password,
        string memory _userRole
    ) public {
        employeeCount++;
        employees[_firstName] = employee(
            _firstName,
            _lastName,
            _email,
            _number,
            _adr,
            _password,
            _userRole
        );
        emit employeeCreated(
            _firstName,
            _lastName,
            _email,
            _number,
            _adr,
            _password,
            _userRole
        );
    }

    function bookAppointment(
        string memory _firstName,
        string memory _lastName,
        string memory _email,
        string memory _number,
        string memory _adr,
        string memory _timeSlot,
        string memory _doctor,
        string memory _status
    ) public {
        totalAppointmets++;
        appointment memory newAppointment = appointment(
            msg.sender,
            _firstName,
            _lastName,
            _email,
            _number,
            _adr,
            _timeSlot,
            _doctor,
            _status
        );
        appointments[msg.sender].push(newAppointment);
        allAppointments.push(newAppointment);

        emit appointmentCreated(
            msg.sender,
            _firstName,
            _lastName,
            _email,
            _number,
            _adr,
            _timeSlot,
            _doctor,
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
            string[] memory timeSlots,
            string[] memory doctors,
            string[] memory status
        )
    {
        appointment[] memory userAppointments = appointments[msg.sender]; //msgsender
        firstNames = new string[](userAppointments.length);
        lastNames = new string[](userAppointments.length);
        emails = new string[](userAppointments.length);
        numbers = new string[](userAppointments.length);
        adrs = new string[](userAppointments.length);
        timeSlots = new string[](userAppointments.length);
        doctors = new string[](userAppointments.length);
        status = new string[](userAppointments.length);

        for (uint256 i = 0; i < userAppointments.length; i++) {
            firstNames[i] = userAppointments[i].firstName;
            lastNames[i] = userAppointments[i].lastName;
            emails[i] = userAppointments[i].email;
            numbers[i] = userAppointments[i].number;
            adrs[i] = userAppointments[i].adr;
            timeSlots[i] = userAppointments[i].timeSlot;
            doctors[i] = userAppointments[i].doctor;
            status[i] = userAppointments[i].status;
        }

        return (
            firstNames,
            lastNames,
            emails,
            numbers,
            adrs,
            timeSlots,
            doctors,
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
            string[] memory timeSlots,
            string[] memory doctors,
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
        timeSlots = new string[](userAppointments.length);
        doctors = new string[](userAppointments.length);
        status = new string[](userAppointments.length);

        for (uint256 i = 0; i < userAppointments.length; i++) {
            firstNames[i] = userAppointments[i].firstName;
            lastNames[i] = userAppointments[i].lastName;
            emails[i] = userAppointments[i].email;
            numbers[i] = userAppointments[i].number;
            adrs[i] = userAppointments[i].adr;
            timeSlots[i] = userAppointments[i].timeSlot;
            doctors[i] = userAppointments[i].doctor;
            status[i] = userAppointments[i].status;
        }

        return (
            firstNames,
            lastNames,
            emails,
            numbers,
            adrs,
            timeSlots,
            doctors,
            status
        );
    }

    function getAllAppointments() public view returns (appointment[] memory) {
        return allAppointments;
    }

    function getAllAppointmentsLength() public view returns (uint) {
        return allAppointments.length;
    }
}
