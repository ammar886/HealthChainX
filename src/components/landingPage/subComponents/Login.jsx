import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { loadBlockchainData, loadWeb3 } from "../../../Web3helpers";
import "./Login.css";

const Login = ({ onCloseIcon, onLoginSuccess, onSignupButton }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [accounts, setAccounts] = useState(null);
  const [auth, setAuth] = useState(null);
  const [isAuthentic, setIsAuthentic] = useState(false);

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

  React.useEffect(() => {
    if (isAuthentic) {
      onLoginSuccess();
    }
  }, [isAuthentic, onLoginSuccess]);

  const handleSubmission = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const account = accounts[0];
      console.log(account);
      const authentic = await auth.methods
        .authenticateLogin(name, password)
        .call({ from: account });

      setIsAuthentic(authentic);

      const isWhat = await auth.methods
        .getUserData(name)
        .call({ from: account });

      if (authentic) {
        alert("Login Successful!");
      } else {
        alert("Login unsuccessful!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const handleSubmission = async (e) => {
  //   try {
  //     e.preventDefault();

  //     const accounts = await window.ethereum.request({
  //       method: "eth_requestAccounts",
  //     });
  //     const account = accounts[0];
  //     console.log(account);
  //     const isAuthentic = await auth.methods
  //       .authenticateLogin(name, password)
  //       .call({ from: account });

  //     const isWhat = await auth.methods
  //       .getUserData(name)
  //       .call({ from: account });

  //     if (isAuthentic) {
  //       alert("Login Succesfull!");
  //       console.log(isAuthentic);
  //     } else {
  //       console.log(isAuthentic);
  //       console.log("isWhat below:");
  //       console.log(isWhat);
  //       alert("Login unsuccesfull!");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleMetaMaskLogin = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const ethereumAddress = accounts[0];
        alert("MetaMask Connection Successful! You're good to go");
        onLoginSuccess();
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

  const checkCredentials = async (e) => {
    try {
      e.preventDefault();
      if (name && password) {
        if (name === adminName && password === adminPassword) {
          alert("Admin Hardcore.");
          onLoginSuccess();
        } else {
          await handleSubmission();
          alert("User Login.");
        }
      } else {
        await handleMetaMaskLogin();
        alert("Metamask Login.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-form-main-container">
      <div className="login-container">
        <form className="login-form-container" onSubmit={checkCredentials}>
          <div className="login-close-icon" onClick={onCloseIcon}>
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
            <button type="button" onClick={onSignupButton}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
