import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../subComponents/Header";
import { loadBlockchainData, loadWeb3 } from "../../../Web3helpers";
import Web3 from "web3";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [accounts, setAccounts] = React.useState(null);
  const [auth, setAuth] = React.useState(null);
  const loadAccounts = async () => {
    let { auth, accounts } = await loadBlockchainData();
  
    setAccounts(accounts);
    setAuth(auth);
  };
  
  React.useEffect(() => {
    loadWeb3();
  }, []);
  
  React.useEffect(() => {
    loadAccounts();
  }, []);

  const handleFormSubmit = (values) => {
    console.log(values.lastName);
    localStorage.setItem("firstname",values.firstName);
    localStorage.setItem("lastname",values.lastName);
    localStorage.setItem("email",values.email);
    localStorage.setItem("contact",values.contact);
    localStorage.setItem("address-1",values.address1);
    localStorage.setItem("address-2",values.address2);
    localStorage.setItem("role",values.userRole);


    employeeCreation(values);
  

};




const employeeCreation = async(values) => {
  try{

    console.log(auth); // Check the value of auth
    console.log(auth.methods); 

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0]; // The first account is the user's primary account

  // Send the transaction to the blockchain
  await auth.methods
    .createEmployee(values.firstName, values.lastName, values.email, values.contact, values.address1, values.address2, values.userRole)
    .send({ from: account });

    alert("Employee Created Succesfully!");
  }catch(e){
    console.error(e.message);
    alert("Something went wrong!");
  }

  
};

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{ ...initialValues, userRole: "" }}
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
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
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address 1"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address1}
                name="address1"
                error={!!touched.address1 && !!errors.address1}
                helperText={touched.address1 && errors.address1}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address 2"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address2}
                name="address2"
                error={!!touched.address2 && !!errors.address2}
                helperText={touched.address2 && errors.address2}
                sx={{ gridColumn: "span 4" }}
              />

              {/* User Role Dropdown */}
              <TextField
                select
                fullWidth
                variant="filled"
                label="User Role"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.userRole}
                name="userRole"
                error={!!touched.userRole && !!errors.userRole}
                helperText={touched.userRole && errors.userRole}
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem value="">Select User Role</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
                <MenuItem value="receptionist">Receptionist</MenuItem>
                <MenuItem value="patient">Patient</MenuItem>
              </TextField>
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
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
  address1: yup.string().required("required"),
  // address2: yup.string().required("required"),
  userRole: yup.string().required("Please select a user role"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  address1: "",
  address2: "",
  userRole: "",
};

export default Form;