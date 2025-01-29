import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Fixed import
import toast from 'react-hot-toast';

export const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [book,setBook]=useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]); // Fixed initialization syntax

  const Login = (data) => {
    setUser(data);
  };

  const Logout = () => {
    setUser(null);
    localStorage.removeItem('MentalHealth');
    toast("Logged out successfully");
  };

  useEffect(() => {
    const refreshToken = localStorage.getItem('MentalHealth');
    if (refreshToken) {
      try {
        const decoded = jwtDecode(refreshToken);
        setUser(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    setLoading(false); // Set loading to false after token check
  }, []);

  return (
    <UserContext.Provider value={{ user, Login, Logout, loading, reviews, setReviews,book,setBook }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
