import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setProfile(data.user);
        });
    }
  }, []);

  return (
    <UserContext.Provider value={profile}>
      {children}
    </UserContext.Provider>
  );
} 