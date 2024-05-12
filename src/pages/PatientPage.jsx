import { useState, useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import { AuthContext } from '../context/AuthContext';
import Topbar from "../components/Topbar";
import ProfileDetails from "../components/ProfileDetails";
import Sidebar from "../components/patient/Sidebar";
import PatientDashboard from "../components/patient/PatientDashboard";
import MedicalRecords from "../components/patient/MedicalRecords";
import AppointmentHistory from "../components/patient/AppointmentHistory";
import BookAppointmentForm from "../components/patient/BookAppointmentForm";
import Invoices from "../components/patient/Invoices";
import Faq from "../components/Faq";

function PatientPage() {
  const navigate = useNavigate();
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<PatientDashboard />} />
              <Route path="appointmenthistory" element={<AppointmentHistory />} />
              <Route path="medicalrecords" element={<MedicalRecords />} />
              <Route path="bookappointmentform" element={<BookAppointmentForm />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="faq" element={<Faq />} />
              <Route path="profiledetails" element={<ProfileDetails />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default PatientPage;
