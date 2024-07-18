import { useState, useEffect, useContext } from 'react';
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { AuthContext } from '../../context/AuthContext';
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";

const PrescriptionDetails = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  
  const [auth, setAuth] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const { blockchainAddress } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const appointmentDate = decodeURIComponent(queryParams.get('appointmentDate'));
  const timeSlot = decodeURIComponent(queryParams.get('timeSlot'));
  const clinicalNote = decodeURIComponent(queryParams.get('clinicalNote'));
  const prescriptionDetail = decodeURIComponent(queryParams.get('prescriptionDetail'));
  console.log(blockchainAddress, clinicalNote, prescriptionDetail);

  const loadAccounts = async () => {
    let { auth, appointment, medicalRecord } = await loadBlockchainData();

    setAuth(auth);
    setAppointment(appointment); 
    setMedicalRecord(medicalRecord);

    loadData(appointment);
  };
  
  useEffect(() => {
    loadWeb3();
  }, []);
  
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadData = async (appointment) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const getAppointmentData = await appointment.methods.getAppointmentByDateAndTime(blockchainAddress, appointmentDate, timeSlot).call({ from: account });

      setAppointmentsData(getAppointmentData);
      console.log("new appointments:", getAppointmentData);
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

  return (
    <Box m="20px">
      <Header title="PROFILE DETAILS" subtitle="View Profile Details" />

      <Formik
        initialValues={appointmentsData}
      >
        {({
          values,
          handleBlur,
          handleChange,
        }) => (
          <form>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Blockchain Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={blockchainAddress}
                name="blockChainAdd"
                sx={{ gridColumn: "span 4" }}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName + " " + values.lastName}
                name="name"
                sx={{ gridColumn: "span 4" }}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                sx={{ gridColumn: "span 4" }}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.number}
                name="number"
                sx={{ gridColumn: "span 4" }}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.adr}
                name="address"
                sx={{ gridColumn: "span 4" }}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Doctor Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.doctor}
                name="doctor name"
                sx={{ gridColumn: "span 4" }}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Time Slot"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.timeSlot}
                name="timeSlot"
                sx={{ gridColumn: "span 2" }}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Status"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.status}
                name="status"
                sx={{ gridColumn: "span 2" }}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                multiline
                rows={6}
                label="Clinical Notes"
                onBlur={handleBlur}
                onChange={handleChange}
                value={clinicalNote}
                name="clinicalNotes"
                sx={{ gridColumn: "span 4" }}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                multiline
                rows={6}
                label="Prescription"
                onBlur={handleBlur}
                onChange={handleChange}
                value={prescriptionDetail}
                name="prescription"
                sx={{ gridColumn: "span 4" }}
                disabled
              />
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default PrescriptionDetails