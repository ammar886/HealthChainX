import { useEffect, useState } from "react";
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../Header";

const ManageAccounts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
      for (let i = 0; i < result[0].length; i++) {
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
    { field: "id", headerName: "ID" },
    { field: "userName", headerName: "Name", flex: 1, cellClassName: "name-column--cell", },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "number", headerName: "Phone Number", flex: 1 },
    { field: "userRole", headerName: "User Role", flex: 1 },
    // {
    //   field: "updateStatus",
    //   headerName: "Update Status",
    //   flex: 1,
    //   renderCell: (params) => (
    //     <select 
    //       onChange={(e) => updateAppointmentStatus(params.row.owner, params.row.id, e.target.value)}
    //     >
    //       <option value="">Select</option>
    //       <option value="Approved">Approve</option>
    //       <option value="Rejected">Reject</option>
    //     </select>
    //   ),
    // },
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
        }}
      >
        <DataGrid checkboxSelection rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default ManageAccounts;
