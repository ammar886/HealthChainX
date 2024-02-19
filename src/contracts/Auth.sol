// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Auth
{ 
	uint public userCount = 0;
	uint public employeeCount = 0;
	uint public totalAppointmets = 0;

	mapping(string => user) users;
	mapping(string => employee) employees;
	mapping(string => appointment) appointments;

	struct user
	{
		string username;
		string password;
		string email;
		string number;
		string userRole;
	}

	struct employee
	{
	    string firstName;
	    string lastName;
	    string email;
	    string number;
        string adr;
        string password;
        string userRole;
	}

	struct appointment
	{
		string firstName;
		string lastName;
		string email;
		string number;
		string adr;
		string timeSlot;
		string doctor;
	}

// events

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
		string firstName,
		string lastName,
		string email,
		string number,
		string adr,
		string timeSlot,
		string doctor
	);

	//user account creation and authenication logic below

	function createUser(string memory _username,
						string memory _password,
						string memory _email,
						string memory _number,
						string memory _userRole) public
	{	 
		userCount++;
		users[_username] = user(_username, _password, _email, _number, _userRole);
		emit userCreated(_username,
						_password, _email, _number, _userRole);
		}

		function getUserData(string memory _username) public view returns (user memory){
		return users[_username];
	}

	function authenticateLogin(string memory _username, string memory _password) public view returns (bool){
		user memory userInstance = getUserData(_username);
		
		return keccak256(abi.encodePacked(userInstance.password)) == keccak256(abi.encodePacked(_password));
	}

	//admin creates users here
	
	function createEmployee(string memory _firstName, string memory _lastName, string memory _email, string memory _number, string memory _adr, string memory _password, string memory _userRole) public{
        employeeCount++;
        employees[_firstName] = employee(_firstName, _lastName, _email, _number, _adr, _password, _userRole);
        emit employeeCreated(_firstName, _lastName, _email, _number, _adr, _password, _userRole);
	}

	function bookAppointment(string memory _firstName, string memory _lastName, string memory _email, string memory _number, string memory _adr, string memory _timeSlot, string memory _doctor) public{
		totalAppointmets++;
		appointments[_email] = appointment(_firstName, _lastName, _email, _number,_adr, _timeSlot, _doctor);
		emit appointmentCreated(_firstName,_lastName,_email,_number,_adr,_timeSlot,_doctor);

	}

	function getAppointmentCount() public view returns (uint){
		return totalAppointmets;
	}
}




