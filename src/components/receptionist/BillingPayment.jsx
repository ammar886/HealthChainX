import { useState } from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";

const BillingForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [services] = useState([
    { label: "Medicine", price: 50 },
    { label: "Tests", price: 100 },
    { label: "X-ray", price: 150 },
    { label: "Other", price: 200 },
  ]);
  const [totalAmount, setTotalAmount] = useState(0);

  const calculateTotalAmount = (selectedServices) => {
    const total = selectedServices.reduce((acc, service) => {
      const selectedService = services.find((s) => s.label === service);
      return acc + (selectedService ? selectedService.price : 0);
    }, 0);
    setTotalAmount(total);
  };

  const handleFormSubmit = (values) => {
    console.log("Form Submitted", values);
    console.log("Total Amount:", totalAmount);
  };

  return (
    <Box m="20px">
      <Header title="BILLING FORM" subtitle="" />

      <Formik
        initialValues={{ patientName: "", contact: "", services: [] }}
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
                select
                fullWidth
                variant="filled"
                label="Services"
                onBlur={handleBlur}
                onChange={(event) => {
                  const {
                    target: { value },
                  } = event;
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
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  services: yup.array().of(yup.string()).required("Please select at least one service"),
});

export default BillingForm;
