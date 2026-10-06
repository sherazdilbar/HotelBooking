import React, { useState, useEffect } from 'react';
import HotelCard from '../components/HotelCard';
import FilterPanel from '../components/FilterPanel';
import { useHotels } from '../context/HotelContext';
import './SearchResults.css';

const SearchResults = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('price');
  const [showFilters, setShowFilters] = useState(false);
  const { 
    filteredHotels, 
    loading, 
    currentPage, 
    setCurrentPage, 
    totalPages,
    searchParams,
    filters
  } = useHotels();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    document.body.style.overflow = showFilters ? 'hidden' : 'auto';
  }, [showFilters]);

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHotels = sortedHotels.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => handlePageChange(1)} className="pagination-btn">
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots1" className="pagination-dots">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots2" className="pagination-dots">...</span>);
      }
      pages.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)} className="pagination-btn">
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="search-results-container">
      <div className="results-wrapper">
        
        <div className="results-header">
          <div className="header-content">
            <div className="search-info">
              <h1 className="results-title">
                Hotels in {searchParams.location || 'All Destinations'}
              </h1>
              <p className="results-count">
                {filteredHotels.length} properties found
              </p>
              {searchParams.checkIn && (
                <p className="search-dates">
                  {new Date(searchParams.checkIn).toLocaleDateString()} - {' '}
                  {new Date(searchParams.checkOut).toLocaleDateString()}
                  {' • '}
                  {searchParams.guests} guest{searchParams.guests > 1 ? 's' : ''} 
                  {' • '}
                  {searchParams.rooms} room{searchParams.rooms > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="header-controls">
              <div className="view-controls">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <span className="view-icon">⊞</span>
                  Grid
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <span className="view-icon">☰</span>
                  List
                </button>
              </div>

              <div className="sort-controls">
                <label htmlFor="sortBy" className="sort-label">Sort by:</label>
                <select 
                  id="sortBy"
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="price">Price (Low to High)</option>
                  <option value="rating">Rating (High to Low)</option>
                  <option value="name">Name (A to Z)</option>
                </select>
              </div>

              <button 
                className="filter-toggle"
                onClick={() => setShowFilters(true)}
              >
                <span className="filter-icon">🔍</span>
                Filters
                {Object.keys(filters).length > 0 && (
                  <span className="filter-count">
                    {Object.keys(filters).length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="results-content">
          <div className="content-layout">
            
            <aside className="sidebar-filters">
              <FilterPanel />
            </aside>

            <main className="results-main">
              {loading ? (
                <div className="loading-section">
                  <div className="loading-grid">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="loading-card">
                        <div className="loading-image"></div>
                        <div className="loading-content">
                          <div className="loading-line long"></div>
                          <div className="loading-line medium"></div>
                          <div className="loading-line short"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : filteredHotels.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-icon">🏨</div>
                    <h2 className="no-results-title">No hotels found</h2>
                    <p className="no-results-text">
                      Try adjusting your search criteria or filters to find more options.
                    </p>
                    <button 
                      className="clear-filters-btn"
                      onClick={() => window.location.reload()}
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={`hotels-grid ${viewMode}`}>
                    {paginatedHotels.map(hotel => (
                      <div key={hotel.id} className="hotel-item">
                        <HotelCard hotel={hotel} />
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination-section">
                      <div className="pagination-container">
                        <button 
                          className="pagination-nav"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          ← Previous
                        </button>
                        
                        <div className="pagination-numbers">
                          {renderPagination()}
                        </div>

                        <button 
                          className="pagination-nav"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next →
                        </button>
                      </div>

                      <div className="pagination-info">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredHotels.length)} of {filteredHotels.length} results
                      </div>
                    </div>
                  )}
                </>
              )}
            </main>

          </div>
        </div>

      </div>

      {showFilters && (
        <div className="mobile-filter-overlay">
          <div className="mobile-filter-content">
            <div className="mobile-filter-header">
              <h3>Filters</h3>
              <button 
                className="close-filters"
                onClick={() => setShowFilters(false)}
              >
                ✕
              </button>
            </div>
            <div className="mobile-filter-body">
              <FilterPanel mobile />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;