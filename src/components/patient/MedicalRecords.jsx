import { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { AuthContext } from '../../context/AuthContext';
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../Header";

const MedicalRecords = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const { blockchainAddress } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const loadAccounts = async () => {
    let { auth, appointment, medicalRecord } = await loadBlockchainData();

    setAuth(auth);
    setAppointment(appointment); 
    setMedicalRecord(medicalRecord);

    loadData(medicalRecord);
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadData = async (medicalRecord) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const prescription = await medicalRecord.methods.getPrescriptionsByPatient(blockchainAddress).call({ from: account });
      console.log(prescription);
      
      const prescriptions = [];
      for (let i = result[0].length - 1; i >= 0; i--) {
        prescriptions.push({
          index: i,
          doctorAddresse: result[0][i],
          doctorName: result[1][i],
          appointmentDate: result[2][i],
          timeSlot: result[3][i],
          clinicalNote: result[4][i],
          prescriptionDetail: result[5][i],
        });
      }
      setPrescriptions(prescriptions);
    } catch (e) {
      console.error(e.message);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const columns = [
    { field: "doctorName", headerName: "Name", flex: 1, cellClassName: "name-column--cell", },
    { field: "appointmentDate", headerName: "Date", flex: 1 },
    { field: "timeSlot", headerName: "Time Slot", flex: 1 },
    { field: "clinicalNote", headerName: "Clinical Notes", flex: 1 },
    { field: "prescriptionDetail", headerName: "Prescription Detail", flex: 1 },
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
              clinicalNote: encodeURIComponent(params.row.clinicalNote),
              prescriptionDetail: encodeURIComponent(params.row.prescriptionDetail),
            }).toString();
            navigate(`/doctor/PrescriptionForm?${queryParams}`);
          }}
        >
          <NavigateNextIcon />
        </IconButton>
      )
    }
  ];
  
  const rows = prescriptions.map((prescription, index) => ({
    id: index,
    doctorAddresse: prescription.doctorAddresse,
    doctorName: prescription.doctorName,
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
        }}
      >
        <DataGrid checkboxSelection rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default MedicalRecords;
