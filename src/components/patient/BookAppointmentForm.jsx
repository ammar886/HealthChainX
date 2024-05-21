import { useEffect, useState } from "react";
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { addMinutes, format } from 'date-fns';
import { Pending } from "@mui/icons-material";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";

const BookAppointmentForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [auth, setAuth] = useState(null);
  const [appointment, setAppointment] = useState(null); //contract state
  const [accounts, setAccounts] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  

  const loadAccounts = async () => {
    let { auth, appointment, accounts } = await loadBlockchainData();
  
    setAccounts(accounts);
    setAuth(auth);
    setAppointment(appointment);

    // Call loadDoctors here after auth has been set
    loadDoctors(auth);
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    loadAccounts();
  }, []);
  
  const loadDoctors = async (auth) => {
    if (!auth) {
      console.log('Auth object is not initialized yet. Please try again.');
      return;
    }

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
  
    const result = await auth.methods.getDoctors().call({ from: account });
    console.log(result);
    
    if (result[0].length > 0 && result[1].length > 0) {
      const blockChainAdds = result[0];
      const userNames = result[1];
      const startShiftTimes = result[2];
      const endShiftTimes = result[3];
      const shiftDurations = result[4];
      
      const doctors = blockChainAdds.map((blockChainAdd, index) => ({
        blockChainAdd,
        userName: userNames[index],
        startShiftTime: startShiftTimes[index],
        endShiftTime: endShiftTimes[index],
        shiftDuration: shiftDurations[index]
      }));
    
      console.log(doctors);
      setDoctors(doctors);
    } else {
      console.log('No doctors found.');
    }
  };

  const generateTimeSlots = (startShiftTime, shiftDuration) => {
    const slots = [];
    let startTime = new Date(`1970-01-01T${startShiftTime}:00`);
    const endTime = addMinutes(startTime, shiftDuration);
  
    while (startTime < endTime) {
      slots.push(format(startTime, 'HH:mm'));
      startTime = addMinutes(startTime, 15);
    }
  
    setTimeSlots(slots);
  };

  const handleFormSubmit = (values) => {
    localStorage.setItem("firstname", values.firstName);
    localStorage.setItem("lastname", values.lastName);
    localStorage.setItem("email", values.email);

    appointmentCreation(values);

    console.log("handleForm function called!");
  };

  const appointmentCreation = async (values) => {
    try {
      if (!auth || !auth.methods) {
        alert("Auth object is not initialized yet. Please try again.");
        return;
      }
  
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0]; // The first account is the user's primary account
  
      localStorage.setItem("firstname", values.firstName);
      let status = "pending";
      // Send the transaction to the blockchain
      await appointment.methods
        .bookAppointment(
          values.firstName,
          values.lastName,
          values.email,
          values.contact,
          values.address,
          values.doctorname,
          values.timeslot,
          values.status
        )
        .send({ from: account });
  
      alert("Appointment Booked Succesfully!");
      console.log("AppointmentCreation function called!");
    } catch (e) {
      console.error(e.message);
      alert("Something went wrong!");
    }
  };

  return (
    <Box m="20px">
      <Header title="BOOK APPOINTMNET" subtitle="" />

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
                select
                fullWidth
                variant="filled"
                label="Select Doctor"
                onBlur={handleBlur}
                onChange={(event) => {
                  handleChange(event);
                  const selectedDoctor = doctors.find(doctor => doctor.userName === event.target.value);
                  if (selectedDoctor) {
                    generateTimeSlots(selectedDoctor.startShiftTime, selectedDoctor.shiftDuration);
                  }
                }}
                value={values.doctorname}
                name="doctorname"
                error={!!touched.doctorname && !!errors.doctorname}
                helperText={touched.doctorname && errors.doctorname}
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem value="">Select Doctor</MenuItem>
                {doctors.map((doctor, index) => (
                    <MenuItem key={index} value={doctor.userName}>
                        {doctor.userName}
                    </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                variant="filled"
                label="Time Slot"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.timeslot}
                name="timeslot"
                error={!!touched.timeslot && !!errors.timeslot}
                helperText={touched.timeslot && errors.timeslot}
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem value="">Select Time Slot</MenuItem>
                {timeSlots.map((timeSlot, index) => (
                  <MenuItem key={index} value={timeSlot}>
                    {timeSlot}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Book Appointment
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
  doctorname: yup.string().required("Please select a doctor"),
  timeslot: yup.string().required("Please select a timeslot"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  address: "",
  doctorname: "",
  timeslot: "",
  status: "pending"
};

export default BookAppointmentForm;