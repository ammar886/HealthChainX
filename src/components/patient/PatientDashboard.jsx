import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Person4Icon from '@mui/icons-material/Person4';
import Header from "./HeaderPatient";
import StatBox from "./StatBox";
import React, { useState } from 'react';
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";

import { Grid, Box as MaterialBox, Typography as MaterialTypography, Card, CardContent } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  card: {
    maxWidth: 400,
    margin: 'auto',
    marginTop: 20,
    padding: 20,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  section: {
    marginBottom: 20,
  },
});




function PatientProfile({ patientDetails }) {
  const classes = useStyles();

  return (
    <Box m="20px">
      {/* HEADER */}
      <Header title="Patient Dashboard" />
      {/* PATIENT DETAILS */}
      {patientDetails && (
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h6">Name: {patientDetails[0]}</Typography>
            <Typography variant="h6">Email: {patientDetails[1]}</Typography>
            <Typography variant="h6">Phone: {patientDetails[2]}</Typography>
            <Typography variant="h6">Status: {patientDetails[3]}</Typography>
            <Typography variant="h6">Metamask Address: {patientDetails[4]}</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}




const PatientDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [naam, setNaam] = useState(null);
  const [accounts, setAccounts] = React.useState(null);
  const [auth, setAuth] = React.useState(null);
  const [patientDetails, setPatientDetails] = React.useState(null);
  const [contract, setContract] = useState(null);

  const username = localStorage.getItem('name');

  const loadAccounts = async () => {
    let { auth, accounts, contract } = await loadBlockchainData();

    setAccounts(accounts);
    setAuth(auth);
    setContract(contract);
    console.log({ contract, accounts });

    // Ensure contract is set before calling getUserDetails
    if (contract) {
        getUserDetails(username, contract);
    }
};
  
  React.useEffect(() => {
    loadWeb3();
  }, []);

  React.useEffect(() => {
    loadAccounts();
  }, []);

  // React.useEffect(() => {
  //   getUserDetails(username);
  // }, []);

 

  async function getUserDetails(username, contract) {
    const accounts = await web3.eth.getAccounts();
    const userDetails = await contract.methods.getUserDetails(username).call({from: accounts[0]});
    console.log(userDetails);
    setPatientDetails(userDetails);
}
  const classes = useStyles();
  return (
    <MaterialBox m="20px">
      {/* HEADER */}
      <Header title="Patient Dashboard" />
      {/* PATIENT DETAILS */}
      {patientDetails && (
        <Card className={classes.card}>
          <CardContent>
            <MaterialTypography variant="h6">Name: {patientDetails[0]}</MaterialTypography>
            <MaterialTypography variant="h6">Email: {patientDetails[1]}</MaterialTypography>
            <MaterialTypography variant="h6">Phone: {patientDetails[2]}</MaterialTypography>
            <MaterialTypography variant="h6">Status: {patientDetails[3]}</MaterialTypography>
            <MaterialTypography variant="h6">Metamask Address: {patientDetails[4]}</MaterialTypography>
          </CardContent>
        </Card>
      )}
    </MaterialBox>
  );
}

export default PatientDashboard;