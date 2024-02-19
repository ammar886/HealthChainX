import { useState, useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "../components/admin/mainComponents/Topbar";
import Sidebar from "../components/admin/mainComponents/Sidebar";
import Dashboard from "../components/admin/mainComponents/Dashboard";
import Team from "../components/admin/mainComponents/Team";
import Invoices from "../components/admin/mainComponents/Invoices";
import Contacts from "../components/admin/mainComponents/Contacts";
import Bar from "../components/admin/mainComponents/Bar";
import Form from "../components/admin/mainComponents/Form";
import Line from "../components/admin/mainComponents/Line";
import Pie from "../components/admin/mainComponents/Pie";
import FAQ from "../components/admin/mainComponents/Faq";
import Geography from "../components/admin/mainComponents/Geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import { AuthContext } from '../context/AuthContext';


function AdminPage({ onBackToLandingPageClick }) {
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
            <Topbar setIsSidebar={setIsSidebar} logOut={onBackToLandingPageClick} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="team" element={<Team />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="form" element={<Form />} />
              <Route path="bar" element={<Bar />} />
              <Route path="pie" element={<Pie />} />
              <Route path="line" element={<Line />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="geography" element={<Geography />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default AdminPage;
