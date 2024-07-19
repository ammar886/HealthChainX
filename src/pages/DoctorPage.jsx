import { useState, useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import { AuthContext } from '../context/AuthContext';
import Topbar from "../components/Topbar";
import ProfileDetails from "../components/ProfileDetails";
import Sidebar from "../components/doctor/Sidebar";
import DoctorDashboard from "../components/doctor/DoctorDashboard";
import ManagePrescriptions from "../components/doctor/ManagePrescriptions";
import ManageAppointments from "../components/doctor/ManageAppointments";
import PrescriptionForm from "../components/doctor/PrescriptionForm";
import FAQ from "../components/Faq";

function DoctorPage() {
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
              <Route path="/" element={<DoctorDashboard />} />
              <Route path="manageprescriptions" element={<ManagePrescriptions />} />
              <Route path="manageappointments" element={<ManageAppointments />} />
              <Route path="prescriptionform" element={<PrescriptionForm />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="profiledetails" element={<ProfileDetails />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default DoctorPage;
