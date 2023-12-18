import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa"; // Import the close icon
import { loadBlockchainData, loadWeb3 } from "../../../Web3helpers";
import Web3 from "web3";
import "./Login.css";

const Login = ({ onClose, onLogin, onSignup }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [accounts, setAccounts] = React.useState(null);
  const [auth, setAuth] = React.useState(null);

  const loadAccounts = async () => {
    let { auth, accounts } = await loadBlockchainData();

    setAccounts(accounts);
    setAuth(auth);
  };

  const adminName = "Muhammad Anis";
  const adminPassword = "admin123";

  React.useEffect(() => {
    loadWeb3();
  }, []);

  React.useEffect(() => {
    loadAccounts();
  }, []);

  const handleSubmission = async (e) => {
    try {
      e.preventDefault();

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      console.log(account);
      const isAuthentic = await auth.methods
        .authenticateLogin(name, password)
        .call({ from: account });

      const isWhat = await auth.methods
        .getUserData(name)
        .call({ from: account });

      if (isAuthentic) {
        alert("Login Succesfull!");
        console.log(isAuthentic);
      } else {
        console.log(isAuthentic);
        console.log("isWhat below:");
        console.log(isWhat);
        alert("Login unsuccesfull!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMetaMaskLogin = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const ethereumAddress = accounts[0];
        alert("MetaMask Connection Successful! You're good to go");
        onLogin();
        console.log(ethereumAddress);
      } catch (error) {
        console.error("Error connecting with MetaMask:", error);
        alert("Error connecting with MetaMask. Please try again.");
      }
    } else {
      console.log("MetaMask not installed");
      alert("MetaMask not installed. Please install MetaMask and try again.");
    }
  };

  const checkCredentials = () => {
    if (name && password) {
      if (name === adminName && password === adminPassword) {
        onLogin();
      } else {
        handleSubmission();
      }
    } else {
      handleMetaMaskLogin();
    }
  };

  return (
    <div className="login-form-main-container">
      <div className="login-container">
        <form className="login-form-container" onSubmit={checkCredentials}>
          <div className="login-close-icon" onClick={onClose}>
            <FaTimes />
          </div>
          <h2>Login</h2>

          <div className="login-inputfield">
            <input type="text" onChange={(e) => setName(e.target.value)} />
            <span>Name</span>
            <i></i>
          </div>
          <div className="login-inputfield">
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
            <i></i>
          </div>

          <button type="submit">Login</button>

          <div className="login-alt">
            <div className="login-text">Alredy have an Account:</div>
            <button type="button" onClick={onSignup}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
