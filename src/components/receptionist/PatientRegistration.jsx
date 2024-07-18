import { useState, useEffect } from "react";
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";

const CreatePatient = () => {
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

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      values.blockChainAdd = values.blockChainAdd.toLowerCase();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const isEmailUsed = await auth.methods
        .isEmailUsed(values.email)
        .call({ from: accounts[0] });
      const isBlockchainAddUsed = await auth.methods
        .isBlockchainAddressUsed(values.blockChainAdd)
        .call({ from: accounts[0] });

      if (isEmailUsed) {
        alert("Email is already used. Please, use another email.");
        return;
      }

      if (isBlockchainAddUsed) {
        alert(
          "Blockchain address is already used. Please, use another blockchain address."
        );
        return;
      }

      patientCreation(values);
      resetForm();
    } catch (e) {
      console.error(e.message);
      alert("Something went wrong!");
    }
  };

  const patientCreation = async (values) => {
    try {
      console.log(values);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0]; // The first account is the user's primary account

      // Send the transaction to the blockchain
      await auth.methods
        .createUser(
          values.blockChainAdd,
          values.firstName + " " + values.lastName,
          values.email,
          values.contact,
          values.userRole,
          values.password
        )
        .send({ from: account });

      alert("Employee Created Succesfully!");
    } catch (e) {
      console.error(e.message);
      alert("Something went wrong!");
    }
  };

  return (
    <Box m="20px">
      <Header
        title="CREATE NEW FOR PATIENT ACCOUNT"
        subtitle="Create a New Patient Profile"
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{ ...initialValues }}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          resetForm,
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
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 4" }}
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
                sx={{ gridColumn: "span 4" }}
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

const initialValues = {
  blockChainAdd: "",
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  userRole: "patient",
  password: "12345678",
};

export default CreatePatient;
