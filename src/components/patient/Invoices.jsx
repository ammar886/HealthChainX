import { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { AuthContext } from '../../context/AuthContext';
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
  const { blockchainAddress } = useContext(AuthContext);
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

      const billing = await medicalRecord.methods.getBillingsByPatient(blockchainAddress).call({ from: account });
      console.log("billing:", billing);
      
      const billings = [];
      for (let i = billing[0].length - 1; i >= 0; i--) {
        billings.push({
          index: i,
          receptionistAddress: billing[0][i],
          appointmentDate: billing[1][i],
          services: billing[2][i].join(", "), // Convert array to comma-separated string
          cost: billing[3][i],
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
    { field: "receptionistAddress", headerName: "Receptionist Address", flex: 1 },
    { field: "appointmentDate", headerName: "Date", flex: 1 },
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
              appointmentDate: encodeURIComponent(params.row.appointmentDate),
              services: encodeURIComponent(params.row.services),
              cost: encodeURIComponent(params.row.cost),
            }).toString();
            navigate(`/patient/billingdetails?${queryParams}`);
          }}
        >
          <NavigateNextIcon />
        </IconButton>
      )
    }
  ];
  
  const rows = billings.map((billing, index) => ({
    id: index,
    receptionistAddress: billing.receptionistAddress,
    appointmentDate: billing.appointmentDate,
    services: billing.services,
    cost: billing.cost,
  }));

  return (
    <Box m="20px">
      <Header title="BILL & PAYMENT" subtitle="Bill and Payment History" />
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
        <DataGrid checkboxSelection rows={rows} columns={columns} components={{ Toolbar: GridToolbar }} />
      </Box>
    </Box>
  );
};

export default Invoices;
