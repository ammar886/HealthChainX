import { useState, useEffect, useContext } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";

const Login = ({ onCloseIcon, onSignupButton }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const { setIsAuthenticated, setUserRole, setBlockchainAddress, setEmailAdd } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const adminEmail = "muhammadanis745@hcx.com";
  const adminPassword = "admin123";
  
  const handleSignupClick = () => {
    onSignupButton();
    navigate('/signup');
  };

  const handleClose = () => {
    onCloseIcon();
    navigate('/');
  };

  const loadAccounts = async () => {
    let { auth, accounts } = await loadBlockchainData();

    setAccounts(accounts);
    setAuth(auth);
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleSubmission = async (e) => {
    try {
      e.preventDefault();
      if (email && password) {
        if (email === adminEmail && password === adminPassword) {
          alert("Admin Hardcore.");
          setIsAuthenticated(true);
          setUserRole("admin");
          navigate("/admin");
        } else {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const account = accounts[0];

          const uData = await auth.methods
            .authenticateLogin(email, password)
            .call({ from: account });

          // Assuming uData is an object that contains a property 'username'
          localStorage.setItem('username', uData[2]);
    
          if (uData[0]) {
            setBlockchainAddress(uData[1]);
            setEmailAdd(email);
              switch (uData[3]) {
                case "patient":
                  setIsAuthenticated(uData[0]);
                  setUserRole(uData[3]);
                  navigate("/patient");
                  alert("Patient Account.");
                  break;
                case "doctor":
                  setIsAuthenticated(uData[0]);
                  setUserRole(uData[3]);
                  navigate("/doctor");
                  alert("Doctor Account.");
                  break;
                case "receptionist":
                  setIsAuthenticated(uData[0]);
                  setUserRole(uData[3]);
                  navigate("/receptionist");
                  alert("Receptionist Account.");
                  break;
                default:
                  console.error("Unknown user role:", uData[3]);
                  alert("Invalid or unknown user role");
              }
          } else {
            alert("Account not found. Please try again.");
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
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const ethereumAddress = accounts[0];
        alert("MetaMask Connection Successful! You're good to go");

        setIsAuthenticated(true);
        setUserRole("patient");
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
            <input type="email" onChange={(e) => setEmail(e.target.value)} />
            <span>Email</span>
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
            <div className="login-text">Already have an Account:</div>
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