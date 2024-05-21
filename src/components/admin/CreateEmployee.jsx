import { useState, useEffect } from 'react';
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";

const CreateEmployee = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [auth, setAuth] = useState(null);
  const [accounts, setAccounts] = useState(null);

  const loadAccounts = async () => {
    let { auth, accounts } = await loadBlockchainData();
  
    setAccounts(accounts);
    setAuth(auth);
  };
  
  useEffect(() => {
    loadWeb3();
  }, []);
  
  useEffect(() => {
    loadAccounts();
  }, []);

  function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60) + minutes;
  }

  const handleFormSubmit = async (values) => {
    try {
      values.blockChainAdd = values.blockChainAdd.toLowerCase();
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      const isEmailUsed = await auth.methods.isEmailUsed(values.email).call({ from: accounts[0] });
      const isBlockchainAddUsed = await auth.methods.isBlockchainAddressUsed(values.blockChainAdd).call({ from: accounts[0] });
  
      if (isEmailUsed) {
        alert("Email is already used. Please, use another email.");
        return;
      }
  
      if (isBlockchainAddUsed) {
        alert("Blockchain address is already used. Please, use another blockchain address.");
        return;
      }

      // Calculate shift duration in minutes
      const startMinutes = timeToMinutes(values.startShiftTime);
      const endMinutes = timeToMinutes(values.endShiftTime);
      values.shiftDuration = (endMinutes - startMinutes).toString();

      console.log(`Shift duration: ${values.shiftDuration} minutes`);
  
      employeeCreation(values);
    } catch (e) {
      console.error(e.message);
      alert("Something went wrong!");
    }
  };

const employeeCreation = async(values) => {
  try{
    console.log(values);

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0]; // The first account is the user's primary account

  // Send the transaction to the blockchain
  await auth.methods
    .createEmployee(values.blockChainAdd, values.firstName + " " + values.lastName, values.email, values.contact, values.address, values.qualifications, values.userRole, values.specialization, values.startShiftTime, values.endShiftTime, values.shiftDuration, values.password)
    .send({ from: account });

    alert("Employee Created Succesfully!");
  }catch(e){
    console.error(e.message);
    alert("Something went wrong!");
  }
};

  return (
    <Box m="20px">
      <Header title="CREATE NEW ACCOUNT" subtitle="Create a New User Profile" />

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
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="BlockChain Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.blockChainAdd}
                name="blockChainAdd"
                error={!!touched.blockChainAdd && !!errors.blockChainAdd}
                helperText={touched.blockChainAdd && errors.blockChainAdd}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Qualifications"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.qualifications}
                name="qualifications"
                error={!!touched.qualifications && !!errors.qualifications}
                helperText={touched.qualifications && errors.qualifications}
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
              </TextField>

              {values.userRole === 'doctor' && (
                <TextField
                  select
                  fullWidth
                  variant="filled"
                  label="Specialization"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.specialization}
                  name="specialization"
                  error={!!touched.specialization && !!errors.specialization}
                  helperText={touched.specialization && errors.specialization}
                  sx={{ gridColumn: "span 4" }}
                >
                  <MenuItem value="">Select Specialization</MenuItem>
                  <MenuItem value="Gynecologist">Gynecologist</MenuItem>
                  <MenuItem value="Dermatologist">Dermatologist</MenuItem>
                  <MenuItem value="Neurologist">Neurologist</MenuItem>
                  <MenuItem value="Dentist">Dentist</MenuItem>
                  <MenuItem value="Psychiatrist">Psychiatrist</MenuItem>
                </TextField>
              )}

              <TextField
                fullWidth
                variant="filled"
                type="time"
                label="Start Shift Time"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.startShiftTime}
                name="startShiftTime"
                error={!!touched.startShiftTime && !!errors.startShiftTime}
                helperText={touched.startShiftTime && errors.startShiftTime}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="time"
                label="End Shift Time"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.endShiftTime}
                name="endShiftTime"
                error={!!touched.endShiftTime && !!errors.endShiftTime}
                helperText={touched.endShiftTime && errors.endShiftTime}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
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
  blockChainAdd: yup.string().required("required"),
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address: yup.string().required("required"),
  qualifications: yup.string().required("requird"),
  userRole: yup.string().required("Please select a user role"),
  specialization: yup.string().required("Please select a specialization for doctor"),
  startShiftTime: yup.string().required("required"),
  endShiftTime: yup.string().required("required"),
  password: yup.string().required("required"),
});

const initialValues = {
  blockChainAdd: "",
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  address: "",
  qualifications: "",
  userRole: "",
  specialization: "None",
  startShiftTime: "",
  endShiftTime: "",
  shiftDuration: "",
  password: "12345678",
};

export default CreateEmployee;