// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Auth {
    uint public userCount = 0;
    uint public employeeCount = 0;
    
    address public adminAddress; //fix this

    mapping(string => authMemory) authUsers;
    mapping(string => user[]) users;
    mapping(string => employee[]) employees;
    

    mapping(string => bool) private usedEmails;
    mapping(string => bool) private usedBlockchainAddresses;
    
    employee[] public allEmployees;
     
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
        string shiftDuration;
        string password;
    }

    struct authMemory {
        string blockChainAdd;
        string username;
        string email;
        string userRole;
        string password;
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
        string shiftDuration,
        string password
    );

    event authCreated(
        string blockChainAdd,
        string username,
        string email,
        string userRole,
        string password
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

        createAuth(_blockChainAdd, _username, _email, _userRole, _password);
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
            _shiftDuration,
            _password
        );

        usedEmails[_email] = true;
        usedBlockchainAddresses[_blockChainAdd] = true;

        createAuth(_blockChainAdd, _username, _email, _userRole, _password);
    }

    function createAuth(
        string memory _blockChainAdd,
        string memory _username,
        string memory _email,
        string memory _userRole,
        string memory _password
    ) public {

        authUsers[_email] = authMemory(
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
    ) public view returns (bool, string memory, string memory, string memory) {
        authMemory memory userInstance = authUsers[_email];

        if (bytes(userInstance.email).length == 0) {
            return (false, "", "", "");
        } else {
            if (keccak256(abi.encodePacked(userInstance.password)) == keccak256(abi.encodePacked(_password))) {
                return (true, userInstance.blockChainAdd, userInstance.username, userInstance.userRole);
            } else {
                return (false, "", "", "");
            }
        }
    }

    function getDoctors() public view returns (string[] memory, string[] memory, string[] memory, string[] memory, string[] memory) {

        uint256 doctorCount = getLengthEmployees("doctor");

        string[] memory blockChainAdds = new string[](doctorCount);
        string[] memory userNames = new string[](doctorCount);
        string[] memory startShiftTimes = new string[](doctorCount);
        string[] memory endShiftTimes = new string[](doctorCount);
        string[] memory shiftDurations = new string[](doctorCount);
        
        uint256 doctorIndex = 0;
        for (uint256 i = 0; i < allEmployees.length; i++) {
            if (keccak256(abi.encodePacked(allEmployees[i].userRole)) == keccak256(abi.encodePacked("doctor"))) {
                blockChainAdds[doctorIndex] = allEmployees[i].blockChainAdd;
                userNames[doctorIndex] = allEmployees[i].username;
                startShiftTimes[doctorIndex] = allEmployees[i].startShiftTime;
                endShiftTimes[doctorIndex] = allEmployees[i].endShiftTime;
                shiftDurations[doctorIndex] = allEmployees[i].shiftDuration;
                doctorIndex++;
            }
        }

        return (blockChainAdds, userNames, startShiftTimes, endShiftTimes, shiftDurations);
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