import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { Box } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { mockDataContacts } from "../data/mockData";
import { Receipt } from "@mui/icons-material";
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
  p:{
    marginRight: '30px',
    width: '80px',
  },
};

const ManageAppointments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const adminAddress = "0x741266e87931524809355fd80A887d1AFc1c38D7";
  
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
    
    let { contract } = await loadBlockchainData();
    console.log({ contract, accounts }); // Add this line
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    getAppointment();
  }, [appointment]);
  
  const getAppointment = async () => {
    if(!auth) return;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setIsRefreshing(true);

    const appointmentCount = await appointment.methods.getAppointmentCount().call({ from: account });
    console.log(appointmentCount);

    const appointments = [];
    for(let i=0; i<1; i++){
      const appointmentData = await appointment.methods.getAllAppointments(i).call({ from: account });
      appointments.push(appointmentData);
    }

    setAppointments(appointments);
    setIsRefreshing(false);
    console.log("new appointments:", appointments)
    localStorage.setItem('appointments', JSON.stringify(appointments));
  };

  const handleRefresh = () => {
    getAppointment();
  };

  const updateAppointmentStatus = async (userAddress, index, newStatus) => {
    if (!appointment) return;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    await appointment.methods.updateAppointmentStatus(userAddress, index, newStatus).send({ from: account })
    .on('receipt', (receipt) => {
      console.log(receipt);
      console.log("ammar");
      handleRefresh();
       // Delay of 3 seconds, you can adjust this as needed
    });
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "registrarId", headerName: "Registrar ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
    },
    {
      field: "zipCode",
      headerName: "Zip Code",
      flex: 1,
    },
  ];

  return (
    <>
    <Box m="20px">
      <Header title="APPOINTMENTS" subtitle="List of Appointment History" /> 
      {isRefreshing ? (
        <p>Loading...</p>
      ): (
        <button onClick={handleRefresh}>Refresh</button>
      )}
        
      <div style={styles.appointmentDiv}>
      <p style = {styles.p}>Id</p>
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

        <div>
          {appointments && appointments.map((appt, index) => (
            appt.firstNames && appt.firstNames.map((firstName, i) => (
              <div style={styles.appointmentDiv} className="appointmentDiv" key={i}> 
                <p style={styles.p}>Sr# {i+1}</p>
                <p style={styles.p}>{firstName}</p>
                <p style={styles.p}>{appt.lastNames && appt.lastNames[i]}</p>
                <p style={styles.p}>{appt.emails && appt.emails[i]}</p>
                <p style={styles.p}>{appt.numbers && appt.numbers[i]}</p>
                <p style={styles.p}>{appt.adrs && appt.adrs[i]}</p>
                <p style={styles.p}>{appt.doctors && appt.doctors[i]}</p>
                <p style={styles.p}>{appt.timeSlots && appt.timeSlots[i]}</p>
                <p style={styles.p}>{appt.status && appt.status[i]}</p>
                {console.log(appt)}
                {console.log("Index:", index)}
                {console.log("Owner:", appt.owner)}
                {/* <button onClick={() => updateAppointmentStatus(appt.owner[i], index, "Approved")}>Approve</button> */}
                <select onChange={(e) => updateAppointmentStatus(appt.owner[i], i, e.target.value)}>
                  <option value="">Select</option>
                  <option value="Approved">Approve</option>
                  <option value="Rejected">Reject</option>
                </select>
              </div>
            ))
          ))}
        </div>
      </Box>
    </Box>
    </>
  );
};

export default ManageAppointments;