import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa"; // Import the close icon
import { loadBlockchainData, loadWeb3 } from "../../../Web3helpers";
import Web3 from "web3";
import "./Signup.css";

const Signup = ({ onCloseIcon, onLoginButton }) => {
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

  React.useEffect(() => {
    loadWeb3();
  }, []);

  React.useEffect(() => {
    loadAccounts();
  }, []);
  
  const handleSignup = async (e) => {

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
  

  return (
    <div className="signup-form-main-container">
      <div className="signup-container">
        <form className="signup-form-container" onSubmit={handleSignup}>
          <div className="signup-close-icon" onClick={onCloseIcon}>
            <FaTimes />
          </div>
          <h2>Sign Up</h2>

          <div className="signup-inputfield">
            <input
              type="text"
              required
              onChange={(e) => setName(e.target.value)}
            />
            <span>Name</span>
            <i></i>
          </div>
          <div className="signup-inputfield">
            <input
              type="text"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>E-Mail</span>
            <i></i>
          </div>
          <div className="signup-inputfield">
            <input
              type="text"
              required
              onChange={(e) => setNumber(e.target.value)}
            />
            <span>Number</span>
            <i></i>
          </div>
          <div className="signup-inputfield">
            <input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
            <i></i>
          </div>
          <div className="signup-inputfield">
            <input
              type="password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span>Confirm Password</span>
            <i></i>
          </div>

          <button type="submit">Sign Up</button>

          <div className="signup-alt">
            <div className="signup-text">Alredy have an Account:</div>
            <button type="button" onClick={onLoginButton}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;