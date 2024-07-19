import { useState, useEffect, useContext } from 'react';
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";
import { useLocation } from 'react-router-dom';
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { AuthContext } from '../../context/AuthContext';

const BillingForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [auth, setAuth] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [services] = useState([
    { label: "Medicine", price: 50 },
    { label: "Tests", price: 100 },
    { label: "X-ray", price: 150 },
    { label: "Other", price: 200 },
  ]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { blockchainAddress } = useContext(AuthContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const firstName = decodeURIComponent(queryParams.get('firstName'));
  const lastName = decodeURIComponent(queryParams.get('lastName'));
  const email = decodeURIComponent(queryParams.get('email'));
  const patientBlock = decodeURIComponent(queryParams.get('owner'));
  const date = decodeURIComponent(queryParams.get('date'));
  const time = decodeURIComponent(queryParams.get('time'));

  const patientName = firstName + " " + lastName;

  const loadAccounts = async () => {
    let { auth, medicalRecord } = await loadBlockchainData();
    setAuth(auth);
    setMedicalRecord(medicalRecord);
  };

  useEffect(() => {
    loadWeb3();
    loadAccounts();
  }, []);

  const calculateTotalAmount = (selectedServices) => {
    const total = selectedServices.reduce((acc, service) => {
      const selectedService = services.find((s) => s.label === service);
      return acc + (selectedService ? selectedService.price : 0);
    }, 0);
    setTotalAmount(total);
  };

  const handleFormSubmit = async (values) => {
    try {
      await createBilling(values);
    } catch (error) {
      console.error("Error saving billing:", error);
    }
  };

  const createBilling = async (values) => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0]; // The first account is the user's primary account

      await medicalRecord.methods
        .storeBilling(blockchainAddress, patientBlock, date, values.services, totalAmount)
        .send({ from: account });

      alert("Billing Created Successfully!");
    } catch (e) {
      console.error(e.message);
      alert("Something went wrong!");
    }
  };

  return (
    <Box m="20px">
      <Header title="BILLING FORM" subtitle="" />

      <Formik
        initialValues={{ 
          patientName: patientName, 
          email: email, 
          patientBlock: patientBlock, 
          timeSlot: date + " " + time, 
          services: [], 
          totalAmount: 0 
        }}
        validationSchema={billingSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
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
                name="patientName"
                error={!!touched.patientName && !!errors.patientName}
                helperText={touched.patientName && errors.patientName}
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
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Owner/Patient Blockchain"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.patientBlock}
                name="patientBlock"
                error={!!touched.patientBlock && !!errors.patientBlock}
                helperText={touched.patientBlock && errors.patientBlock}
                sx={{ gridColumn: "span 4" }}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Appointment Timeslot"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.timeSlot}
                name="timeSlot"
                error={!!touched.timeSlot && !!errors.timeSlot}
                helperText={touched.timeSlot && errors.timeSlot}
                sx={{ gridColumn: "span 4" }}
                disabled
              />
              <TextField
                select
                fullWidth
                variant="filled"
                label="Services"
                onBlur={handleBlur}
                onChange={(event) => {
                  const { target: { value } } = event;
                  const selectedServices = typeof value === "string" ? value.split(",") : value;
                  setFieldValue("services", selectedServices);
                  calculateTotalAmount(selectedServices);
                }}
                SelectProps={{
                  multiple: true,
                  value: values.services,
                  renderValue: (selected) => selected.join(", "),
                }}
                name="services"
                error={!!touched.services && !!errors.services}
                helperText={touched.services && errors.services}
                sx={{ gridColumn: "span 4" }}
              >
                {services.map((service, index) => (
                  <MenuItem key={index} value={service.label}>
                    {service.label} (${service.price})
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Total Amount"
                value={totalAmount}
                name="totalAmount"
                InputProps={{
                  readOnly: true,
                }}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Submit
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const billingSchema = yup.object().shape({
  patientName: yup.string().required("required"),
  email: yup.string().email("Invalid email").required("required"),
  patientBlock: yup.string().required("required"),
  timeSlot: yup.string().required("required"),
  services: yup.array().of(yup.string()).required("Please select at least one service"),
});

export default BillingForm;
