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
    const getAppointmentData = async () => {
      if (!appointment) return;
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const appointmentCount = await appointment.methods.getAppointmentCount().call({ from: account });
      console.log(appointmentCount);
      const appointments = [];
      for (let i = 0; i < 1; i++) {
        const appointmentData = await appointment.methods.getAppointments(i).call({ from: account });
        appointments.push(appointmentData);
      }
      setAppointments(appointments);
      console.log("new appointments:", appointments);
      localStorage.setItem('appointments', JSON.stringify(appointments));
    };

    getAppointmentData();
  }, [appointment]); // Added appointment as a dependency

  const columns = [
    { field: "firstname", headerName: "First Name" },
    {
      field: "lastname",
      headerName: "Last Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "email",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "phone",
      flex: 1,
    },
    {
      field: "address",
      headerName: "address",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          ${params.row.cost}
        </Typography>
      ),
    },
    {
      field: "time slot",
      headerName: "time slot",
      flex: 1,
    },
    {
      field: "misc-1",
      headerName: "misc 1"
    },
    {
      field: "misc-2",
      headerName: "misc 2"
    }

  ];

  return (
    <>
    <Box m="20px">
      <Header title="APPOINTMENTS" subtitle="List of Appointment History" /> 
      <div style={styles.appointmentDiv}>
        <p style = {styles.p}>FirstName</p>
        <p style = {styles.p}>LastName</p>
        <p style = {styles.p}>Email</p>
        <p style = {styles.p}>Phone</p>
        <p style = {styles.p}>Address</p>
        <p style = {styles.p}>Doctor</p>
        <p style = {styles.p}>Slot</p>
        <p style = {styles.p}>Status</p>
      </div>
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
        {/* { <DataGrid checkboxSelection rows={mockDataInvoices} columns={appointment} />} */}
        {/* <pre>{JSON.stringify(appointment, null, 2)}</pre> */}
        
        {appointments && appointments.map((appt, index) => (
          appt.firstNames && appt.firstNames.map((firstName, i) => (
            <div style={styles.appointmentDiv} className="appointmentDiv" key={i}> 
              <p style={styles.p}>{firstName}</p>
              <p style={styles.p}>{appt.lastNames && appt.lastNames[i]}</p>
              <p style={styles.p}>{appt.emails && appt.emails[i]}</p>
              <p style={styles.p}>{appt.numbers && appt.numbers[i]}</p>
              <p style={styles.p}>{appt.adrs && appt.adrs[i]}</p>
              <p style={styles.p}>{appt.doctors && appt.doctors[i]}</p>
              <p style={styles.p}>{appt.timeSlots && appt.timeSlots[i]}</p>
              <p style={styles.p}>{appt.status && appt.status[i]}</p>
              <br />
            </div>
          ))
        ))}
      </Box>
    </Box>
    </>
  );
};

export default AppointmentHistory;