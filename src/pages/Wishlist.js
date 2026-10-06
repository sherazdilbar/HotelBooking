import React, { useState, useEffect } from 'react';
import HotelCard from '../components/HotelCard';
import { useUser } from '../context/UserContext';
import { useHotels } from '../context/HotelContext';
import './Wishlist.css';

const Wishlist = () => {
  const [wishlistHotels, setWishlistHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { wishlist, isLoggedIn } = useUser();
  const { hotels } = useHotels();

  useEffect(() => {
    if (hotels.length > 0 && wishlist.length > 0) {
      const filtered = hotels.filter(hotel => wishlist.includes(hotel.id));
      setWishlistHotels(filtered);
    } else {
      setWishlistHotels([]);
    }
    setLoading(false);
  }, [wishlist, hotels]);

  if (!isLoggedIn) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-wrapper">
          <div className="not-logged-in">
            <div className="login-prompt">
              <div className="prompt-icon">🔐</div>
              <h2>Please log in to view your wishlist</h2>
              <p>Save your favorite hotels and access them anytime</p>
              <button className="login-btn">Sign In</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-wrapper">
          <div className="wishlist-loading">
            <div className="loading-spinner"></div>
            <p>Loading your saved hotels...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-wrapper">
        
        <div className="wishlist-header">
          <div className="header-content">
            <h1 className="wishlist-title">My Wishlist</h1>
            <p className="wishlist-subtitle">
              {wishlistHotels.length} saved hotel{wishlistHotels.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {wishlistHotels.length > 0 && (
            <div className="header-actions">
              <button className="sort-btn">
                <span className="sort-icon">↕️</span>
                Sort by Price
              </button>
              <button className="share-btn">
                <span className="share-icon">📤</span>
                Share List
              </button>
            </div>
          )}
        </div>

        <div className="wishlist-content">
          {wishlistHotels.length === 0 ? (
            <div className="empty-wishlist">
              <div className="empty-content">
                <div className="empty-icon">💝</div>
                <h2 className="empty-title">Your wishlist is empty</h2>
                <p className="empty-text">
                  Start exploring hotels and save your favorites here. 
                  Click the heart icon on any hotel to add it to your wishlist.
                </p>
                <button 
                  className="explore-btn"
                  onClick={() => window.location.href = '/'}
                >
                  Explore Hotels
                </button>
              </div>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlistHotels.map(hotel => (
                <div key={hotel.id} className="wishlist-item">
                  <HotelCard hotel={hotel} />
                  <div className="item-overlay">
                    <div className="overlay-actions">
                      <button className="quick-book-btn">
                        Quick Book
                      </button>
                      <button className="compare-btn">
                        Compare
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {wishlistHotels.length > 0 && (
          <div className="wishlist-footer">
            <div className="footer-content">
              <div className="stats-section">
                <div className="stat-item">
                  <span className="stat-number">{wishlistHotels.length}</span>
                  <span className="stat-label">Saved Hotels</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    ${Math.min(...wishlistHotels.map(h => h.price))} - ${Math.max(...wishlistHotels.map(h => h.price))}
                  </span>
                  <span className="stat-label">Price Range</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {(wishlistHotels.reduce((sum, h) => sum + h.rating, 0) / wishlistHotels.length).toFixed(1)}⭐
                  </span>
                  <span className="stat-label">Avg Rating</span>
                </div>
              </div>
              
              <div className="actions-section">
                <button className="bulk-action-btn">
                  <span className="action-icon">📊</span>
                  Compare All
                </button>
                <button className="bulk-action-btn">
                  <span className="action-icon">📱</span>
                  Export List
                </button>
                <button className="bulk-action-btn clear">
                  <span className="action-icon">🗑️</span>
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;