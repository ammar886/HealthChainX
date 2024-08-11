import { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { Box, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";

const BillingDetails = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = useState(true);

  // Extract query parameters before useEffect
  const queryParams = new URLSearchParams(window.location.search);
  const patientName = decodeURIComponent(queryParams.get('patientName') || '');
  const receptionistName = decodeURIComponent(queryParams.get('receptionistName') || '');
  const doctorName = decodeURIComponent(queryParams.get('doctorName') || '');
  const appointmentDate = decodeURIComponent(queryParams.get('appointmentDate') || '');
  const timeSlot = decodeURIComponent(queryParams.get('timeSlot') || '');
  const services = decodeURIComponent(queryParams.get('services') || '');
  const cost = decodeURIComponent(queryParams.get('cost') || '');

  const [billingData, setBillingData] = useState({
    patientName: patientName,
    receptionistName: receptionistName,
    doctorName: doctorName,
    appointmentDate: appointmentDate, // Set initial state from query params
    timeSlot: timeSlot,
    services: services,
    cost: cost,
  });

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      // Update state with potentially new data here if necessary
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box m="20px">
      <Header title="BILLING DETAILS" subtitle="View Billing Details" />

      <Formik initialValues={billingData}>
        {({ values, handleBlur, handleChange }) => (
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
                label="Patient Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.patientName}
                sx={{ gridColumn: "span 4" }}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Receptionist Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.receptionistName}
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
                value={values.doctorName}
                sx={{ gridColumn: "span 4" }}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Appointment Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.appointmentDate}
                sx={{ gridColumn: "span 2" }}
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
                sx={{ gridColumn: "span 2" }}
                disabled
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Services"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.services}
                sx={{ gridColumn: "span 4" }}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Cost"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cost}
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

export default BillingDetails;