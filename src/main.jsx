import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from "@mui/material";
import App from './App.jsx'
import './index.css'

const muiTheme = createTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </BrowserRouter>
)
