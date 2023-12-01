// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Auth
{ 
	uint public userCount = 0;

	mapping(string => user) public usersList;

	struct user
	{
	string username;
	string password;
	}

// events

event userCreated(
	string username,
	string password
	);

function createUser(string memory _username,
					string memory _password) public
{	 
	userCount++;
	usersList[_username] = user(_username,
							_password);
	emit userCreated(_username,
					_password);
	}
}

