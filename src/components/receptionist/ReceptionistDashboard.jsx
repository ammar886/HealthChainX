import { useState, useEffect, useContext } from 'react';
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { AuthContext } from '../../context/AuthContext';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BadgeIcon from '@mui/icons-material/Badge';
import Person4Icon from '@mui/icons-material/Person4';
import Header from "../Header";
import StatBox from "../StatBox";
import { useNavigate } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const DoctorDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [accounts, setAccounts] = useState(null);
  const [auth, setAuth] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState(0);
  const [doctors, setDoctors] = useState(0);
  const [patients, setPatients] = useState(0);
  const navigate = useNavigate();
  const { blockchainAddress } = useContext(AuthContext);

  const loadAccounts = async () => {
    let { auth, appointment, accounts } = await loadBlockchainData();

    setAccounts(accounts);
    setAuth(auth);
    setAppointment(appointment);

    loadData(auth, appointment);
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadData = async (auth, appointment) => {
    if (!auth) {
      console.log('Auth object is not initialized yet. Please try again.');
      return;
    }
    if (!appointment) {
      console.log('Appointment object is not initialized yet. Please try again.');
      return;
    }

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    const doctors = await auth.methods.getLengthEmployees("doctor").call({ from: account });
    const patients = await auth.methods.getLengthEmployees("patient").call({ from: account });

    const currentDate = new Date().toLocaleDateString();
    const appointments = await appointment.methods.getCurrentDateAppointementCount(currentDate).call({ from: account });

    setDoctors(doctors.toString());
    setPatients(patients.toString());
    setTodaysAppointments(appointments.toString());

    const getAppointmentData = await appointment.methods.getAllAppointments().call({ from: account });
    console.log("appointmentData:", getAppointmentData); // Add this line

    // Convert the appointment data into an array of appointment objects
    const appointmentsData = [];
    for (let i = getAppointmentData.owners.length - 1; i >= 0; i--) {
      appointmentsData.push({
        index: i,
        owner: getAppointmentData.owners[i],
        firstName: getAppointmentData.firstNames[i],
        lastName: getAppointmentData.lastNames[i],
        email: getAppointmentData.emails[i],
        number: getAppointmentData.numbers[i],
        address: getAppointmentData.adrs[i],
        doctorAdd: getAppointmentData.doctorAdds[i],
        doctor: getAppointmentData.doctors[i],
        appointmentDate: getAppointmentData.appointmentDates[i],
        timeSlot: getAppointmentData.timeSlots[i],
        status: getAppointmentData.status[i],
      });
    }

    setAppointmentsData(appointmentsData);
    console.log("new appointments:", appointmentsData);
    localStorage.setItem('appointments', JSON.stringify(appointmentsData));
  };

  const completedAppointments = appointmentsData.filter(appointment => appointment.status === "completed");

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle=" HOSPITAL STATS: " />

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
          gridColumn="span 4"
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
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Total Patients"
            value={patients}
            icon={
              <BadgeIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Today's Appointments"
            value={todaysAppointments}
            icon={
              < Person4Icon
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
              Completed Appointments for Billing
            </Typography>
          </Box>
          {completedAppointments.map((appointment, i) => (
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
                  {appointment.firstName} {appointment.lastName}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {appointment.doctor}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{appointment.email}</Box>
              <Box color={colors.grey[100]}>{appointment.appointmentDate}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {appointment.timeSlot}
              </Box>
              {/* Add navigate button here */}
              <Button
                variant="contained"
                color="primary"
                endIcon={<NavigateNextIcon />}
                onClick={() => {
                  const queryParams = new URLSearchParams({
                    owner: encodeURIComponent(appointment.owner),
                    firstName: encodeURIComponent(appointment.firstName),
                    lastName: encodeURIComponent(appointment.lastName),
                    email: encodeURIComponent(appointment.email),
                    number: encodeURIComponent(appointment.number),
                    address: encodeURIComponent(appointment.address),
                    doctorAdd: encodeURIComponent(appointment.doctorAdd),
                    doctor: encodeURIComponent(appointment.doctor),
                    date: encodeURIComponent(appointment.appointmentDate),
                    time: encodeURIComponent(appointment.timeSlot)
                  }).toString();

                  navigate(`/receptionist/BillingPayment?${queryParams}`);
                }}
              >
                Navigate
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default DoctorDashboard;
