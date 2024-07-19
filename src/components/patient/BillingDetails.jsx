import { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import { Box, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";
import { AuthContext } from '../../context/AuthContext';

const BillingDetails = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { blockchainAddress } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem('username');

  // Extract query parameters before useEffect
  const queryParams = new URLSearchParams(window.location.search);
  const appointmentDate = decodeURIComponent(queryParams.get('appointmentDate') || '');
  const services = decodeURIComponent(queryParams.get('services') || '');
  const cost = decodeURIComponent(queryParams.get('cost') || '');

  const [billingData, setBillingData] = useState({
    userName: userName,
    appointmentDate: appointmentDate, // Set initial state from query params
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
                label="User Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.userName}
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
                sx={{ gridColumn: "span 4" }}
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