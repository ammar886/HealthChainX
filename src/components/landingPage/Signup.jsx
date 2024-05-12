import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa"; // Import the close icon
import { loadBlockchainData, loadWeb3 } from "../../Web3helpers";
import "./Signup.css";

const Signup = ({ onCloseIcon, onLoginButton }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [accounts, setAccounts] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("patient");
  const [confirmpassword, setConfirmPassword] = useState("");
  
  const handleLoginClick = () => {
    onLoginButton();
    navigate('/login');
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
  
  const handleSignup = async (e) => {
    try {
      e.preventDefault();
      // Request account access with MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0]; // The first account is the user's primary account

      const blockChainAdd = accounts[0];
      const isEmailUsed = await auth.methods.isEmailUsed(email).call({ from: account });
      const isBlockchainAddUsed = await auth.methods.isBlockchainAddressUsed(blockChainAdd).call({ from: account });
  
      if (isEmailUsed) {
        alert("Email is already used. Please, use another email.");
        return;
      }
  
      if (isBlockchainAddUsed) {
        alert("Blockchain address is already used. Please, use another blockchain address.");
        return;
      }

      if (password !== confirmpassword) {
        alert("Password and confirmpassword dosen't match.");
        return;
      }
  
      // Send the transaction to the blockchain
      await auth.methods
        .createUser(blockChainAdd, name, email, number, userRole, password)
        .send({ from: account });
      
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
          <div className="signup-close-icon" onClick={handleClose}>
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
              type="email"
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
            <button type="button" onClick={handleLoginClick}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;