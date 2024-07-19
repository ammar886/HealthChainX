import { useState, useEffect, useContext } from 'react';
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { AuthContext } from '../../context/AuthContext';
import { Box, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";

const BillingDetails = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  
  const [auth, setAuth] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [billingData, setBillingData] = useState(null);
  const { blockchainAddress } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(window.location.search);
  const appointmentDate = decodeURIComponent(queryParams.get('appointmentDate'));
  const services = decodeURIComponent(queryParams.get('services'));
  const cost = decodeURIComponent(queryParams.get('cost'));

  const loadAccounts = async () => {
    let { auth, medicalRecord } = await loadBlockchainData();

    setAuth(auth);
    setMedicalRecord(medicalRecord);

    loadData();
  };
  
  useEffect(() => {
    loadWeb3();
  }, []);
  
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadData = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      // Add additional logic to fetch billing data from the contract if needed
      // For now, we'll use query parameters directly for display

      setBillingData({
        appointmentDate,
        services,
        cost
      });

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
      <Header title="BILLING DETAILS" subtitle="View Billing Details" />

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
          label="Appointment Date"
          value={billingData?.appointmentDate}
          sx={{ gridColumn: "span 4" }}
          disabled
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Services"
          value={billingData?.services}
          sx={{ gridColumn: "span 4" }}
          disabled
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Cost"
          value={billingData?.cost}
          sx={{ gridColumn: "span 4" }}
          disabled
        />
      </Box>
    </Box>
  );
};

export default BillingDetails;
