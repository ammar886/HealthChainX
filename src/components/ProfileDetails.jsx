import { useState, useEffect, useContext } from 'react';
import { loadBlockchainData, loadWeb3 } from "../Web3helpers";
import { AuthContext } from '../context/AuthContext';
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "./Header";

const ProfileDetails = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [auth, setAuth] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [profiledetails, setProfileDetails] = useState(null);

  const { blockchainAddress, userRole } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const loadAccounts = async () => {
    let { auth, accounts } = await loadBlockchainData();
  
    setAccounts(accounts);
    setAuth(auth);

    loadData(auth);
  };
  
  useEffect(() => {
    loadWeb3();
  }, []);
  
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadData = async (auth) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      switch(userRole) {
        case "patient":
          const patientDetails = await auth.methods.getUserDetails(blockchainAddress).call({ from: account });
          console.log(patientDetails);
          setProfileDetails(patientDetails);
          break;
        case "doctor" || "receptionist":
          const employeeDetails = await auth.methods.getEmployeeDetails(blockchainAddress).call({ from: account });
          console.log(employeeDetails);
          setProfileDetails(employeeDetails);
          break;
        default:
          alert("Unknown user or employee");
          break;
      }
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
        initialValues={profiledetails}
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
                value={values.blockChainAdd}
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
                value={values.username}
                name="username"
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
              {values.userRole !== 'patient'  && ( 
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
              )}
              {values.userRole !== 'patient'  && ( 
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Qualifications"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.qualifications}
                  name="qualifications"
                  sx={{ gridColumn: "span 4" }}
                  disabled
                />
              )}  
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="User Role"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.userRole}
                name="userRole"
                sx={{ gridColumn: "span 4" }}
                disabled
              />
              {values.userRole === 'doctor' && (
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Specialization"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.specialization}
                  name="specialization"
                  sx={{ gridColumn: "span 4" }}
                  disabled
                />
              )}
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ProfileDetails