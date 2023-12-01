import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa"; // Import the close icon
import { loadBlockchainData, loadWeb3 } from "../Web3helpers";
import Web3 from "web3";
import "./Login.css";

const Login = ({ onClose }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [accounts, setAccounts] = React.useState(null);
  const [auth, setAuth] = React.useState(null);
 
  const loadAccounts = async () => {
    let { auth, accounts } = await loadBlockchainData();
 
    setAccounts(accounts);
    setAuth(auth);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      // Request account access with MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0]; // The first account is the user's primary account
  
      // Send the transaction to the blockchain
      await auth.methods
        .createUser(username, password)
        .send({ from: account });
  
      // Store the username, password, and wallet address in local storage
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      localStorage.setItem("walletAddress", account);

      console.log(username);
      console.log(password);
      console.log(account);
      
      alert("Account Succesfully Created on Blockchain");
      
    } catch (e) {
      console.log(e.message);
    }
  };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   // alert(
  //   //   "This functionality is not available for the time being. Please use MetaMask to log in."
  //   // );
  //   try {
  //     await auth.methods
  //       .createUser(username, password)
  //       .send({ from: accounts });
 
  //     localStorage.setItem("username", username);
  //     localStorage.setItem("password", password);
  //     navigate("/");
  //   }
  //   catch (e) {
  //     console.log(e.message);
  //   }
  // };

  React.useEffect(() => {
    loadWeb3();
  }, []);
 
  React.useEffect(() => {
    loadAccounts();
  }, []);

  const handleMetaMaskLogin = async () => {
    // if (window.ethereum) {
    //   try {
    //     const accounts = await window.ethereum.request({
    //       method: "eth_requestAccounts",
    //     });
    //     const ethereumAddress = accounts[0];
    //     alert("MetaMask Connection Successful! You're good to go");
    //     console.log(ethereumAddress);
    //   } catch (error) {
    //     console.error("Error connecting with MetaMask:", error);
    //     alert("Error connecting with MetaMask. Please try again.");
    //   }
    // } else {
    //   console.log("MetaMask not installed");
    //   alert("MetaMask not installed. Please install MetaMask and try again.");
    // }
  };

  return (
    <section>
      <div className="container">
        <form onSubmit={handleLogin}>
          <div className="close-icon" onClick={onClose}>
            <FaTimes />
          </div>
          <h2>Login</h2>

          <div className="inputfield">
            <input
              type="text"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <span>Username</span>
            <i></i>
          </div>
          <div className="inputfield">
            <input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
            <i></i>
          </div>

          <button type="submit">Log in</button>

          <div className="alt">
            <div className="text">Or Sign in with:</div>
            <button type="button" onClick={handleMetaMaskLogin}>
              MetaMask
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;