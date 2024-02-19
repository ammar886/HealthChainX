import React from 'react';

const ReceptionistPage = () => {
  const patients = [
    { id: 1, name: 'John Doe', age: 30, gender: 'Male' },
    { id: 2, name: 'Jane Smith', age: 25, gender: 'Female' },
    { id: 3, name: 'Michael Johnson', age: 40, gender: 'Male' },
  ];

  return (
    <div>
      <h1>Receptionist Page</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReceptionistPage;