import React from 'react';
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";
import { useLocation } from 'react-router-dom';
import { useEffect, useState, useContext } from "react";

const PrescriptionForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [accounts, setAccounts] = React.useState(null);
  const [auth, setAuth] = React.useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const firstName = queryParams.get('firstName');
  const lastName = queryParams.get('lastName');
  const email = queryParams.get('email');
  const number = queryParams.get('number');
  const address = queryParams.get('address');
  const timeSlot = queryParams.get('slot');
  const patientBlock = queryParams.get('owner');
  const currentDate = new Date();
  const currentDay = currentDate.getDay(); // Returns a number (0-6) representing the day of the week
  const currentDateString = currentDate.toLocaleDateString();
  const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] // Returns a string representing the date in the format MM/DD/YYYY
  const dateToDisplay = days[currentDay] + ", " + currentDateString;
  console.log("location below:");
  console.log(firstName, lastName, email, number, address, timeSlot, dateToDisplay);

  const [medicalRecord, setMedicalRecord] = useState(null)
  

  const loadAccounts = async () => {
    let { auth, medicalRecord } = await loadBlockchainData();

    setAuth(auth);
    setMedicalRecord(medicalRecord);
  };
  
  React.useEffect(() => {
    loadWeb3();
  }, []);
  
  React.useEffect(() => {
    loadAccounts();
  }, []);

  const handleFormSubmit = async (values) => {
    console.log("Write Function");
    try{
     createPrescription(values);
    }catch(error){
      console.error("Error saving prescription:", error);
    }
    
  };

  const createPrescription = async(values) => {
    try{
      console.log(values);
  
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0]; // The first account is the user's primary account
  
    // Send the transaction to the blockchain
    await medicalRecord.methods
      .storePrescription(account, patientBlock, clinicalNotes, prescription)
      .send({ from: account });
  
      alert("Prescription Created Succesfully!");
    }catch(e){
      console.error(e.message);
      alert("Something went wrong!");
    }
  };

  return (
    <Box m="20px">
      <Header title="Save Patient Record" subtitle="Create a Patient Record " />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          ...initialValues,
          clinicalNotes: "",
          prescription: "",
        }}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleFormSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {/* Existing fields */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={firstName}
                name="firstName"
                // error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
                inputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={lastName}
                name="lastName"
                // error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
                inputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={email}
                name="email"
                // error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
                inputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={number}
                name="contact"
                // error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 2" }}
                inputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={address}
                name="address"
                // error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
                inputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Time Slot"
                onBlur={handleBlur}
                onChange={handleChange}
                value={timeSlot}
                name="timeSlot"
                // error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
                inputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={dateToDisplay}
                name="date"
                // error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
                inputProps={{ readOnly: true }}
              />
              {/* New fields replacing the last four fields */}
              <TextField
                fullWidth
                variant="filled"
                multiline
                rows={6}
                label="Clinical Notes"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.clinicalNotes}
                name="clinicalNotes"
                error={!!touched.clinicalNotes && !!errors.clinicalNotes}
                helperText={touched.clinicalNotes && errors.clinicalNotes}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                multiline
                rows={6}
                label="Prescription"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.prescription}
                name="prescription"
                error={!!touched.prescription && !!errors.prescription}
                helperText={touched.prescription && errors.prescription}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" onClick={handleFormSubmit} color="secondary" variant="contained">
                SAVE PATIENT RECORD
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

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address: yup.string().required("required"),
  clinicalNotes: yup.string().required("required"),
  prescription: yup.string().required("Please select a user role"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  address: "",
  clinicalNotes: "",
  prescription: "",
};

export default PrescriptionForm;