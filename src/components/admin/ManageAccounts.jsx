import { useEffect, useState } from "react";
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../Header";

const ManageAccounts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [auth, setAuth] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [patients, setPatients] = useState([]);

  const loadAccounts = async () => {
    let { auth, accounts } = await loadBlockchainData();
  
    setAccounts(accounts);
    setAuth(auth);
  
    // Call loadDoctors here after auth has been set
    loadPatients(auth);
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    loadAccounts();
  }, []);
  
  const loadPatients = async (auth) => {
    if (!auth) {
      console.log('Auth object is not initialized yet. Please try again.');
      return;
    }

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
  
    const result = await auth.methods.getPatients().call({ from: account });
    console.log(result);
    
    if (result[0].length > 0 && result[1].length > 0) {
      const userNames = result[0];
      const blockChainAdds = result[1];
      
      const patients = userNames.map((userNames, index) => ({
        userNames,
        blockChainAdd: blockChainAdds[index]
      }));
  
      console.log(patients);
      setPatients(patients);
    } else {
      console.log('No patients found.');
    }
  };
 
  const columns = [
    { field: "id", headerName: "ID" },
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
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin"
                ? colors.greenAccent[600]
                : access === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {access === "manager" && <SecurityOutlinedIcon />}
            {access === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="MANAGE PATIENT" subtitle="Managing the Patient's" />
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
        <DataGrid checkboxSelection rows={mockDataTeam} columns={columns} />
      </Box>
       {patients && patients.map((patient, index) => (
      <div key={index}>
        {patient.userNames}
      </div>
    ))}
    </Box>
  );
};

export default ManageAccounts;
