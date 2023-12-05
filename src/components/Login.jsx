import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa"; // Import the close icon
import Web3 from "web3";
import "./Login.css";

const Login = ({ onClose }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(
      "This functionality is not available for the time being. Please use MetaMask to log in."
    );
  };

  const handleMetaMaskLogin = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const ethereumAddress = accounts[0];
        alert("MetaMask Connection Successful! You're good to go");
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

  return (
    <div className="login-container">
      <div className="container">
        <form onSubmit={handleLogin}>
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
            <button type="button" onClick={handleMetaMaskLogin}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;