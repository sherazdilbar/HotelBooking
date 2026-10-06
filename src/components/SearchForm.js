import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotels } from '../context/HotelContext';
import './SearchForm.css';

const SearchForm = () => {
  const [formData, setFormData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { setSearchParams } = useHotels();
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.location.length > 2) {
      loadSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [formData.location]);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setFormData(prev => ({
      ...prev,
      checkIn: today.toISOString().split('T')[0],
      checkOut: tomorrow.toISOString().split('T')[0]
    }));
  }, []);

  const loadSuggestions = () => {
    const mockSuggestions = [
      'Paris, France',
      'Miami, USA', 
      'Aspen, USA',
      'Tokyo, Japan',
      'London, UK',
      'Dubai, UAE'
    ].filter(location => 
      location.toLowerCase().includes(formData.location.toLowerCase())
    );
    
    setSuggestions(mockSuggestions);
    setShowSuggestions(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      location: suggestion
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    setTimeout(() => {
      setSearchParams(formData);
      navigate('/search');
      setIsSearching(false);
    }, 1000);
  };

  const incrementGuests = () => {
    setFormData(prev => ({
      ...prev,
      guests: Math.min(prev.guests + 1, 10)
    }));
  };

  const decrementGuests = () => {
    setFormData(prev => ({
      ...prev,
      guests: Math.max(prev.guests - 1, 1)
    }));
  };

  const incrementRooms = () => {
    setFormData(prev => ({
      ...prev,
      rooms: Math.min(prev.rooms + 1, 5)
    }));
  };

  const decrementRooms = () => {
    setFormData(prev => ({
      ...prev,
      rooms: Math.max(prev.rooms - 1, 1)
    }));
  };

  return (
    <div className="search-form-container">
      <form onSubmit={handleSubmit} className="search-form">
        
        <div className="form-grid">
          
          <div className="form-group location-group">
            <label className="form-label">
              <span className="label-text">Where to?</span>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter destination"
                  className="form-input location-input"
                  autoComplete="off"
                />
                <div className="input-icon">📍</div>
                
                {showSuggestions && suggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    <ul className="suggestions-list">
                      {suggestions.map((suggestion, index) => (
                        <li 
                          key={index}
                          className="suggestion-item"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <span className="suggestion-icon">📍</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </label>
          </div>

          <div className="form-group date-group">
            <label className="form-label">
              <span className="label-text">Check-in</span>
              <div className="input-wrapper">
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleInputChange}
                  className="form-input date-input"
                  min={new Date().toISOString().split('T')[0]}
                />
                <div className="input-icon">📅</div>
              </div>
            </label>
          </div>

          <div className="form-group date-group">
            <label className="form-label">
              <span className="label-text">Check-out</span>
              <div className="input-wrapper">
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleInputChange}
                  className="form-input date-input"
                  min={formData.checkIn}
                />
                <div className="input-icon">📅</div>
              </div>
            </label>
          </div>

          <div className="form-group counter-group">
            <label className="form-label">
              <span className="label-text">Guests</span>
              <div className="counter-wrapper">
                <button 
                  type="button"
                  onClick={decrementGuests}
                  className="counter-btn"
                >
                  -
                </button>
                <span className="counter-value">{formData.guests}</span>
                <button 
                  type="button"
                  onClick={incrementGuests}
                  className="counter-btn"
                >
                  +
                </button>
              </div>
            </label>
          </div>

          <div className="form-group counter-group">
            <label className="form-label">
              <span className="label-text">Rooms</span>
              <div className="counter-wrapper">
                <button 
                  type="button"
                  onClick={decrementRooms}
                  className="counter-btn"
                >
                  -
                </button>
                <span className="counter-value">{formData.rooms}</span>
                <button 
                  type="button"
                  onClick={incrementRooms}
                  className="counter-btn"
                >
                  +
                </button>
              </div>
            </label>
          </div>

          <div className="form-group submit-group">
            <button 
              type="submit"
              className={`search-btn ${isSearching ? 'searching' : ''}`}
              disabled={isSearching || !formData.location}
            >
              {isSearching ? (
                <span className="search-spinner">🔄</span>
              ) : (
                <>
                  <span className="search-icon">🔍</span>
                  <span className="search-text">Search Hotels</span>
                </>
              )}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
};

export default SearchForm;