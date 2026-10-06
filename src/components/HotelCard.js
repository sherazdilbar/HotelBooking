import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './HotelCard.css';

const HotelCard = ({ hotel, featured = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToWishlist, removeFromWishlist, wishlist } = useUser();

  const isInWishlist = wishlist.includes(hotel.id);

  useEffect(() => {
    let interval;
    if (isHovered && featured) {
      interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % 3);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isHovered, featured]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [hotel]);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist) {
      removeFromWishlist(hotel.id);
    } else {
      addToWishlist(hotel.id);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">⭐</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">⭐</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    
    return stars;
  };

  return (
    <Link to={`/hotel/${hotel.id}`} className="hotel-card-link">
      <div 
        className={`hotel-card ${featured ? 'featured' : ''} ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="card-container">
          
          <div className="image-section">
            <div className="image-container">
              <div className="image-wrapper">
                {!imageLoaded && (
                  <div className="image-placeholder">
                    <div className="placeholder-spinner"></div>
                  </div>
                )}
                <img 
                  src={hotel.image || '/api/placeholder/400/300'}
                  alt={hotel.name}
                  className={`hotel-image ${imageLoaded ? 'loaded' : ''}`}
                  onLoad={handleImageLoad}
                  loading="lazy"
                />
                
                {featured && (
                  <div className="featured-badge">
                    <span className="badge-text">Featured</span>
                  </div>
                )}

                <button 
                  className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                  onClick={handleWishlistToggle}
                  aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <span className="heart-icon">
                    {isInWishlist ? '❤️' : '🤍'}
                  </span>
                </button>
              </div>

              {isHovered && (
                <div className="image-overlay">
                  <div className="overlay-content">
                    <div className="quick-info">
                      <span className="info-item">
                        <span className="info-icon">📍</span>
                        {hotel.location}
                      </span>
                      <span className="info-item">
                        <span className="info-icon">🏨</span>
                        {hotel.rooms?.length || 3} room types
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="content-section">
            <div className="hotel-header">
              <div className="hotel-info">
                <h3 className="hotel-name">{hotel.name}</h3>
                <div className="hotel-location">
                  <span className="location-icon">📍</span>
                  <span className="location-text">{hotel.location}</span>
                </div>
              </div>

              <div className="rating-section">
                <div className="stars-container">
                  {renderStars(hotel.rating)}
                </div>
                <span className="rating-number">{hotel.rating}</span>
              </div>
            </div>

            <div className="amenities-section">
              <div className="amenities-grid">
                {hotel.amenities?.slice(0, 4).map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <span className="amenity-icon">
                      {amenity === 'Pool' && '🏊'}
                      {amenity === 'Spa' && '💆'}
                      {amenity === 'Restaurant' && '🍽️'}
                      {amenity === 'WiFi' && '📶'}
                      {amenity === 'Beach Access' && '🏖️'}
                      {amenity === 'Bar' && '🍸'}
                      {amenity === 'Ski Access' && '⛷️'}
                      {amenity === 'Fireplace' && '🔥'}
                    </span>
                    <span className="amenity-text">{amenity}</span>
                  </div>
                ))}
              </div>

              {hotel.amenities?.length > 4 && (
                <div className="more-amenities">
                  <span className="more-text">
                    +{hotel.amenities.length - 4} more amenities
                  </span>
                </div>
              )}
            </div>

            <div className="price-section">
              <div className="price-container">
                <div className="price-info">
                  <span className="price-label">From</span>
                  <div className="price-wrapper">
                    <span className="currency">$</span>
                    <span className="price-amount">{hotel.price}</span>
                    <span className="price-period">/night</span>
                  </div>
                </div>

                <div className="booking-info">
                  <span className="availability">Available</span>
                  <span className="book-text">Book Now</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {featured && (
          <div className="featured-details">
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Rooms Available</span>
                <span className="detail-value">{hotel.rooms?.length || 3}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Amenities</span>
                <span className="detail-value">{hotel.amenities?.length || 4}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </Link>
  );
};

export default HotelCard;