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

    mapping(string => bool) private usedEmails;
    mapping(string => bool) private usedBlockchainAddresses;

    appointment[] public allAppointments;
    docEmployee[] public docemployees;

    constructor() {
        adminAddress = 0x5b13955ab787Bb94D98EBc84ff4Af43dA605Ab84;
    }

    struct docEmployee {
        string firstName;
        string lastName;
        string blockChainAdd;
        string userRole;
    }

    struct user {
        string username;
        string password;
        string email;
        string number;
        string userRole;
        string blockChainAdd;
    }

    struct employee {
        string firstName;
        string lastName;
        string email;
        string number;
        string adr;
        string password;
        string userRole;
        string blockChainAdd;
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
        string userRole,
        string blockChainAdd
    );

    event employeeCreated(
        string firstName,
        string lastName,
        string email,
        string number,
        string adr,
        string password,
        string userRole,
        string blockChainAdd
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

    function isEmailUsed(string memory email) public view returns (bool) {
        return usedEmails[email];
    }

    function isBlockchainAddressUsed(
        string memory blockchainAddress
    ) public view returns (bool) {
        return usedBlockchainAddresses[blockchainAddress];
    }

    function createUser(
        string memory _username,
        string memory _password,
        string memory _email,
        string memory _number,
        string memory _userRole,
        string memory _blockChainAdd
    ) public {
        require(
            !isEmailUsed(_email),
            "Email is already used. Please, use another email."
        );
        require(
            !isBlockchainAddressUsed(_blockChainAdd),
            "Blockchain address is already used. Please, use another blockchain address."
        );

        userCount++;
        users[_username] = user(
            _username,
            _password,
            _email,
            _number,
            _userRole,
            _blockChainAdd
        );
        emit userCreated(
            _username,
            _password,
            _email,
            _number,
            _userRole,
            _blockChainAdd
        );

        usedEmails[_email] = true;
        usedBlockchainAddresses[_blockChainAdd] = true;
    }

    function getUserDetails(string memory username) public view returns (string memory, string memory, string memory, string memory, string memory) {
        user memory userInstance = users[username];
        return (userInstance.username, userInstance.email, userInstance.number, userInstance.userRole, userInstance.blockChainAdd);
    }

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
        string memory _userRole,
        string memory _blockChainAdd
    ) public {
        require(
            !isEmailUsed(_email),
            "Email is already used. Please, use another email."
        );
        require(
            !isBlockchainAddressUsed(_blockChainAdd),
            "Blockchain address is already used. Please, use another blockchain address."
        );

        employeeCount++;
        employees[_firstName] = employee(
            _firstName,
            _lastName,
            _email,
            _number,
            _adr,
            _password,
            _userRole,
            _blockChainAdd
        );
        emit employeeCreated(
            _firstName,
            _lastName,
            _email,
            _number,
            _adr,
            _password,
            _userRole,
            _blockChainAdd
        );

        usedEmails[_email] = true;
        usedBlockchainAddresses[_blockChainAdd] = true;
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
        appointment[] memory userAppointments = appointments[msg.sender];
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

    // function getAllAppointments() public view returns (appointment[] memory) {
    //     return allAppointments;
    // }

    function getAllAppointments()
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
        timeSlots = new string[](appointmentList.length);
        doctors = new string[](appointmentList.length);
        status = new string[](appointmentList.length);
        owner = new address[](appointmentList.length);
        for (uint256 i = 0; i < appointmentList.length; i++) {
            firstNames[i] = appointmentList[i].firstName;
            lastNames[i] = appointmentList[i].lastName;
            emails[i] = appointmentList[i].email;
            numbers[i] = appointmentList[i].number;
            adrs[i] = appointmentList[i].adr;
            timeSlots[i] = appointmentList[i].timeSlot;
            doctors[i] = appointmentList[i].doctor;
            status[i] = appointmentList[i].status;
            owner[i] = appointmentList[i].owner;
        }

        return (
            firstNames,
            lastNames,
            emails,
            numbers,
            adrs,
            timeSlots,
            doctors,
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

    function getDoctors() public view returns (string[] memory, string[] memory, string[] memory) {
        uint256 doctorCount = 0;
        for (uint256 i = 0; i < docemployees.length; i++) {
            if (keccak256(abi.encodePacked(docemployees[i].userRole)) == keccak256(abi.encodePacked("doctor"))) {
                doctorCount++;
            }
        }

        string[] memory firstNames = new string[](doctorCount);
        string[] memory lastNames = new string[](doctorCount);
        string[] memory blockChainAdds = new string[](doctorCount);

        uint256 doctorIndex = 0;
        for (uint256 i = 0; i < docemployees.length; i++) {
            if (keccak256(abi.encodePacked(docemployees[i].userRole)) == keccak256(abi.encodePacked("doctor"))) {
                firstNames[doctorIndex] = docemployees[i].firstName;
                lastNames[doctorIndex] = docemployees[i].lastName;
                blockChainAdds[doctorIndex] = docemployees[i].blockChainAdd;
                doctorIndex++;
            }
        }

        return (firstNames, lastNames, blockChainAdds);
    }
}
