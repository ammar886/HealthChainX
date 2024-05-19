// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Auth {
    uint public userCount = 0;
    uint public employeeCount = 0;
    uint public totalAppointmets = 0;
    address public adminAddress; //fix this

    mapping(string => authMemory) authUsers;
    mapping(string => user[]) users;
    mapping(string => employee[]) employees;
    mapping(address => appointment[]) appointments;

    mapping(string => bool) private usedEmails;
    mapping(string => bool) private usedBlockchainAddresses;
    
    employee[] public allEmployees;
    appointment[] public allAppointments;  
    user[] public allUsers;  

    struct user {
        string blockChainAdd;
        string username;
        string email;
        string number;
        string userRole;
        string password;
    }

    struct employee {
        string blockChainAdd;
        string username;
        string email;
        string number;
        string adr;
        string qualifications;
        string userRole;
        string specialization;
        string startShiftTime;
        string endShiftTime;
        string password;
    }

    struct authMemory {
        string blockChainAdd;
        string email;
        string userRole;
        string password;
    }

    struct appointment {
        address owner;
        string firstName;
        string lastName;
        string email;
        string number;
        string adr;
        string doctor;
        string timeSlot;
        string status;
    }

    event userCreated(
        string blockChainAdd,
        string username,
        string email,
        string number,
        string userRole,
        string password
    );

    event employeeCreated(
        string blockChainAdd,
        string username,
        string email,
        string number,
        string adr,
        string qualifications,
        string userRole,
        string specialization,
        string startShiftTime,
        string endShiftTime,
        string password
    );

    event authCreated(
        string blockChainAdd,
        string email,
        string userRole,
        string password
    );

    event appointmentCreated(
        address owner,
        string firstName,
        string lastName,
        string email,
        string number,
        string adr,
        string doctor,
        string timeSlot,
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
        string memory _blockChainAdd,
        string memory _username,
        string memory _email,
        string memory _number,
        string memory _userRole,
        string memory _password
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
        user memory newUser = user(
            _blockChainAdd,
            _username,
            _email,
            _number,
            _userRole,
            _password
        );
        users[_email].push(newUser);
        allUsers.push(newUser);
        emit userCreated(
            _blockChainAdd,
            _username,
            _email,
            _number,
            _userRole,
            _password
        );

        usedEmails[_email] = true;
        usedBlockchainAddresses[_blockChainAdd] = true;

        createAuth(_blockChainAdd, _email, _userRole, _password);
    }

    function getUserDetails(string memory blockChainAddress) public view returns (user memory) {
        for (uint i = 0; i < allUsers.length; i++) {
            if (keccak256(abi.encodePacked((allUsers[i].blockChainAdd))) == keccak256(abi.encodePacked((blockChainAddress)))) {
                return allUsers[i];
            }
        }
        revert("User not found");
    }

    function getEmployeeDetails(string memory blockChainAddress) public view returns (employee memory) {
        for (uint i = 0; i < allEmployees.length; i++) {
            if (keccak256(abi.encodePacked((allEmployees[i].blockChainAdd))) == keccak256(abi.encodePacked((blockChainAddress)))) {
                return allEmployees[i];
            }
        }
        revert("User not found");
    }

    function createEmployee(
        string memory _blockChainAdd,
        string memory _username,
        string memory _email,
        string memory _number,
        string memory _adr,
        string memory _qualifications,
        string memory _userRole,
        string memory _specialization,
        string memory _startShiftTime,
        string memory _endShiftTime,
        string memory _password
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
        employee memory newEmployee = employee(
            _blockChainAdd,
            _username,
            _email,
            _number,
            _adr,
            _qualifications,
            _userRole,
            _specialization,
            _startShiftTime,
            _endShiftTime,
            _password
        );
        employees[_email].push(newEmployee);
        allEmployees.push(newEmployee);
        emit employeeCreated(
            _blockChainAdd,
            _username,
            _email,
            _number,
            _adr,
            _qualifications,
            _userRole,
            _specialization,
            _startShiftTime,
            _endShiftTime,
            _password
        );

        usedEmails[_email] = true;
        usedBlockchainAddresses[_blockChainAdd] = true;

        createAuth(_blockChainAdd, _email, _userRole, _password);
    }

    function createAuth(
        string memory _blockChainAdd,
        string memory _email,
        string memory _userRole,
        string memory _password
    ) public {

        authUsers[_email] = authMemory(
            _blockChainAdd,
            _email,
            _userRole,
            _password
        );
        emit authCreated(
            _blockChainAdd,
            _email,
            _userRole,
            _password
        );
    }

    function authenticateLogin(
        string memory _email,
        string memory _password
    ) public view returns (bool, string memory, string memory) {
        authMemory memory userInstance = authUsers[_email];

        if (bytes(userInstance.email).length == 0) {
            return (false, "", "");
        } else {
            if (keccak256(abi.encodePacked(userInstance.password)) == keccak256(abi.encodePacked(_password))) {
                return (true, userInstance.userRole, userInstance.blockChainAdd);
            } else {
                return (false, "", "");
            }
        }
    }

    function bookAppointment(
        string memory _firstName,
        string memory _lastName,
        string memory _email,
        string memory _number,
        string memory _adr,
        string memory _doctor,
        string memory _timeSlot,
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
            _doctor,
            _timeSlot,
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
            _doctor,
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

    function getDoctors() public view returns (string[] memory, string[] memory) {

        uint256 doctorCount = getLengthEmployees("doctor");
        
        string[] memory userNames = new string[](doctorCount);
        string[] memory blockChainAdds = new string[](doctorCount);

        uint256 doctorIndex = 0;
        for (uint256 i = 0; i < allEmployees.length; i++) {
            if (keccak256(abi.encodePacked(allEmployees[i].userRole)) == keccak256(abi.encodePacked("doctor"))) {
                userNames[doctorIndex] = allEmployees[i].username;
                blockChainAdds[doctorIndex] = allEmployees[i].blockChainAdd;
                doctorIndex++;
            }
        }

        return (userNames, blockChainAdds);
    }

    function getLengthEmployees(
        string memory _userRole
    ) public view returns (uint256) {
        uint256 accountCount = 0;
        if (keccak256(abi.encodePacked(_userRole)) == keccak256(abi.encodePacked("patient"))) {
            for (uint256 i = 0; i < allUsers.length; i++) {
                if (keccak256(abi.encodePacked(allUsers[i].userRole)) == keccak256(abi.encodePacked(_userRole))) {
                    accountCount++;
                }
            }
        } else {
            for (uint256 i = 0; i < allEmployees.length; i++) {
                if (keccak256(abi.encodePacked(allEmployees[i].userRole)) == keccak256(abi.encodePacked(_userRole))) {
                    accountCount++;
                }
            }
        }

        return accountCount;
    }

    function getPatients() public view returns (string[] memory, string[] memory) {

        uint256 patientCount = 0;
        for (uint256 i = 0; i < allUsers.length; i++) {
            if (keccak256(abi.encodePacked(allUsers[i].userRole)) == keccak256(abi.encodePacked("patient"))) {
                patientCount++;
            }
        }
        
        
        string[] memory username = new string[](patientCount);
        string[] memory blockChainAdds = new string[](patientCount);

        uint256 patientIndex = 0;
        for (uint256 i = 0; i < allUsers.length; i++) {
            if (keccak256(abi.encodePacked(allUsers[i].userRole)) == keccak256(abi.encodePacked("patient"))) {
                username[patientIndex] = allUsers[i].username;
                blockChainAdds[patientIndex] = allUsers[i].blockChainAdd;
                patientIndex++;
            }
        }

        return (username, blockChainAdds);
    }
}
