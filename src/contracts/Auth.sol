// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Auth {
    uint public userCount = 0;
    uint public employeeCount = 0;
    
    address public adminAddress; //fix this
    
    mapping(address => authMemory) authUsersByBlockchain;
    mapping(string => authMemory) authUsersByEmail;

    mapping(address => user[]) users;
    mapping(address => employee[]) employees;

    user[] public allUsers;
    employee[] public allEmployees;
    
    mapping(address => bool) private usedBlockchainAddresses;
    mapping(string => bool) private usedEmails;

    struct user {
        address blockChainAdd;
        string username;
        string email;
        string number;
        string userRole;
        string password;
    }

    struct employee {
        address blockChainAdd;
        string username;
        string email;
        string number;
        string adr;
        string qualifications;
        string userRole;
        string specialization;
        string startShiftTime;
        string endShiftTime;
        string shiftDuration;
        string password;
    }

    struct authMemory {
        address blockChainAdd;
        string username;
        string email;
        string userRole;
        string password;
    }

    event userCreated(
        address blockChainAdd,
        string username,
        string email,
        string number,
        string userRole,
        string password
    );

    event employeeCreated(
        address blockChainAdd,
        string username,
        string email,
        string number,
        string adr,
        string qualifications,
        string userRole,
        string specialization,
        string startShiftTime,
        string endShiftTime,
        string shiftDuration,
        string password
    );

    event authCreated(
        address blockChainAdd,
        string username,
        string email,
        string userRole,
        string password
    );

    function isEmailUsed(string memory email) public view returns (bool) {
        return usedEmails[email];
    }

    function isBlockchainAddressUsed(
        address blockchainAddress
    ) public view returns (bool) {
        return usedBlockchainAddresses[blockchainAddress];
    }

    function createUser(
        address _blockChainAdd,
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
        users[_blockChainAdd].push(newUser);
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

        createAuth(_blockChainAdd, _username, _email, _userRole, _password);
    }

    function getUserDetails(address blockChainAddress) public view returns (user memory) {
        for (uint i = 0; i < allUsers.length; i++) {
            if (keccak256(abi.encodePacked((allUsers[i].blockChainAdd))) == keccak256(abi.encodePacked((blockChainAddress)))) {
                return allUsers[i];
            }
        }
        revert("User not found");
    }

    function getEmployeeDetails(address blockChainAddress) public view returns (employee memory) {
        for (uint i = 0; i < allEmployees.length; i++) {
            if (keccak256(abi.encodePacked((allEmployees[i].blockChainAdd))) == keccak256(abi.encodePacked((blockChainAddress)))) {
                return allEmployees[i];
            }
        }
        revert("User not found");
    }

    function createEmployee(
        address _blockChainAdd,
        string memory _username,
        string memory _email,
        string memory _number,
        string memory _adr,
        string memory _qualifications,
        string memory _userRole,
        string memory _specialization,
        string memory _startShiftTime,
        string memory _endShiftTime,
        string memory _shiftDuration,
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
            _shiftDuration,
            _password
        );
        employees[_blockChainAdd].push(newEmployee);
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
            _shiftDuration,
            _password
        );

        usedEmails[_email] = true;
        usedBlockchainAddresses[_blockChainAdd] = true;

        createAuth(_blockChainAdd, _username, _email, _userRole, _password);
    }

    function createAuth(
        address _blockChainAdd,
        string memory _username,
        string memory _email,
        string memory _userRole,
        string memory _password
    ) public {

        authUsersByBlockchain[_blockChainAdd] = authMemory(
            _blockChainAdd,
            _username,
            _email,
            _userRole,
            _password
        );
        authUsersByEmail[_email] = authMemory(
            _blockChainAdd,
            _username,
            _email,
            _userRole,
            _password
        );
        emit authCreated(
            _blockChainAdd,
            _username,
            _email,
            _userRole,
            _password
        );
    }

    function authenticateLogin(
        string memory _email,
        string memory _password
    ) public view returns (bool, address, string memory, string memory) {
        authMemory memory userInstance = authUsersByEmail[_email];

        if (bytes(userInstance.email).length == 0) {
            return (false, address(0), "", "");
        } else {
            if (keccak256(abi.encodePacked(userInstance.password)) == keccak256(abi.encodePacked(_password))) {
                return (true, userInstance.blockChainAdd, userInstance.username, userInstance.userRole);
            } else {
                return (false, address(0), "", "");
            }
        }
    }

    function getDoctors() public view returns (address[] memory, string[] memory, string[] memory, string[] memory, string[] memory, string[] memory) {

        uint256 doctorCount = getLengthEmployees("doctor");

        address[] memory blockChainAdds = new address[](doctorCount);
        string[] memory userNames = new string[](doctorCount);
        string[] memory specializations = new string[](doctorCount);
        string[] memory startShiftTimes = new string[](doctorCount);
        string[] memory endShiftTimes = new string[](doctorCount);
        string[] memory shiftDurations = new string[](doctorCount);
        
        uint256 doctorIndex = 0;
        for (uint256 i = 0; i < allEmployees.length; i++) {
            if (keccak256(abi.encodePacked(allEmployees[i].userRole)) == keccak256(abi.encodePacked("doctor"))) {
                blockChainAdds[doctorIndex] = allEmployees[i].blockChainAdd;
                userNames[doctorIndex] = allEmployees[i].username;
                specializations[doctorIndex] = allEmployees[i].specialization;
                startShiftTimes[doctorIndex] = allEmployees[i].startShiftTime;
                endShiftTimes[doctorIndex] = allEmployees[i].endShiftTime;
                shiftDurations[doctorIndex] = allEmployees[i].shiftDuration;
                doctorIndex++;
            }
        }

        return (blockChainAdds, userNames, specializations, startShiftTimes, endShiftTimes, shiftDurations);
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

    function getPatients() public view returns (address[] memory, string[] memory, string[] memory, string[] memory, string[] memory) {

        address[] memory blockChainAdds = new address[](userCount);
        string[] memory usernames = new string[](userCount);
        string[] memory emails = new string[](userCount);
        string[] memory numbers = new string[](userCount);
        string[] memory userRoles = new string[](userCount);

        for (uint256 i = 0; i < allUsers.length; i++) {
            blockChainAdds[i] = allUsers[i].blockChainAdd;
            usernames[i] = allUsers[i].username;
            emails[i] = allUsers[i].email;
            numbers[i] = allUsers[i].number;
            userRoles[i] = allUsers[i].userRole;
        }

        return (blockChainAdds, usernames, emails, numbers, userRoles);
    }
}