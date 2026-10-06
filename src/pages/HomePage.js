import React, { useState, useEffect } from 'react';
import SearchForm from '../components/SearchForm';
import HotelCard from '../components/HotelCard';
import { useHotels } from '../context/HotelContext';
import { useUser } from '../context/UserContext';
import './HomePage.css';

const HomePage = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const { hotels, loading } = useHotels();
  const { theme } = useUser();

  useEffect(() => {
    if (hotels.length > 0) {
      setFeaturedHotels(hotels.slice(0, 3));
    }
  }, [hotels]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showFilters ? 'hidden' : 'auto';
  }, [showFilters]);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      text: "Amazing experience! The booking process was seamless and the hotel exceeded expectations.",
      rating: 5
    },
    {
      id: 2, 
      name: "Mike Chen",
      text: "Great platform with excellent customer service. Highly recommend!",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Davis", 
      text: "Found the perfect hotel for our vacation. Will definitely use again!",
      rating: 4
    }
  ];

  return (
    <div className="homepage-container">
      <div className="content-wrapper">
        
        <section className="hero-section">
          <div className="hero-overlay">
            <div className="hero-content">
              <div className="nested-layout">
                <div className="hero-text-wrapper">
                  <h1 className="hero-title">
                    Discover Your Perfect Stay
                  </h1>
                  <p className="hero-subtitle">
                    Book luxury hotels worldwide with our premium platform
                  </p>
                </div>

                <div className="hero-search-container">
                  <div className="search-overlay">
                    <SearchForm />
                  </div>
                </div>

                <div className="hero-stats">
                  <div className="stat-item">
                    <div className="stat-number">10,000+</div>
                    <div className="stat-label">Hotels</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">150+</div>
                    <div className="stat-label">Countries</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">1M+</div>
                    <div className="stat-label">Happy Guests</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hero-background">
            <div className="background-slide active">
              <img src="/api/placeholder/1200/600" alt="Luxury Hotel" />
            </div>
            <div className="background-slide">
              <img src="/api/placeholder/1200/600" alt="Resort View" />
            </div>
            <div className="background-slide">
              <img src="/api/placeholder/1200/600" alt="City Hotel" />
            </div>
          </div>
        </section>

        <section className="featured-section">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">Featured Hotels</h2>
              <p className="section-subtitle">Handpicked luxury accommodations</p>
            </div>

            <div className="featured-grid">
              <div className="flex-container">
                {loading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading amazing hotels...</p>
                  </div>
                ) : (
                  featuredHotels.map(hotel => (
                    <div key={hotel.id} className="featured-card-wrapper">
                      <HotelCard hotel={hotel} featured={true} />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="view-all-container">
              <button className="view-all-btn">
                View All Hotels
              </button>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="features-background">
            <div className="section-container">
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">🏨</div>
                  <h3 className="feature-title">Premium Selection</h3>
                  <p className="feature-text">Curated luxury hotels and resorts worldwide</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💰</div>
                  <h3 className="feature-title">Best Prices</h3>
                  <p className="feature-text">Guaranteed lowest prices with price matching</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔒</div>
                  <h3 className="feature-title">Secure Booking</h3>
                  <p className="feature-text">Safe and encrypted payment processing</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⭐</div>
                  <h3 className="feature-title">24/7 Support</h3>
                  <p className="feature-text">Round-the-clock customer assistance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="testimonials-section">
          <div className="testimonials-container">
            <div className="testimonials-header">
              <h2 className="testimonials-title">What Our Guests Say</h2>
            </div>

            <div className="testimonials-carousel">
              <div className="carousel-container">
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={testimonial.id}
                    className={`testimonial-card ${index === currentSlide ? 'active' : ''}`}
                  >
                    <div className="testimonial-content">
                      <div className="testimonial-rating">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="star">⭐</span>
                        ))}
                      </div>
                      <p className="testimonial-text">{testimonial.text}</p>
                      <div className="testimonial-author">
                        <div className="author-avatar">
                          {testimonial.name.charAt(0)}
                        </div>
                        <span className="author-name">{testimonial.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="carousel-dots">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="newsletter-section">
          <div className="newsletter-overlay">
            <div className="newsletter-content">
              <h2 className="newsletter-title">Stay Updated</h2>
              <p className="newsletter-subtitle">Get exclusive deals and travel tips</p>
              
              <div className="newsletter-form-wrapper">
                <form className="newsletter-form">
                  <div className="input-group">
                    <input 
                      type="email" 
                      placeholder="Enter your email address"
                      className="newsletter-input"
                      required
                    />
                    <button type="submit" className="newsletter-btn">
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

      </div>

      {showFilters && (
        <div className="overlay-content">
          <div className="filter-modal">
            <h3>Advanced Filters</h3>
            <button 
              onClick={() => setShowFilters(false)}
              className="close-modal"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;