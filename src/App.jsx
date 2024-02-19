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

  return (
    <div>
      <Routes>
        <Route path="/*" element={<LandingPage />} />
        <Route path="/admin/*" element={isAuthenticated && userRole === 'Admin' ? <AdminPage /> : <Navigate to="/" />} />
        <Route path="/doctor/*" element={isAuthenticated && userRole === 'Doctor' ? <DoctorPage /> : <Navigate to="/" />} />
        <Route path="/receptionist/*" element={isAuthenticated && userRole === 'Receptionist' ? <ReceptionistPage /> : <Navigate to="/" />} />
        <Route path="/patient/*" element={isAuthenticated && userRole === 'Patient' ? <PatientPage /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;