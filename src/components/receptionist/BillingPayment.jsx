import {
  Box,
  Typography,
  useTheme,
  TextField,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../data/mockData";
import Header from "../Header";
import React, { useState } from "react";

const services = [
  { label: "Tests", value: 100 },
  { label: "Xray", value: 200 },
  { label: "Medicine", value: 50 },
  { label: "Doctor Fee", value: 150 },
];

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedServices, setSelectedServices] = useState({});
  const [totalCost, setTotalCost] = useState(0);

  const handleServiceChange = (id, service) => {
    setSelectedServices((prev) => ({
      ...prev,
      [id]: service,
    }));

    const newTotalCost = Object.values({
      ...selectedServices,
      [id]: service,
    }).reduce((acc, curr) => acc + curr.value, 0);

    setTotalCost(newTotalCost);
  };

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "services",
      headerName: "Services",
      flex: 1,
      renderCell: (params) => (
        <Autocomplete
          options={services}
          getOptionLabel={(option) => option.label}
          onChange={(event, newValue) =>
            handleServiceChange(params.row.id, newValue)
          }
          renderInput={(params) => (
            <TextField {...params} label="Select Service" />
          )}
        />
      ),
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          $
          {selectedServices[params.row.id]
            ? selectedServices[params.row.id].value
            : 0}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="INVOICES" subtitle="List of Invoice Balances" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={mockDataInvoices} columns={columns} />
      </Box>
      <Box mt="20px">
        <Typography variant="h6" color={colors.greenAccent[500]}>
          Total Cost: ${totalCost}
        </Typography>
      </Box>
    </Box>
  );
};

export default Invoices;
