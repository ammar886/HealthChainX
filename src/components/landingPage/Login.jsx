import React, { useState, useContext } from "react";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";

const Login = ({ onCloseIcon, onSignupButton }) => {

  const navigate = useNavigate();
  const handleSignupClick = () => {
    onSignupButton();
    navigate('/signup');
  };

  const handleClose = () => {
    onCloseIcon();
    navigate('/');
  };

  const { isAuthenticated, userRole, setIsAuthenticated, setUserRole } = useContext(AuthContext);

  const adminName = "Muhammad Anis";
  const adminPassword = "admin123";

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

  React.useEffect(() => {
    loadWeb3();
  }, []);

  React.useEffect(() => {
    loadAccounts();
  }, []);

  React.useEffect(() => {
    console.log('Is authenticated:', isAuthenticated);
    console.log('User role:', userRole);
  }, [isAuthenticated, userRole]);

  // React.useEffect(() => {
  //   if (isAuthentic) {
  //     onLogin();
  //   }
  // }, [isAuthentic, onLogin]);

  const handleSubmission = async (e) => {
    try {
      e.preventDefault();

      if (name && password) {
        if (name === adminName && password === adminPassword) {
          alert("Admin Hardcore.");
          setIsAuthenticated(true);
          setUserRole("Admin");
          navigate("/admin");
        } else {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
    
          const account = accounts[0];
          console.log(account);
          const isauthentic = await auth.methods
            .authenticateLogin(name, password)
            .call({ from: account });

          const isUser = await auth.methods
            .getUserData(name)
            .call({ from: account });

            console.log(isauthentic);
            console.log(isUser);

            console.log("Name:" , name);
            console.log("Password: ", password);
    
          if (isauthentic) {
            if (isUser && isUser.userRole) {
              const userRole = isUser.userRole;

              switch (userRole) {
                case "Patient":
                  setIsAuthenticated(true);
                  setUserRole(userRole);
                  navigate("/patient");
                  alert("Patient Account.");
                  break;
                case "Doctor":
                  setIsAuthenticated(true);
                  setUserRole(userRole);
                  navigate("/Doctor");
                  alert("Patient Account.");
                  break;
                case "Receptionist":
                  setIsAuthenticated(true);
                  setUserRole(userRole);
                  navigate("/receptionist");
                  alert("Receptionist Account.");
                  break;
                default:
                  console.error("Unknown user role:", userRole);
                  alert("Invalid or unknown user role");
              }        
            } else {
              console.error("User data missing role field");
              alert("User data missing role information");
            }
          } else {
            alert("Account not found. Please sign up.");
          }
        }
      } else {
        await handleMetaMaskLogin();
        alert("Metamask Login.");
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
        setIsAuthenticated(true);
        setUserRole("Patient");
        navigate("/patient");
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
    <div className="login-form-main-container">
      <div className="login-container">
        <form className="login-form-container" onSubmit={handleSubmission}>
          <div className="login-close-icon" onClick={handleClose}>
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
            <button type="button" onClick={handleSignupClick}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
