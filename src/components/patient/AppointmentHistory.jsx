import { useEffect, useState, useContext } from "react";
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { AuthContext } from '../../context/AuthContext';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../Header";

const AppointmentHistory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [auth, setAuth] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const { blockchainAddress } = useContext(AuthContext);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAccounts = async () => {
    let { auth, appointment } = await loadBlockchainData();

    setAuth(auth);
    setAppointment(appointment);
  };

  const handleRefresh = () => {
    getAppointment();
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    getAppointment();
  }, [appointment]); // Added appointment as a dependency

  const getAppointment = async () => {
    if(!auth) return;
    setIsRefreshing(true);
  
    try {
      const getAppointmentData = await appointment.methods.getAppointments().call({ from: blockchainAddress });
      console.log("appointmentData:", getAppointmentData); // Add this line
  
      // Convert the appointment data into an array of appointment objects
      const appointmentsData = [];
      for (let i = getAppointmentData[0].length - 1; i >= 0 ; i--) {
        appointmentsData.push({
          index: i,
          firstName: getAppointmentData.firstNames[i],
          lastName: getAppointmentData.lastNames[i],
          email: getAppointmentData.emails[i],
          number: getAppointmentData.numbers[i],
          address: getAppointmentData.adrs[i],
          doctor: getAppointmentData.doctors[i],
          timeSlot: getAppointmentData.timeSlots[i],
          status: getAppointmentData.status[i],
        });
      }
  
      setAppointmentsData(appointmentsData);
      console.log("new appointments:", appointmentsData);
      localStorage.setItem('appointments', JSON.stringify(appointmentsData));
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const columns = [
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "number", headerName: "Phone Number", flex: 1 },
    { field: "adr", headerName: "Address", flex: 1 },
    { field: "doctor", headerName: "Doctor", flex: 1 },
    { field: "timeSlot", headerName: "Time Slot", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
  ];

  const rows = appointmentsData.map((appointment) => ({
    id: appointment.index,
    firstName: appointment.firstName,
    lastName: appointment.lastName,
    email: appointment.email,
    number: appointment.number,
    adr: appointment.address,
    doctor: appointment.doctor,
    timeSlot: appointment.timeSlot,
    status: appointment.status,
  }));

  return (
    <>
    <Box m="20px">
      <Header title="APPOINTMENTS" subtitle="List of Appointment History" />
      {isRefreshing ? (
        <p>Loading...</p>
      ) : (
        <button 
          onClick={handleRefresh} 
          style={{
            backgroundColor: colors.blueAccent[600],
            border: "none",
            color: colors.primary[400],
            padding: "15px 32px",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "16px",
            margin: "4px 2px",
            cursor: "pointer",
            borderRadius: "12px"
          }}
        >
          Refresh
        </button>
      )} 
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={rows} columns={columns} />
      </Box>
    </Box>
    </>
  );
};

export default AppointmentHistory;