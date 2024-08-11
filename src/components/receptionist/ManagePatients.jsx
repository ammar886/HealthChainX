import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import IconButton from '@mui/material/IconButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Header from "../Header";

const ManagePatients = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [patients, setPatients] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAccounts = async () => {
    let { auth, accounts } = await loadBlockchainData();
  
    setAccounts(accounts);
    setAuth(auth);
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    loadPatients();
  }, [auth]);
  
  const loadPatients = async () => {
    if (!auth) {
      console.log('Auth object is not initialized yet. Please try again.');
      return;
    }
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setIsRefreshing(true);

    try {
      const result = await auth.methods.getPatients().call({ from: account });
      console.log(result);
      
      const patients = [];
      for (let i = result[0].length - 1; i >= 0; i--) {
        patients.push({
          blockChainAdd: result[0][i],
          username: result[1][i],
          email: result[2][i],
          number: result[3][i],
          userRole: result[4][i],
        });
      }

      setPatients(patients);
      console.log("new patients:", patients);
      localStorage.setItem('patients', JSON.stringify(patients));
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadPatients();
  };
  
  const columns = [
    { field: "userName", headerName: "Name", flex: 1, cellClassName: "name-column--cell", },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "number", headerName: "Phone Number", flex: 1 },
    { field: "userRole", headerName: "User Role", flex: 1 },
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
              blockChainAdd: encodeURIComponent(params.row.blockChainAdd),
              username: encodeURIComponent(params.row.username),
              email: encodeURIComponent(params.row.email),
              number: encodeURIComponent(params.row.number),
              userRole: encodeURIComponent(params.row.userRole),
            }).toString();
            navigate(`/receptionist/bookappointmentform?${queryParams}`);
          }}
        >
          <NavigateNextIcon />
        </IconButton>
      )
    }
  ];
  
  const rows = patients.map((patient, index) => ({
    id: index,
    blockChainAdd: patient.blockChainAdd,
    userName: patient.username,
    email: patient.email,
    number: patient.number,
    userRole: patient.userRole,
  }));

  return (
    <Box m="20px">
      <Header title="MANAGE PATIENT" subtitle="Managing the Patient's" />
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

export default ManagePatients;