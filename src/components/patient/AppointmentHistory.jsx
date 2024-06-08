import { useEffect, useState } from "react";
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../Header";

const styles = {
  appointmentsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'left',
    justifyContent: 'left',
  },
  appointmentDiv: {
    display: 'flex',
    flexDirection: 'row',
    color: 'white',
    alignItems: 'left',
    justifyContent: 'center',
    // Adjust this value as needed
  },
  p: {
    marginRight: '30px',
    width: '100px',
  },
};

const AppointmentHistory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [auth, setAuth] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAccounts = async () => {
    let { auth, appointment, accounts } = await loadBlockchainData();

    setAccounts(accounts);
    setAuth(auth);
    setAppointment(appointment);
    console.log({ auth, appointment, accounts }); // Add this line
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

  const handleRefresh = () => {
    getAppointment();
  };

  const getAppointment = async () => {
    if(!auth) return;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setIsRefreshing(true);
  
    try {
      const appointmentData = await appointment.methods.getAppointments().call({ from: account });
      console.log("appointmentData:", appointmentData); // Add this line
  
      // Convert the appointment data into an array of appointment objects
      const appointments = [];
      for (let i = 0; i < appointmentData.owner.length; i++) {
        appointments.push({
          owner: appointmentData.owner[i],
          firstName: appointmentData.firstNames[i],
          lastName: appointmentData.lastNames[i],
          email: appointmentData.emails[i],
          number: appointmentData.numbers[i],
          address: appointmentData.adrs[i],
          doctor: appointmentData.doctors[i],
          timeSlot: appointmentData.timeSlots[i],
          status: appointmentData.status[i],
        });
      }
  
      setAppointments(appointments);
      console.log("new appointments:", appointments);
      localStorage.setItem('appointments', JSON.stringify(appointments));
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "number", headerName: "Phone Number", flex: 1 },
    { field: "adr", headerName: "Address", flex: 1 },
    { field: "doctor", headerName: "Doctor", flex: 1 },
    { field: "timeSlot", headerName: "Time Slot", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
  ];

  const rows = appointments.map((appointment, i) => ({
    id: i,
    owner: appointment.owner, // Add this line
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