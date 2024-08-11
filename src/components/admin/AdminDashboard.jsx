import { useState, useEffect } from "react";
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import Header from "../Header";
import StatBox from "../StatBox";

const AdminDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [accounts, setAccounts] = useState(null);
  const [auth, setAuth] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [doctors, setDoctors] = useState(0);
  const [receptionists, setReceptionists] = useState(0);
  const [patients, setPatients] = useState(0);
  const [appointments, setAppointments] = useState(0);
  const [billingsData, setBillingsData] = useState([]);


  const loadAccounts = async () => {
    let { auth, appointment, accounts, medicalRecord } = await loadBlockchainData();
  
    setAccounts(accounts);
    setAuth(auth);
    setAppointment(appointment);
    setMedicalRecord(medicalRecord);


    loadData(auth, appointment, medicalRecord);
  };
  
  useEffect(() => {
    loadWeb3();
  }, []);
  
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadData = async (auth, appointment, medicalRecord) => {
    if (!auth) {
      console.log('Auth object is not initialized yet. Please try again.');
      return;
    }
    if (!appointment) {
      console.log('Appointment object is not initialized yet. Please try again.');
      return;
    }
    if (!medicalRecord) {
      console.log('Medical record object is not initialized yet. Please try again.');
      return;
    }

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
  
    const doctors = await auth.methods.getLengthEmployees("doctor").call({ from: account });
    const receptionists = await auth.methods.getLengthEmployees("receptionist").call({ from: account });
    const patients = await auth.methods.getLengthEmployees("patient").call({ from: account });

    const currentDate = new Date().toLocaleDateString();
    const appointments = await appointment.methods.getCurrentDateAppointementCount(currentDate).call({ from: account });

    const billing = await medicalRecord.methods.getAllBillings().call({ from: account });
    console.log("billing:", billing);
    
    const billingsData = [];
    for (let i = billing[0].length - 1; i >= 0; i--) {
      billingsData.push({
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

    setDoctors(doctors.toString());
    setReceptionists(receptionists.toString());
    setPatients(patients.toString());
    setAppointments(appointments.toString());
    setBillingsData(billingsData);
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle=" HOSPITAL STATS: "/>

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="No. of Doctors"
            value={doctors}
            icon={
              <LocalHospitalIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Total Patients"
            value={patients}
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Total Receptionists"
            value={receptionists}
            icon={
              <BadgeIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Today's Appointments"
            value={appointments}
            icon={
              <BookOnlineIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {billingsData.map((billing, i) => (
            <Box
              key={`${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {billing.patientNames}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {billing.doctorNames}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{billing.appointmentDates} {billing.timeSlots}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {billing.costs} $
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
