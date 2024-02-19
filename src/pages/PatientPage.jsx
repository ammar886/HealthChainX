import { useState, useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import { AuthContext } from '../context/AuthContext';
import PatientTopbar from "../components/patient/PatientTopbar";
import PatientSidebar from "../components/patient/PatientSidebar";
import PatientDashboard from "../components/patient/PatientDashboard";
import MedicalRecord from "../components/patient/MedicalRecord";
import BookedAppointment from "../components/patient/BookedAppointment";
import BillPayment from "../components/patient/BillPayment";
import FormBookAppointment from "../components/patient/FormBookAppointment";
import FeedbackFaq from "../components/patient/FeedbackFaq";

function PatientPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

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
          <PatientSidebar isSidebar={isSidebar} />
          <main className="content">
            <PatientTopbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<PatientDashboard />} />
              <Route path="medicalrecord" element={<MedicalRecord />} />
              <Route path="billpayment" element={<BillPayment />} />
              <Route path="bookedappointment" element={<BookedAppointment />} />
              <Route path="formbookappointment" element={<FormBookAppointment />} />
              <Route path="feedbackfaq" element={<FeedbackFaq />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default PatientPage;
