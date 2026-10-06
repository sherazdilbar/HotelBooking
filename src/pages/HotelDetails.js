import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHotels } from '../context/HotelContext';
import { useUser } from '../context/UserContext';
import './HotelDetails.css';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { hotels } = useHotels();
  const { addToWishlist, removeFromWishlist, wishlist } = useUser();

  const images = [
    '/api/placeholder/800/400',
    '/api/placeholder/800/400', 
    '/api/placeholder/800/400'
  ];

  useEffect(() => {
    const foundHotel = hotels.find(h => h.id === parseInt(id));
    if (foundHotel) {
      setHotel(foundHotel);
      setSelectedRoom(foundHotel.rooms?.[0] || 'Standard Room');
    }
    setLoading(false);
  }, [id, hotels]);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setCheckIn(today.toISOString().split('T')[0]);
    setCheckOut(tomorrow.toISOString().split('T')[0]);
  }, []);

  const isInWishlist = hotel && wishlist.includes(hotel.id);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(hotel.id);
    } else {
      addToWishlist(hotel.id);
    }
  };

  const handleBooking = () => {
    const bookingData = {
      hotelId: hotel.id,
      hotelName: hotel.name,
      room: selectedRoom,
      checkIn,
      checkOut,
      guests,
      totalPrice: calculateTotal()
    };
    
    navigate('/booking-confirmation', { state: bookingData });
  };

  const calculateTotal = () => {
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    return hotel.price * nights * guests;
  };

  if (loading) {
    return (
      <div className="hotel-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading hotel details...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="hotel-not-found">
        <h2>Hotel not found</h2>
        <button onClick={() => navigate('/')}>Go Back Home</button>
      </div>
    );
  }

  return (
    <div className="hotel-details-container">
      <div className="details-wrapper">
        
        <div className="hotel-gallery">
          <div className="gallery-main">
            <img 
              src={images[activeImageIndex]} 
              alt={hotel.name}
              className="main-image"
            />
            <div className="image-controls">
              <button 
                className="nav-btn prev"
                onClick={() => setActiveImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
              >
                ‹
              </button>
              <button 
                className="nav-btn next"
                onClick={() => setActiveImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
              >
                ›
              </button>
            </div>
          </div>
          
          <div className="gallery-thumbnails">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${hotel.name} view ${index + 1}`}
                className={`thumbnail ${activeImageIndex === index ? 'active' : ''}`}
                onClick={() => setActiveImageIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="hotel-content">
          <div className="content-grid">
            
            <div className="hotel-info-section">
              <div className="hotel-header">
                <div className="header-left">
                  <h1 className="hotel-name">{hotel.name}</h1>
                  <div className="location-rating">
                    <span className="location">📍 {hotel.location}</span>
                    <div className="rating">
                      <span className="stars">⭐ {hotel.rating}</span>
                      <span className="reviews">(248 reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="header-actions">
                  <button 
                    className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                    onClick={handleWishlistToggle}
                  >
                    {isInWishlist ? '❤️' : '🤍'} {isInWishlist ? 'Saved' : 'Save'}
                  </button>
                  <button className="share-btn">
                    📤 Share
                  </button>
                </div>
              </div>

              <div className="hotel-description">
                <h3>About this hotel</h3>
                <p>
                  Experience luxury and comfort at {hotel.name}. Located in the heart of {hotel.location}, 
                  our hotel offers world-class amenities and exceptional service. Whether you're traveling 
                  for business or pleasure, we provide the perfect retreat with stunning views and 
                  premium accommodations.
                </p>
              </div>

              <div className="amenities-section">
                <h3>Amenities</h3>
                <div className="amenities-grid">
                  {hotel.amenities?.map((amenity, index) => (
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
              </div>

              <div className="rooms-section">
                <h3>Room Options</h3>
                <div className="rooms-list">
                  {hotel.rooms?.map((room, index) => (
                    <div 
                      key={index} 
                      className={`room-option ${selectedRoom === room ? 'selected' : ''}`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <div className="room-info">
                        <h4 className="room-name">{room}</h4>
                        <p className="room-features">• King bed • City view • 32 sqm</p>
                      </div>
                      <div className="room-price">
                        <span className="price">${hotel.price}</span>
                        <span className="period">/night</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="booking-section">
              <div className="booking-card">
                <div className="booking-header">
                  <div className="price-display">
                    <span className="price">${hotel.price}</span>
                    <span className="period">per night</span>
                  </div>
                  <div className="rating-small">
                    ⭐ {hotel.rating} (248)
                  </div>
                </div>

                <div className="booking-form">
                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Check-in</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="form-group">
                      <label>Check-out</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Guests</label>
                    <select 
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                    >
                      {[1,2,3,4,5,6].map(num => (
                        <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Room Type</label>
                    <select 
                      value={selectedRoom}
                      onChange={(e) => setSelectedRoom(e.target.value)}
                    >
                      {hotel.rooms?.map((room, index) => (
                        <option key={index} value={room}>{room}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    className="book-now-btn"
                    onClick={handleBooking}
                  >
                    Reserve Now
                  </button>

                  <div className="booking-summary">
                    <div className="summary-row">
                      <span>Base price</span>
                      <span>${hotel.price} × {Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))} nights</span>
                    </div>
                    <div className="summary-row">
                      <span>Service fee</span>
                      <span>$25</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>${calculateTotal() + 25}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default HotelDetails;