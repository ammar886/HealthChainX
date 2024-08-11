import { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { Box, TextField, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BillingDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = useState(true);

  // Extract query parameters before useEffect
  const queryParams = new URLSearchParams(window.location.search);
  const userName = decodeURIComponent(queryParams.get('userName') || '');
  const receptionistName = decodeURIComponent(queryParams.get('receptionistName') || '');
  const doctorName = decodeURIComponent(queryParams.get('doctorName') || '');
  const appointmentDate = decodeURIComponent(queryParams.get('appointmentDate') || '');
  const timeSlot = decodeURIComponent(queryParams.get('timeSlot') || '');
  const services = decodeURIComponent(queryParams.get('services') || '');
  const cost = decodeURIComponent(queryParams.get('cost') || '');

  const [billingData, setBillingData] = useState({
    userName: userName,
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

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add hospital logo
    // doc.addImage('path/to/logo.png', 'PNG', 10, 10, 50, 20); // Uncomment and add path to logo

    // Add title
    doc.setFontSize(18);
    doc.text("HealthChainX Invoice", 105, 20, null, null, 'center');

    // Add patient details
    doc.setFontSize(12);
    doc.text(`Patient Name: ${billingData.userName}`, 20, 40);
    doc.text(`Receptionist Name: ${billingData.receptionistName}`, 20, 50);
    doc.text(`Doctor Name: ${billingData.doctorName}`, 20, 60);
    doc.text(`Appointment Date: ${billingData.appointmentDate}`, 20, 70);
    doc.text(`Time Slot: ${billingData.timeSlot}`, 20, 80);

    // Add table for services and cost
    doc.autoTable({
      startY: 90,
      head: [['Service', 'Cost']],
      body: [
        [billingData.services, billingData.cost],
      ],
    });

    // Add total cost
    doc.setFontSize(14);
    doc.text(`Total Cost: ${billingData.cost}`, 20, doc.autoTable.previous.finalY + 20);

    // Save the PDF
    doc.save('invoice.pdf');
  };

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
            <Box mt="20px">
              <Button variant="contained" color="primary" onClick={generatePDF}
                sx={{
                  backgroundColor: colors.blueAccent[700],
                  color: colors.grey[100],
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "10px 20px",
                }}
              >
                Download Invoice as PDF
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default BillingDetails;