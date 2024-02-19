import React from 'react';

const DoctorPage = () => {
  const doctors = [
    { id: 1, name: 'Dr. John Doe', specialty: 'Cardiology' },
    { id: 2, name: 'Dr. Jane Smith', specialty: 'Dermatology' },
    { id: 3, name: 'Dr. David Johnson', specialty: 'Orthopedics' },
  ];

  return (
    <div>
      <h1>Doctor Page</h1>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor.id}>
            {doctor.name} - {doctor.specialty}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorPage;
