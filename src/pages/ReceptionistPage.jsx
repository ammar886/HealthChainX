import { useState, useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import { AuthContext } from "../context/AuthContext";
import Topbar from "../components/Topbar";
import ProfileDetails from "../components/ProfileDetails";
import Sidebar from "../components/receptionist/Sidebar";
import ReceptionistDashboard from "../components/receptionist/ReceptionistDashboard";
import ManagePatients from "../components/receptionist/ManagePatients";
import PatientRegistration from "../components/receptionist/PatientRegistration";
import BookAppointmentForm from "../components/receptionist/BookAppointmentForm";
import BillingPayment from "../components/receptionist/BillingPayment";
import Faq from "../components/Faq";

function ReceptionistPage() {
  const navigate = useNavigate();
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
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
              <Route
                path="PatientRegistration"
                element={<PatientRegistration />}
              />
              <Route
                path="BookAppointmentForm"
                element={<BookAppointmentForm />}
              />
              <Route path="BillingPayment" element={<BillingPayment />} />
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