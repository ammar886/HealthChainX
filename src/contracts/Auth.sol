// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Auth {
    uint public userCount = 0;
    uint public employeeCount = 0;
    uint public totalAppointmets = 0;

    mapping(string => user) users;
    mapping(string => employee) employees;
    mapping(address => appointment[]) appointments;

    mapping(string => bool) private usedEmails;
    mapping(string => bool) private usedBlockchainAddresses;

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
        string doctor
    );

    function isEmailUsed(string memory email) public view returns (bool) {
        return usedEmails[email];
    }

    function isBlockchainAddressUsed(string memory blockchainAddress) public view returns (bool) {
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
        require(!isEmailUsed(_email), "Email is already used. Please, use another email.");
        require(!isBlockchainAddressUsed(_blockChainAdd), "Blockchain address is already used. Please, use another blockchain address.");
        
        userCount++;
        users[_username] = user(
            _username,
            _password,
            _email,
            _number,
            _userRole,
            _blockChainAdd
        );
        emit userCreated(_username, _password, _email, _number, _userRole, _blockChainAdd);

        usedEmails[_email] = true;
        usedBlockchainAddresses[_blockChainAdd] = true;
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
        require(!isEmailUsed(_email), "Email is already used. Please, use another email.");
        require(!isBlockchainAddressUsed(_blockChainAdd), "Blockchain address is already used. Please, use another blockchain address.");
        
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
        string memory _doctor
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
            _doctor
        );
        appointments[msg.sender].push(newAppointment);
        emit appointmentCreated(
            msg.sender,
            _firstName,
            _lastName,
            _email,
            _number,
            _adr,
            _timeSlot,
            _doctor
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
        string[] memory doctors
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

        for (uint256 i = 0; i < userAppointments.length; i++) {
            firstNames[i] = userAppointments[i].firstName;
            lastNames[i] = userAppointments[i].lastName;
            emails[i] = userAppointments[i].email;
            numbers[i] = userAppointments[i].number;
            adrs[i] = userAppointments[i].adr;
            timeSlots[i] = userAppointments[i].timeSlot;
            doctors[i] = userAppointments[i].doctor;
        }

        return (firstNames, lastNames, emails, numbers, adrs, timeSlots, doctors);
    }
    
}
