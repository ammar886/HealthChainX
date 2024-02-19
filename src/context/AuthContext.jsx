import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  const [userRole, setUserRoleState] = useState(null);

  useEffect(() => {
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
    const storedUserRole = localStorage.getItem('userRole');

    if (storedIsAuthenticated) {
      setIsAuthenticatedState(storedIsAuthenticated === 'true');
    }

    if (storedUserRole) {
      setUserRoleState(storedUserRole);
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userRole, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};