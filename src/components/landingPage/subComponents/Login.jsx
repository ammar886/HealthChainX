import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa"; // Import the close icon
import { loadBlockchainData, loadWeb3 } from "../../../Web3helpers";
import Web3 from "web3";
import "./Login.css";

const Login = ({ onClose, onLogin }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

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
    try{
      e.preventDefault();

      
    

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      console.log(account);
      const isAuthentic = await auth.methods
      .authenticateLogin(name, password)
      .call({ from: account });

      const isWhat = await auth.methods
      .getUserData(name)
      .call({from:account});      
      
      
      if(isAuthentic){
        alert("Login Succesfull!");
        console.log(isAuthentic);
      }
      else{
        console.log(isAuthentic);
        console.log("isWhat below:");
        console.log(isWhat);
        alert("Login unsuccesfull!");
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  
  const handleLogin = async (e) => {
    

    try {
      e.preventDefault();

      
    
      // Request account access with MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0]; // The first account is the user's primary account
  
      // Send the transaction to the blockchain
      await auth.methods
        .createUser(name, password, email, number)
        .send({ from: account });
  
      // Store the username, password, and wallet address in local storage
      localStorage.setItem("username", name);
      localStorage.setItem("email", email);
      localStorage.setItem("username", number);
      localStorage.setItem("password", password);
      localStorage.setItem("walletAddress", account);
      

      console.log(name);
      console.log(password);
      console.log(email);
      console.log(number);
      console.log(account);

      
      alert("Account Succesfully Created on Blockchain");
      
    } catch (e) {
      console.log(e.message);
      alert("Something went wrong!");
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
        alert("Incorrect Username and Password");
      }
    } else {
      handleMetaMaskLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <form className="form-container" onSubmit={handleLogin}>
          <div className="close-icon" onClick={onClose}>
            <FaTimes />
          </div>
          <h2>Sign Up</h2>

          <div className="inputfield">
            <input
              type="text"
              required
              onChange={(e) => setName(e.target.value)}
            />
            <span>Name</span>
            <i></i>
          </div>
          <div className="inputfield">
            <input
              type="text"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>E-Mail</span>
            <i></i>
          </div>
          <div className="inputfield">
            <input
              type="text"
              required
              onChange={(e) => setNumber(e.target.value)}
            />
            <span>Number</span>
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
          <div className="inputfield">
            <input
              type="password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span>Confirm Password</span>
            <i></i>
          </div>

          <button type="submit">Sign Up</button>

          <div className="alt">
            <div className="text">Alredy have an Account:</div>
            <button type="button" onClick={handleSubmission}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;