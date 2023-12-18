// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Auth
{ 
	uint public userCount = 0;

	mapping(string => user) users;

	struct user
	{
	string username;
	string password;
	string email;
	string number;
	}

// events

event userCreated(
	string username,
	string email,
	string number,
	string password
	);

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
}


