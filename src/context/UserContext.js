import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState('light');
  const [preferences, setPreferences] = useState({});

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    loadUserData();
  }, [isLoggedIn]);

  useEffect(() => {
    savePreferences();
  }, [preferences]);

  useEffect(() => {
    applyTheme();
  }, [theme]);

  useEffect(() => {
    updateWishlist();
  }, [wishlist]);

  const checkLoginStatus = () => {
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsLoggedIn(true);
      setUser({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890"
      });
    }
  };

  const loadUserData = () => {
    if (isLoggedIn) {
      const savedWishlist = localStorage.getItem('wishlist');
      const savedBookings = localStorage.getItem('bookings');
      const savedPreferences = localStorage.getItem('preferences');
      
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
      
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      }
      
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  };

  const savePreferences = () => {
    if (Object.keys(preferences).length > 0) {
      localStorage.setItem('preferences', JSON.stringify(preferences));
    }
  };

  const applyTheme = () => {
    document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
    document.documentElement.style.setProperty('--theme-mode', theme);
  };

  const updateWishlist = () => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  const login = (credentials) => {
    setTimeout(() => {
      setIsLoggedIn(true);
      setUser({
        id: 1,
        name: credentials.email.split('@')[0],
        email: credentials.email,
        phone: "+1234567890"
      });
      localStorage.setItem('userToken', 'mock-token-123');
    }, 1000);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setWishlist([]);
    setBookings([]);
    localStorage.removeItem('userToken');
    localStorage.removeItem('wishlist');
    localStorage.removeItem('bookings');
  };

  const addToWishlist = (hotelId) => {
    if (!wishlist.includes(hotelId)) {
      setWishlist([...wishlist, hotelId]);
    }
  };

  const removeFromWishlist = (hotelId) => {
    setWishlist(wishlist.filter(id => id !== hotelId));
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const value = {
    user,
    wishlist,
    bookings,
    isLoggedIn,
    theme,
    preferences,
    login,
    logout,
    addToWishlist,
    removeFromWishlist,
    toggleTheme,
    setPreferences
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};