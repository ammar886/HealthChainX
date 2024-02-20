import React, { useEffect, useContext } from "react";
import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminPage from "./pages/AdminPage";
import DoctorPage from "./pages/DoctorPage";
import PatientPage from "./pages/PatientPage";
import ReceptionistPage from "./pages/ReceptionistPage";
import { AuthContext } from './context/AuthContext';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { isAuthenticated, userRole } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // Retrieve the authentication data from localStorage when the component mounts
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
    const storedUserRole = localStorage.getItem('userRole');

    // If the user is authenticated and the user role is valid, navigate to the appropriate page
    if (storedIsAuthenticated === 'true' && ['admin', 'doctor', 'receptionist', 'patient'].includes(storedUserRole)) {
      navigate(`/${storedUserRole.toLowerCase()}`);
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/*" element={<LandingPage />} />
        <Route path="/admin/*" element={isAuthenticated && userRole === 'admin' ? <AdminPage /> : <Navigate to="/" />} />
        <Route path="/doctor/*" element={isAuthenticated && userRole === 'doctor' ? <DoctorPage /> : <Navigate to="/" />} />
        <Route path="/receptionist/*" element={isAuthenticated && userRole === 'receptionist' ? <ReceptionistPage /> : <Navigate to="/" />} />
        <Route path="/patient/*" element={isAuthenticated && userRole === 'patient' ? <PatientPage /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;