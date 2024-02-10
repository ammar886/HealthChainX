// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Auth
{ 
	uint public userCount = 0;
	uint public employeeCount = 0;

	mapping(string => user) users;
	mapping(string => employee) employees;

	struct user
	{
	string username;
	string password;
	string email;
	string number;
	}

	struct employee
	{
	    string firstName;
	    string lastName;
	    string email;
	    string number;
        string address1;
        string address2;
        string userRole;
	}

// events

event userCreated(
	string username,
	string email,
	string number,
	string password
	);

event employeeCreated(
        string firstName,
	    string lastName,
	    string email,
	    string number,
        string address1,
        string address2,
        string userRole
	);

//user account creation and authenication logic below

function createUser(string memory _username,
					string memory _password,
					string memory _email,
					string memory _number) public
{	 
	userCount++;
	 users[_username] = user(_username, _password, _email, _number);
	emit userCreated(_username,
					_password, _email, _number);
	}

	function getUserData(string memory _username) public view returns (user memory){
	return users[_username];
}

function authenticateLogin(string memory _username, string memory _password) public view returns (bool){
    user memory userInstance = getUserData(_username);
	
     return keccak256(abi.encodePacked(userInstance.password)) == keccak256(abi.encodePacked(_password));
}

//admin creates users here
	
	function createEmployee(string memory _firstName, string memory _lastName, string memory _email, string memory _number, string memory _address1, string memory _address2, string memory _userRole) public{
        employeeCount++;
        employees[_firstName] = employee(_firstName, _lastName, _email, _number, _address1, _address2, _userRole);
        emit employeeCreated(_firstName, _lastName, _email, _number, _address1, _address2, _userRole);
	}

}


