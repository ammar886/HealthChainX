import { useState, useEffect, useContext } from 'react';
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { AuthContext } from '../../context/AuthContext';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Header from "../Header";
import StatBox from "../StatBox";

const DoctorDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [auth, setAuth] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState(0);
  const [completedAppointments, setCompletedAppointments] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);
  const { blockchainAddress } = useContext(AuthContext);

  const loadAccounts = async () => {
    let { auth, appointment } = await loadBlockchainData();

    setAuth(auth);
    setAppointment(appointment);

    loadData(appointment);
  };
  
  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadData = async (appointment) => {
    if (!appointment) {
      console.error('appointment object is not initialized or getAppointmentsByDoctor method is not available');
      return;
    }

    const getAppointmentData = await appointment.methods.getAppointmentsByDoctor().call({ from: blockchainAddress });
    console.log("appointmentData:", getAppointmentData); // Add this line
  
    // Convert the appointment data into an array of appointment objects
    const appointmentsData = [];
    for (let i = getAppointmentData[0].length - 1; i >= 0 ; i--) {
      appointmentsData.push({
        owner: getAppointmentData.owners[i],
        firstName: getAppointmentData.firstNames[i],
        lastName: getAppointmentData.lastNames[i],
        email: getAppointmentData.emails[i],
        number: getAppointmentData.numbers[i],
        address: getAppointmentData.adrs[i],
        doctor: getAppointmentData.doctors[i],
        appointmentDate: getAppointmentData.appointmentDates[i],
        timeSlot: getAppointmentData.timeSlots[i],
        status: getAppointmentData.status[i],
      });
    }

    const today = new Date().toLocaleDateString();
    const todaysAppointments = appointmentsData.filter(appointment =>
      appointment.appointmentDate === today && (appointment.status === "completed" || appointment.status === "approved")
    );
    const completedAppointments = todaysAppointments.filter(appointment => appointment.status === 'completed');
    const pendingAppointments = todaysAppointments.filter(appointment => appointment.status === 'approved');

    setAppointmentsData(todaysAppointments);
    setTodaysAppointments(todaysAppointments.length);
    setCompletedAppointments(completedAppointments.length);
    setPendingAppointments(pendingAppointments.length);
    console.log("new appointments:", appointmentsData);
    console.log("new appointments:", appointmentsData);
    localStorage.setItem('appointments', JSON.stringify(appointmentsData));
  }

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle=" HOSPITAL STATS: "/>

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Today's Appointments"
            value={todaysAppointments}
            icon={
              <BookOnlineIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Complete Appointments"
            value={completedAppointments}
            icon={
              <CheckCircleOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Pending Appointments"
            value={pendingAppointments}
            icon={
              <PendingActionsIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Appointments
            </Typography>
          </Box>
          {appointmentsData.map((appointment, i) => (
            <Box
              key={`${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {appointment.firstName} {appointment.lastName}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {appointment.doctor}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{appointment.email}</Box>
              <Box color={colors.grey[100]}>{appointment.appointmentDate}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {appointment.timeSlot}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default DoctorDashboard;