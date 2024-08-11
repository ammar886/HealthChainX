import { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import IconButton from '@mui/material/IconButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Header from "../Header";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [billings, setBillings] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAccounts = async () => {
    let { auth, appointment, medicalRecord } = await loadBlockchainData();

    setAuth(auth);
    setAppointment(appointment); 
    setMedicalRecord(medicalRecord);

    loadData(medicalRecord);
  };

  const handleRefresh = () => {
    loadData(medicalRecord);
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadData = async (medicalRecord) => {
    if(!medicalRecord) return;
    setIsRefreshing(true);

    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const billing = await medicalRecord.methods.getAllBillings().call({ from: account });
      console.log("billing:", billing);
      
      const billings = [];
      for (let i = billing[0].length - 1; i >= 0; i--) {
        billings.push({
          index: i,
          patientAddresses: billing[0][i],
          patientNames: billing[1][i],
          receptionistAddresses: billing[2][i],
          receptionistNames: billing[3][i],
          doctorAddresses: billing[4][i],
          doctorNames: billing[5][i],
          appointmentDates: billing[6][i],
          timeSlots: billing[7][i],
          services: billing[8][i].join(", "), // Convert array to comma-separated string
          costs: billing[9][i],
        });
      }
      setBillings(billings);
    } catch (e) {
      console.error(e.message);
      alert("Something went wrong!");
    } finally {
      setIsRefreshing(false);
    }
  };

  const columns = [
    { field: "patientName", headerName: "Patient Name", flex: 1 },
    { field: "appointmentDate", headerName: "Date", flex: 1 },
    { field: "timeSlot", headerName: "Time Slot", flex: 1 },
    { field: "services", headerName: "Services", flex: 1 },
    { field: "cost", headerName: "Cost", flex: 1 },
    {
      field: 'navigate',
      headerName: 'Navigate',
      flex: 1,
      renderCell: (params) => (
        <IconButton 
          color="white" 
          aria-label="navigate to billing details"
          onClick={() => {
            const queryParams = new URLSearchParams({
              patientAddress: encodeURIComponent(params.row.patientAddress),
              patientName: encodeURIComponent(params.row.patientName),
              receptionistAddress: encodeURIComponent(params.row.receptionistAddress),
              receptionistName: encodeURIComponent(params.row.receptionistName),
              doctorAddress: encodeURIComponent(params.row.doctorAddress),
              doctorName: encodeURIComponent(params.row.doctorName),
              appointmentDate: encodeURIComponent(params.row.appointmentDate),
              timeSlot: encodeURIComponent(params.row.timeSlot),
              services: encodeURIComponent(params.row.services),
              cost: encodeURIComponent(params.row.cost),
            }).toString();
            navigate(`/admin/billingdetails?${queryParams}`);
          }}
        >
          <NavigateNextIcon />
        </IconButton>
      )
    }
  ];
  
  const rows = billings.map((billing, index) => ({
    id: index,
    patientAddress: billing.patientAddresses,
    patientName: billing.patientNames,
    receptionistAddress: billing.receptionistAddresses,
    receptionistName: billing.receptionistNames,
    doctorAddress: billing.doctorAddresses,
    doctorName: billing.doctorNames,
    appointmentDate: billing.appointmentDates,
    timeSlot: billing.timeSlots,
    services: billing.services,
    cost: billing.costs,
  }));

  return (
    <Box m="20px">
      <Header title="INVOICES" subtitle="List of Invoice Balances" />
      {isRefreshing ? (
        <p>Loading...</p>
      ) : (
        <Button 
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
        </Button>
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid rows={rows} columns={columns} components={{ Toolbar: GridToolbar }} />
      </Box>
    </Box>
  );
};

export default Invoices;
