import { useEffect, useState, useContext } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import Header from "../Header";
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { AuthContext } from '../../context/AuthContext';
import IconButton from '@mui/material/IconButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';


const ManageAppointments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [auth, setAuth] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const { blockchainAddress } = useContext(AuthContext);  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const loadAccounts = async () => {
    let { auth, appointment } = await loadBlockchainData();

    setAuth(auth);
    setAppointment(appointment);
  };

  const handleRefresh = () => {
    getDoctorAppointment();
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    getDoctorAppointment();
  }, [appointment]); // Added appointment as a dependency


  const getDoctorAppointment = async () => {
    console.log(appointment);
    if(!auth) return;
    setIsRefreshing(true);
  
    try {
      const getAppointmentData = await appointment.methods.getAppointmentsByDoctor(blockchainAddress).call({ from: blockchainAddress });
      console.log("appointmentData:", getAppointmentData); // Add this line
  
      // Convert the appointment data into an array of appointment objects
      const appointmentsData = [];
      for (let i = 0; i < getAppointmentData[0].length; i++) {
        appointmentsData.push({
          owner: getAppointmentData.owners[i],
          firstName: getAppointmentData.firstNames[i],
          lastName: getAppointmentData.lastNames[i],
          email: getAppointmentData.emails[i],
          number: getAppointmentData.numbers[i],
          address: getAppointmentData.adrs[i],
          doctor: getAppointmentData.doctors[i],
          appointmentDate: getAppointmentData.appointmentDate[i],
          timeSlot: getAppointmentData.timeSlots[i],
          status: getAppointmentData.status[i],
        });
      }
  
      setAppointmentsData(appointmentsData.filter(appointment => appointment.status === "approved"));
      console.log("new appointments:", appointmentsData);
      
      localStorage.setItem('appointments', JSON.stringify(appointmentsData));
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
    { field: "appointmentDate", headerName: "Appointment Date", flex: 1 },
    { field: "timeSlot", headerName: "Time Slot", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: 'navigate',
      headerName: 'Navigate',
      flex: 1,
      renderCell: (params) => (
        <IconButton 
          color="primary" // Changed from "white" to "primary" as "white" might not be a valid color
          aria-label="navigate to appointment"
          onClick={() => {
            const queryParams = new URLSearchParams({
              owner: encodeURIComponent(params.row.owner),
              firstName: encodeURIComponent(params.row.firstName),
              lastName: encodeURIComponent(params.row.lastName),
              email: encodeURIComponent(params.row.email),
              number: encodeURIComponent(params.row.number),
              address: encodeURIComponent(params.row.adr),
              appointmentDate: encodeURIComponent(params.row.appointmentDate),
              slot: encodeURIComponent(params.row.timeSlot),
            }).toString();
            navigate(`/doctor/PrescriptionForm?${queryParams}`);
          }}
        >
          <NavigateNextIcon />
        </IconButton>
      )
    }
  ];

  const rows = appointmentsData.map((appointment, i) => ({
    id: i,
    owner: appointment.owner,
    firstName: appointment.firstName,
    lastName: appointment.lastName,
    email: appointment.email,
    number: appointment.number,
    adr: appointment.address,
    doctor: appointment.doctor,
    appointmentDate: appointment.appointmentDate,
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
