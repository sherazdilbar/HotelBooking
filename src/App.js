import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SearchResults from './pages/SearchResults';
import HotelDetails from './pages/HotelDetails';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import { HotelProvider } from './context/HotelContext';
import { UserProvider } from './context/UserContext';
import './App.css';

function App() {
  return (
    <Router>
      <UserProvider>
        <HotelProvider>
          <div className="main-container">
            <div className="layout-grid">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/hotel/:id" element={<HotelDetails />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/account" element={<Account />} />
                </Routes>
              </main>
            </div>
          </div>
        </HotelProvider>
      </UserProvider>
    </Router>
  );
}

export default App;