import React from 'react';
import { useParams } from 'react-router-dom';
import carData from '../assets/taladrod-cars.json';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import './CarDetailPage.css'; // Import custom CSS for this page
import { useNavigate } from 'react-router-dom';

const CarDetailPage = () => {
  const { carId } = useParams();
  const car = carData.Cars.find(c => c.Cid === parseInt(carId));
  const [favorites, setFavorites] = React.useState(JSON.parse(localStorage.getItem('favorites')) || []);
  const navigate = useNavigate(); // Hook for navigation

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

  if (!car) {
    return <div>Car not found</div>;
  }


  
  return (
      <div className="car-detail-container">
        {/*Close Button*/}
        <button className="closeButton" onClick={() =>
            navigate(-1)
        }>
          <i className="bi bi-x"></i>
        </button>


        <div className="car-detail-content">
          <div className="car-image-container">
            <img src={car.Img600} alt={car.NameMMT} className="car-detail-image"/>
            <button
                onClick={() => handleFavoriteToggle(car.Cid)}
                className="favoriteButton top-right"
            >
              <i className={favorites.includes(car.Cid) ? 'bi bi-star-fill' : 'bi bi-star'}></i>
            </button>
          </div>
          <div className="car-detail-info">
            <div className="car-detail-header">
              <h1 className="car-name">{car.NameMMT}</h1>
            </div>
            <div className="car-detail-specs">
              <p><strong>Price:</strong> {parseInt(car.Prc.replace(/,/g, ''), 10).toLocaleString('en-US')} Baht</p>
              <p><strong>Brand:</strong> {car.NameMMT.split(' ')[0]}</p>
              <p><strong>Model:</strong> {car.Model}</p>
              <p><strong>Year:</strong> {car.Yr}</p>
              <p><strong>Province:</strong> {car.Province}</p>
              <p><strong>Last Updated:</strong> {car.Upd} Days Ago</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CarDetailPage;
