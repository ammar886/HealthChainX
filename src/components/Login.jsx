import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import Web3 from "web3"; // Install using: npm install web3
import "./Login.css";

const Login = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(
      "This functionality is not available for the time being. Please use MetaMask to log in."
    );
  };

  const handleMetaMaskLogin = async () => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        // Use the first account as the Ethereum address for simplicity
        const ethereumAddress = accounts[0];
        alert("MetaMask Connection Succesfull! You're good to go");
        console.log(ethereumAddress);


        // Send ethereumAddress to your server for authentication
        // const response = await fetch("/api/authenticate", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ ethereumAddress }),
        // });

        // if (response.ok) {
        //   console.log(
        //     "Authenticated with MetaMask. Ethereum Address:",
        //     ethereumAddress
        //   );
        //   // If authentication is successful, navigate to the admin page
        //   navigate("/admin");
        // } else {
        //   console.error("Authentication failed");
        //   alert("Authentication failed. Please try again.");
        // }
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
    <section>
      <div className="container">
        <form onSubmit={handleLogin}>
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