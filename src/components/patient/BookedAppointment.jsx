import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../data/mockData";
import { useEffect, useState } from "react";
import Header from "./HeaderPatient";
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { Margin } from "@mui/icons-material";
import { withTheme } from "@emotion/react";

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
  p:{
    marginRight: '30px',
    width: '100px',
  },


};
const Invoices = () => {
  
  const loadAccounts = async () => {
    let { auth, accounts } = await loadBlockchainData();

    setAccounts(accounts);
    setAuth(auth);
    let { contract } = await loadBlockchainData();
    console.log({ contract, accounts }); // Add this line
  };

  useEffect(() => {
    loadAccounts();
  }, []);


  const [appointment, setAppointment] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [auth, setAuth] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // useEffect(() => {
  //   const getAppointment = async () => {
  //     if(!auth) return;
  //     const accounts = await web3.eth.getAccounts();
  //     const account = accounts[0];
      
     
  //     const appointment = await auth.methods.getAppointments().call({ from: account });
  //     setAppointment(appointment);
  //     console.log("new appointment:", appointment)
  //     localStorage.setItem('appointment', JSON.stringify(appointment));
  //   };

  //   getAppointment();
  // }, [auth]); //added auth as a dependency
  
  useEffect(() => {
    const getAppointment = async () => {
      if(!auth) return;
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
  
      const appointmentCount = await auth.methods.getAppointmentCount().call({ from: account });
      console.log(appointmentCount);
      const appointments = [];
      for(let i=0; i<1; i++){
        const appointment = await auth.methods.getAppointments(i).call({ from: account });
        appointments.push(appointment);
      }
      setAppointment(appointments);
      console.log("new appointments:", appointments)
      localStorage.setItem('appointments', JSON.stringify(appointments));
    };
  
    getAppointment();
  }, [auth]); //added auth as a dependency

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
        <p style = {styles.p}>Slot</p>
        <p style = {styles.p}>Doc-ID</p>
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
        
        {appointment && appointment.map((appt, index) => (
  appt.firstNames.map((firstName, i) => (
    <div style={styles.appointmentDiv} className="appointmentDiv" key={i}> 
   
      <p style={styles.p}>{firstName}</p>
      <p style={styles.p}>{appt.lastNames[i]}</p>
      <p style={styles.p}>{appt.emails[i]}</p>
      <p style={styles.p}>{appt.numbers[i]}</p>
      <p style={styles.p}>{appt.adrs[i]}</p>
      <p style={styles.p}>{appt.timeSlots[i]}</p>
      <p style={styles.p}>{appt.doctors[i]}</p>
      <br />
    </div>
   
  ))
))}
        
      </Box>
    </Box>
    </>
  );
};

export default Invoices;