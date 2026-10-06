import React, { createContext, useContext, useState, useEffect } from 'react';

const HotelContext = createContext();

export const useHotels = () => {
  return useContext(HotelContext);
};

export const HotelProvider = ({ children }) => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    setFilteredHotels(hotels);
  }, [hotels]);

  useEffect(() => {
    applyFilters();
  }, [filters, hotels]);

  useEffect(() => {
    if (searchParams.location) {
      searchHotels();
    }
  }, [searchParams]);

  useEffect(() => {
    updatePagination();
  }, [filteredHotels, currentPage]);

  const fetchHotels = async () => {
    setLoading(true);
    
    const mockHotels = [
      {
        id: 1,
        name: "Grand Palace Resort",
        location: "Paris, France",
        rating: 4.8,
        price: 299,
        image: "/api/placeholder/400/300",
        amenities: ["Pool", "Spa", "Restaurant", "WiFi"],
        rooms: ["Deluxe Suite", "Ocean View", "Standard Room"]
      },
      {
        id: 2,
        name: "Ocean Breeze Hotel",
        location: "Miami, USA", 
        rating: 4.5,
        price: 189,
        image: "/api/placeholder/400/300",
        amenities: ["Beach Access", "Pool", "Bar", "WiFi"],
        rooms: ["Beach Suite", "City View", "Standard Room"]
      },
      {
        id: 3,
        name: "Mountain View Lodge",
        location: "Aspen, USA",
        rating: 4.7,
        price: 350,
        image: "/api/placeholder/400/300", 
        amenities: ["Ski Access", "Fireplace", "Restaurant", "Spa"],
        rooms: ["Mountain Suite", "Standard Room", "Family Room"]
      }
    ];
    
    setTimeout(() => {
      setHotels(mockHotels);
      setLoading(false);
    }, 1000);
  };

  const searchHotels = () => {
    setLoading(true);
    
    setTimeout(() => {
      const filtered = hotels.filter(hotel => 
        hotel.location.toLowerCase().includes(searchParams.location?.toLowerCase() || '')
      );
      setFilteredHotels(filtered);
      setLoading(false);
    }, 500);
  };

  const applyFilters = () => {
    let filtered = [...hotels];
    
    if (filters.priceRange) {
      filtered = filtered.filter(hotel => 
        hotel.price >= filters.priceRange[0] && hotel.price <= filters.priceRange[1]
      );
    }
    
    if (filters.rating) {
      filtered = filtered.filter(hotel => hotel.rating >= filters.rating);
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(hotel =>
        filters.amenities.some(amenity => hotel.amenities.includes(amenity))
      );
    }
    
    setFilteredHotels(filtered);
    setCurrentPage(1);
  };

  const updatePagination = () => {
    const itemsPerPage = 6;
    setTotalPages(Math.ceil(filteredHotels.length / itemsPerPage));
  };

  const value = {
    hotels,
    filteredHotels,
    searchParams,
    setSearchParams,
    loading,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchHotels,
    searchHotels,
    applyFilters
  };

  return (
    <HotelContext.Provider value={value}>
      {children}
    </HotelContext.Provider>
  );
};