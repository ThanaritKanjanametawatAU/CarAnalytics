import React, { useState, useEffect } from 'react';
import './BrowseCarsPage.css';  // Import the CSS file
import carData from '../assets/taladrod-cars.json'; // Import the JSON data
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import {Link} from 'react-router-dom';

const BrowseCarsPage = () => {
  const [cars, setCars] = useState(carData.Cars);
  const [filteredCars, setFilteredCars] = useState(carData.Cars);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [filterOption, setFilterOption] = useState({ brand: '', model: '' });
  const [modelOptions, setModelOptions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isHighlightActive, setIsHighlightActive] = useState(false);
  const [loading, setLoading] = useState(true);  // Loading state

  // Load state from localStorage when component mounts
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);

    const savedHighlightState = JSON.parse(localStorage.getItem('isHighlightActive'));
    if (savedHighlightState !== null) {
      setIsHighlightActive(savedHighlightState);
    }

    // Simulate a loading delay of at least 1 second
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    let updatedCars = [...cars];

    // If highlight is active, filter only favorite cars
    if (isHighlightActive) {
      updatedCars = updatedCars.filter(car => favorites.includes(car.Cid));
    }

    // Search
    if (searchQuery) {
      updatedCars = updatedCars.filter(car =>
        car.NameMMT.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by brand and model
    if (filterOption.brand) {
      updatedCars = updatedCars.filter(car =>
        car.NameMMT.split(' ')[0].toLowerCase() === filterOption.brand.toLowerCase()
      );
    }

    if (filterOption.model) {
      updatedCars = updatedCars.filter(car =>
        car.Model.toLowerCase() === filterOption.model.toLowerCase()
      );

      // If a model is selected but no brand, select the first brand for that model
      if (!filterOption.brand && updatedCars.length > 0) {
        setFilterOption({ ...filterOption, brand: updatedCars[0].NameMMT.split(' ')[0] });
      }
    }

    // Sort
    if (sortOption === 'name-asc') {
      updatedCars.sort((a, b) => a.NameMMT.localeCompare(b.NameMMT));
    } else if (sortOption === 'name-desc') {
      updatedCars.sort((a, b) => b.NameMMT.localeCompare(a.NameMMT));
    } else if (sortOption === 'price-asc') {
      updatedCars.sort((a, b) => parseInt(a.Prc.replace(/,/g, ''), 10) - parseInt(b.Prc.replace(/,/g, ''), 10));
    } else if (sortOption === 'price-desc') {
      updatedCars.sort((a, b) => parseInt(b.Prc.replace(/,/g, ''), 10) - parseInt(a.Prc.replace(/,/g, ''), 10));
    }

    setFilteredCars(updatedCars);
  }, [searchQuery, sortOption, filterOption, cars, isHighlightActive, favorites]);

  useEffect(() => {
    // Update model options when brand is selected
    if (filterOption.brand) {
      const modelsForBrand = cars
        .filter(car => car.NameMMT.split(' ')[0].toLowerCase() === filterOption.brand.toLowerCase())
        .map(car => car.Model);

      setModelOptions([...new Set(modelsForBrand)]);
    }
  }, [filterOption.brand, cars]);

  useEffect(() => {
    // Update brand option if model is selected first and no brand is selected
    if (filterOption.model && !filterOption.brand) {
      const carWithModel = cars.find(car => car.Model.toLowerCase() === filterOption.model.toLowerCase());
      if (carWithModel) {
        setFilterOption({ ...filterOption, brand: carWithModel.NameMMT.split(' ')[0] });
      }
    }
  }, [filterOption.model, cars]);

  const handleFavoriteToggle = (carId) => {
    let updatedFavorites = [...favorites];
    if (favorites.includes(carId)) {
      updatedFavorites = updatedFavorites.filter(id => id !== carId);
    } else {
      updatedFavorites.push(carId);
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handleHighlightToggle = () => {
    const newHighlightState = !isHighlightActive;
    setIsHighlightActive(newHighlightState);
    localStorage.setItem('isHighlightActive', JSON.stringify(newHighlightState)); // Store highlight state

      // Clear filters when toggling highlight
        setFilterOption({brand: '', model: ''});
        setSearchQuery('');
        setSortOption('');

  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
      <div className="container">
          <h1>Browse Cars</h1>

          {/* Clear Filters */}
          <button
              onClick={() => {
                  setFilterOption({brand: '', model: ''});
                  setSearchQuery('');
                  setSortOption('');
                  setFilteredCars(cars); // Reset the filtered cars to the full list
              }}
              className="button"
          >
              Clear Filters
          </button>

          {/* Highlight */}
          <button onClick={handleHighlightToggle} className="button">
              {isHighlightActive ? 'Show All Cars' : 'Highlighted Cars'}
          </button>

          {/* Search */}
          <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input"
          />

          {/* Sort */}
          <select onChange={e => setSortOption(e.target.value)} value={sortOption} className="input">
              <option value="">Sort By</option>
              <option value="name-asc">Name Ascending</option>
              <option value="name-desc">Name Descending</option>
              <option value="price-asc">Price Ascending</option>
              <option value="price-desc">Price Descending</option>
          </select>

          {/* Filter by Brand */}
          <select
              onChange={e => setFilterOption({...filterOption, brand: e.target.value, model: ''})}
              value={filterOption.brand}
              className="input"
          >
              <option value="">Filter by Brand</option>
              {[...new Set(cars.map(car => car.NameMMT.split(' ')[0]))]
                  .sort((a, b) => a.localeCompare(b)) // Sort brands A-Z
                  .map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                  ))}
          </select>

          {/* Filter by Model */}
          <select
              onChange={e => setFilterOption({...filterOption, model: e.target.value})}
              value={filterOption.model}
              className="input"
              disabled={!filterOption.brand}
          >
              <option value="">Filter by Model</option>
              {modelOptions
                  .sort((a, b) => a.localeCompare(b)) // Sort models A-Z
                  .map(model => (
                      <option key={model} value={model}>{model}</option>
                  ))}
          </select>

          {/* Car Catalog */}
          <div className="catalog">
              {filteredCars.map(car => (
                  <Link to={`/car/${car.Cid}`} key={car.Cid} className="carCardLink">
                      <div className="carCard">
                          <div style={{position: 'relative'}} className="carImageContainer">
                              <img src={car.Img600} alt={car.NameMMT} className="carImage"/>
                              <button
                                  onClick={(e) => {
                                      e.preventDefault(); // Prevent the link from being followed when clicking the favorite button
                                      handleFavoriteToggle(car.Cid);
                                  }}
                                  className="favoriteButton"
                              >
                                  <i className={favorites.includes(car.Cid) ? 'bi bi-star-fill' : 'bi bi-star'}></i>
                              </button>
                          </div>
                          <div className="carCardText">
                              <div>{car.NameMMT}</div>
                              <div>{parseInt(car.Prc.replace(/,/g, ''), 10).toLocaleString('en-US')} Baht</div>
                          </div>
                      </div>
                  </Link>
              ))}
          </div>
        </div>
          );
          };

          export default BrowseCarsPage;
