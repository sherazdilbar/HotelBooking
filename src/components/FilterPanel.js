import React, { useState, useEffect } from 'react';
import { useHotels } from '../context/HotelContext';
import './FilterPanel.css';

const FilterPanel = ({ mobile = false }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const { filters, setFilters } = useHotels();

  useEffect(() => {
    const newFilters = {};
    
    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      newFilters.priceRange = priceRange;
    }
    
    if (selectedRating > 0) {
      newFilters.rating = selectedRating;
    }
    
    if (selectedAmenities.length > 0) {
      newFilters.amenities = selectedAmenities;
    }
    
    if (selectedRoomTypes.length > 0) {
      newFilters.roomTypes = selectedRoomTypes;
    }
    
    setFilters(newFilters);
  }, [priceRange, selectedRating, selectedAmenities, selectedRoomTypes, setFilters]);

  useEffect(() => {
    if (filters.priceRange) {
      setPriceRange(filters.priceRange);
    }
    if (filters.rating) {
      setSelectedRating(filters.rating);
    }
    if (filters.amenities) {
      setSelectedAmenities(filters.amenities);
    }
    if (filters.roomTypes) {
      setSelectedRoomTypes(filters.roomTypes);
    }
  }, []);

  const amenitiesList = [
    { id: 'pool', name: 'Pool', icon: '🏊' },
    { id: 'spa', name: 'Spa', icon: '💆' },
    { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
    { id: 'wifi', name: 'WiFi', icon: '📶' },
    { id: 'beach', name: 'Beach Access', icon: '🏖️' },
    { id: 'bar', name: 'Bar', icon: '🍸' },
    { id: 'ski', name: 'Ski Access', icon: '⛷️' },
    { id: 'fireplace', name: 'Fireplace', icon: '🔥' }
  ];

  const roomTypesList = [
    { id: 'standard', name: 'Standard Room' },
    { id: 'deluxe', name: 'Deluxe Suite' },
    { id: 'ocean', name: 'Ocean View' },
    { id: 'city', name: 'City View' },
    { id: 'beach', name: 'Beach Suite' },
    { id: 'mountain', name: 'Mountain Suite' },
    { id: 'family', name: 'Family Room' }
  ];

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value);
    
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1];
    }
    
    setPriceRange(newRange);
  };

  const handleAmenityToggle = (amenityId) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleRoomTypeToggle = (roomTypeId) => {
    setSelectedRoomTypes(prev => 
      prev.includes(roomTypeId)
        ? prev.filter(id => id !== roomTypeId)
        : [...prev, roomTypeId]
    );
  };

  const clearAllFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedRating(0);
    setSelectedAmenities([]);
    setSelectedRoomTypes([]);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`star-rating ${index < rating ? 'filled' : ''}`}
        onClick={() => setSelectedRating(index + 1)}
      >
        ⭐
      </span>
    ));
  };

  return (
    <div className={`filter-panel ${mobile ? 'mobile' : ''}`}>
      <div className="filter-header">
        <h3 className="filter-title">Filters</h3>
        <button 
          className="clear-all-btn"
          onClick={clearAllFilters}
        >
          Clear All
        </button>
      </div>

      <div className="filter-sections">
        
        <div className="filter-section">
          <h4 className="section-title">Price Range</h4>
          <div className="price-filter">
            <div className="price-inputs">
              <div className="price-input-group">
                <label htmlFor="minPrice" className="price-label">Min</label>
                <div className="input-wrapper">
                  <span className="currency-symbol">$</span>
                  <input
                    id="minPrice"
                    type="number"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                    className="price-input"
                  />
                </div>
              </div>
              <div className="price-separator">-</div>
              <div className="price-input-group">
                <label htmlFor="maxPrice" className="price-label">Max</label>
                <div className="input-wrapper">
                  <span className="currency-symbol">$</span>
                  <input
                    id="maxPrice"
                    type="number"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                    className="price-input"
                  />
                </div>
              </div>
            </div>

            <div className="price-range-slider">
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(0, e.target.value)}
                  className="range-input min-range"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  className="range-input max-range"
                />
                <div className="slider-track">
                  <div 
                    className="slider-fill"
                    style={{
                      left: `${(priceRange[0] / 1000) * 100}%`,
                      width: `${((priceRange[1] - priceRange[0]) / 1000) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h4 className="section-title">Rating</h4>
          <div className="rating-filter">
            <div className="rating-options">
              <div 
                className={`rating-option ${selectedRating === 0 ? 'selected' : ''}`}
                onClick={() => setSelectedRating(0)}
              >
                <span className="rating-text">Any Rating</span>
              </div>
              {[5, 4, 3, 2, 1].map(rating => (
                <div 
                  key={rating}
                  className={`rating-option ${selectedRating === rating ? 'selected' : ''}`}
                  onClick={() => setSelectedRating(rating)}
                >
                  <div className="stars-display">
                    {renderStars(rating)}
                  </div>
                  <span className="rating-text">{rating}+ Stars</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h4 className="section-title">Amenities</h4>
          <div className="amenities-filter">
            <div className="amenities-grid">
              {amenitiesList.map(amenity => (
                <label 
                  key={amenity.id}
                  className={`amenity-option ${selectedAmenities.includes(amenity.id) ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="amenity-checkbox"
                  />
                  <div className="amenity-content">
                    <span className="amenity-icon">{amenity.icon}</span>
                    <span className="amenity-name">{amenity.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h4 className="section-title">Room Types</h4>
          <div className="room-types-filter">
            <div className="room-types-list">
              {roomTypesList.map(roomType => (
                <label 
                  key={roomType.id}
                  className={`room-type-option ${selectedRoomTypes.includes(roomType.id) ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRoomTypes.includes(roomType.id)}
                    onChange={() => handleRoomTypeToggle(roomType.id)}
                    className="room-type-checkbox"
                  />
                  <div className="room-type-content">
                    <span className="room-type-name">{roomType.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FilterPanel;