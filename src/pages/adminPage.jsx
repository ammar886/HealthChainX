import { useState, useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import { AuthContext } from '../context/AuthContext';
import Topbar from "../components/admin/Topbar";
import Sidebar from "../components/admin/Sidebar";
import Dashboard from "../components/admin/Dashboard";
import ManagePatient from "../components/admin/ManagePatient";
import Invoices from "../components/admin/Invoices";
import ManageAppointments from "../components/admin/ManageAppointments";
import Form from "../components/admin/Form";
import FAQ from "../components/admin/Faq";


function AdminPage() {
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
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="managepatient" element={<ManagePatient />} />
              <Route path="manageappointments" element={<ManageAppointments />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="form" element={<Form />} />
              <Route path="faq" element={<FAQ />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default AdminPage;
