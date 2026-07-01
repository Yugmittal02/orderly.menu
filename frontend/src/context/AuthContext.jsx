import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [superAdmin, setSuperAdmin] = useState(null);
  const [cafeUser, setCafeUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore SuperAdmin session
    const storedAdmin = localStorage.getItem('superAdmin');
    const adminToken = localStorage.getItem('superAdminToken');
    if (storedAdmin && adminToken) {
      setSuperAdmin(JSON.parse(storedAdmin));
    }

    // Restore Cafe Owner session
    const storedCafe = localStorage.getItem('cafeUser');
    const cafeToken = localStorage.getItem('cafeToken');
    if (storedCafe && cafeToken) {
      setCafeUser(JSON.parse(storedCafe));
    }

    setLoading(false);
  }, []);

  const loginAsSuperAdmin = (user, token) => {
    localStorage.setItem('superAdminToken', token);
    localStorage.setItem('superAdmin', JSON.stringify(user));
    setSuperAdmin(user);
  };

  const loginAsCafeOwner = (user, token) => {
    localStorage.setItem('cafeToken', token);
    localStorage.setItem('cafeUser', JSON.stringify(user));
    setCafeUser(user);
  };

  const logoutSuperAdmin = () => {
    localStorage.removeItem('superAdminToken');
    localStorage.removeItem('superAdmin');
    setSuperAdmin(null);
  };

  const logoutCafeOwner = () => {
    localStorage.removeItem('cafeToken');
    localStorage.removeItem('cafeUser');
    setCafeUser(null);
  };

  return (
    <AuthContext.Provider value={{
      superAdmin,
      cafeUser,
      loading,
      loginAsSuperAdmin,
      loginAsCafeOwner,
      logoutSuperAdmin,
      logoutCafeOwner,
      isSuperAdmin: !!superAdmin,
      isCafeOwner: !!cafeUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
