import { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { AuthContext } from '../../context/AuthContext';
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../Header";

const ManagePrescriptions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [auth, setAuth] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
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

      const prescription = await medicalRecord.methods.getPrescriptionsByDoctor(blockchainAddress).call({ from: account });
      console.log("prescription:", prescription);
      
      const prescriptions = [];
      for (let i = prescription[0].length - 1; i >= 0; i--) {
        prescriptions.push({
          index: i,
          patientAddress: prescription[0][i],
          patientName: prescription[1][i],
          appointmentDate: prescription[2][i],
          timeSlot: prescription[3][i],
          clinicalNote: prescription[4][i],
          prescriptionDetail: prescription[5][i],
        });
      }
      setPrescriptions(prescriptions);
    } catch (e) {
      console.error(e.message);
      alert("Something went wrong!");
    } finally {
      setIsRefreshing(false);
    }
  };

  const columns = [
    { field: "patientName", headerName: "Patient Name", flex: 1, cellClassName: "name-column--cell", },
    { field: "appointmentDate", headerName: "Appointment Date", flex: 1 },
    { field: "timeSlot", headerName: "Time Slot", flex: 1 },
    { field: "clinicalNote", headerName: "Clinical Notes", flex: 1 },
    { field: "prescriptionDetail", headerName: "Prescription Detail", flex: 1 },
  ];
  
  const rows = prescriptions.map((prescription, index) => ({
    id: index,
    patientAddress: prescription.patientAddress,
    patientName: prescription.patientName,
    appointmentDate: prescription.appointmentDate,
    timeSlot: prescription.timeSlot,
    clinicalNote: prescription.clinicalNote,
    prescriptionDetail: prescription.prescriptionDetail,
  }));

  return (
    <Box m="20px">
      <Header title="MANAGE PRESCRIPTION" subtitle="Managing the Prescription's" />
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

export default ManagePrescriptions;
