import { useState, useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import { AuthContext } from '../context/AuthContext';
import Topbar from "../components/Topbar";
import ProfileDetails from "../components/ProfileDetails";
import Sidebar from "../components/patient/Sidebar";
import ReceptionistDashboard from "../components/receptionist/ReceptionistDashboard";
import ManagePatients from "../components/receptionist/ManagePatients";
import ManageAppointments from "../components/receptionist/ManageAppointments";
import CreateAppointmentForm from "../components/receptionist/CreateAppointmentForm";
import Invoices from "../components/receptionist/Invoices";
import Faq from "../components/Faq";

function ReceptionistPage() {
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
              <Route path="/" element={<ReceptionistDashboard />} />
              <Route path="managepatients" element={<ManagePatients />} />
              <Route path="manageappointments" element={<ManageAppointments />} />
              <Route path="createappointmentform" element={<CreateAppointmentForm />} />
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

export default ReceptionistPage;
