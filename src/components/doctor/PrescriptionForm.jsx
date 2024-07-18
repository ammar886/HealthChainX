import React from 'react';
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useEffect, useState, useContext } from "react";

const PrescriptionForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [accounts, setAccounts] = React.useState(null);
  const [auth, setAuth] = React.useState(null);
  const [appointment, setAppointment] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const { blockchainAddress } = useContext(AuthContext); 
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const index = decodeURIComponent(queryParams.get('id'));
  const patientBlock = decodeURIComponent(queryParams.get('owner'));
  const firstName = decodeURIComponent(queryParams.get('firstName'));
  const lastName = decodeURIComponent(queryParams.get('lastName'));
  const email = decodeURIComponent(queryParams.get('email'));
  const number = decodeURIComponent(queryParams.get('number'));
  const address = decodeURIComponent(queryParams.get('address'));
  const appointmentDate = decodeURIComponent(queryParams.get('appointmentDate'));
  const timeSlot = decodeURIComponent(queryParams.get('slot'));
  console.log(patientBlock, firstName, lastName, email, number, address, appointmentDate, timeSlot);  

  const loadAccounts = async () => {
    let { auth, appointment, medicalRecord } = await loadBlockchainData();

    setAuth(auth);
    setAppointment(appointment); 
    setMedicalRecord(medicalRecord);
  };
  
  React.useEffect(() => {
    loadWeb3();
  }, []);
  
  React.useEffect(() => {
    loadAccounts();
  }, []);

  const handleFormSubmit = async (values) => {
    try{
     createPrescription(values);
    }catch(error){
      console.error("Error saving prescription:", error);
    }
  };

  const createPrescription = async(values) => {
    try{
      console.log("Doctor Block Address:"  + patientBlock)

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0]; // The first account is the user's primary account

      // Send the transaction to the blockchain
      await medicalRecord.methods
        .storePrescription(blockchainAddress, patientBlock, index, appointmentDate, timeSlot, values.clinicalNotes, values.prescription)
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
        initialValues={{ ...initialValues }}
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
          <form onSubmit={handleSubmit}>
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
                sx={{ gridColumn: "span 2" }}
                disabled
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
                sx={{ gridColumn: "span 2" }}
                disabled
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
                sx={{ gridColumn: "span 2" }}
                disabled
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
                sx={{ gridColumn: "span 2" }}
                disabled
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
                sx={{ gridColumn: "span 4" }}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={appointmentDate}
                name="date"
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
                value={timeSlot}
                name="timeSlot"
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
                value={values.clinicalNotes}
                name="clinicalNotes"
                error={!!touched.clinicalNotes && !!errors.clinicalNotes}
                helperText={touched.clinicalNotes && errors.clinicalNotes}
                sx={{ gridColumn: "span 4" }}
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
                value={values.prescription}
                name="prescription"
                error={!!touched.prescription && !!errors.prescription}
                helperText={touched.prescription && errors.prescription}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                SAVE PATIENT RECORD
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  clinicalNotes: yup.string().required("required"),
  prescription: yup.string().required("required"),
});

const initialValues = {
  clinicalNotes: "",
  prescription: "",
};

export default PrescriptionForm;