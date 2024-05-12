import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  const [userRole, setUserRoleState] = useState(null);
  const [blockchainAddress, setBlockchainAddressState] = useState(null);
  const [emailAdd, setEmailAddState] = useState(null); // Change email to emailAdd

  useEffect(() => {
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
    const storedUserRole = localStorage.getItem('userRole');
    const storedBlockchainAddress = localStorage.getItem('blockchainAddress');
    const storedEmailAdd = localStorage.getItem('emailAdd'); // Change email to emailAdd

    if (storedIsAuthenticated) {
      setIsAuthenticatedState(storedIsAuthenticated === 'true');
    }

    if (storedUserRole) {
      setUserRoleState(storedUserRole);
    }

    if (storedBlockchainAddress) {
      setBlockchainAddressState(storedBlockchainAddress);
    }

    if (storedEmailAdd) {
      setEmailAddState(storedEmailAdd); // Change email to emailAdd
    }
  }, []);

  const setIsAuthenticated = (value) => {
    localStorage.setItem('isAuthenticated', value);
    setIsAuthenticatedState(value);
  };

  const setUserRole = (value) => {
    localStorage.setItem('userRole', value);
    setUserRoleState(value);
  };

  const setBlockchainAddress = (value) => {
    localStorage.setItem('blockchainAddress', value);
    setBlockchainAddressState(value);
  };

  const setEmailAdd = (value) => { // Change email to emailAdd
    localStorage.setItem('emailAdd', value);
    setEmailAddState(value);
  };

  const logout = () => {
    React.startTransition(() => {
      setIsAuthenticated(false);
      setUserRole(null);
      setBlockchainAddress(null);
      setEmailAdd(null); // Change email to emailAdd
    });
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('blockchainAddress');
    localStorage.removeItem('emailAdd'); // Change email to emailAdd
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userRole, setUserRole, blockchainAddress, setBlockchainAddress, emailAdd, setEmailAdd, logout }}>
      {children}
    </AuthContext.Provider>
  );
};