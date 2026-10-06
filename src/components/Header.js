import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, isLoggedIn, logout, toggleTheme, theme } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [scrolled]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <header className={`header-main ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-grid">
          <div className="logo-section">
            <Link to="/" className="logo-link">
              <div className="logo-wrapper">
                <h1 className="logo-text">LuxStay</h1>
                <span className="logo-subtitle">Hotels</span>
              </div>
            </Link>
          </div>

          <nav className={`nav-section ${isMenuOpen ? 'nav-open' : ''}`}>
            <div className="nav-container">
              <div className="nav-links">
                <Link to="/" className="nav-item">Home</Link>
                <Link to="/search" className="nav-item">Search</Link>
                <Link to="/wishlist" className="nav-item">Wishlist</Link>
              </div>
            </div>
          </nav>

          <div className="actions-section">
            <div className="theme-toggle-wrapper">
              <button 
                onClick={toggleTheme}
                className={`theme-toggle ${theme}`}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>

            {isLoggedIn ? (
              <div className="user-menu">
                <button 
                  className="user-button"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="user-name">{user?.name}</span>
                  <div className="user-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>
                
                {showDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-content">
                      <Link to="/account" className="dropdown-item">
                        Account
                      </Link>
                      <Link to="/wishlist" className="dropdown-item">
                        My Wishlist
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="dropdown-item logout-btn"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="login-btn">Login</Link>
                <Link to="/signup" className="signup-btn">Sign Up</Link>
              </div>
            )}

            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;