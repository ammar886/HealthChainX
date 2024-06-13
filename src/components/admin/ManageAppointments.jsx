import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { Box, Button } from "@mui/material";
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
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const loadAccounts = async () => {
    let { auth, appointment, accounts } = await loadBlockchainData();

    setAccounts(accounts);
    setAuth(auth);
    setAppointment(appointment); 
    
    let { contract } = await loadBlockchainData();
    console.log({ contract, accounts }); // Add this line
  };

  const handleRefresh = () => {
    getAppointment();
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
  
    try {
      const getAppointmentData = await appointment.methods.getAllAppointments().call({ from: account });
      console.log("appointmentData:", getAppointmentData); // Add this line
  
      // Convert the appointment data into an array of appointment objects
      const appointmentsData = [];
      for (let i = 0; i < getAppointmentData.owner.length; i++) {
        appointmentsData.push({
          owner: getAppointmentData.owner[i],
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

  const updateAppointmentStatus = async (userAddress, index, newStatus) => {
    console.log("User Address:", userAddress);
    console.log("Index:", index);
    console.log("New:", newStatus);
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
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "number", headerName: "Phone Number", flex: 1 },
    { field: "adr", headerName: "Address", flex: 1 },
    { field: "doctor", headerName: "Doctor", flex: 1 },
    { field: "timeSlot", headerName: "Time Slot", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "updateStatus",
      headerName: "Update Status",
      flex: 1,
      renderCell: (params) => (
        <select 
          onChange={(e) => updateAppointmentStatus(params.row.owner, params.row.id, e.target.value)}
        >
          <option value="">Select</option>
          <option value="approved">Approve</option>
          <option value="rejected">Reject</option>
        </select>
      ),
    },
  ];

  const rows = appointmentsData.map((appointment, i) => ({
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

export default ManageAppointments;