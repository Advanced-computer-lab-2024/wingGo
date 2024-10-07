import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/TouristDashboard.css'; // Import the CSS file

const TouristDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="tourist-dashboard">
            <h1>Tourist Dashboard</h1>
            <button onClick={() => navigate('/activities')}>Activities</button>
            <button onClick={() => navigate('/itineraries')}>Itineraries</button>
            <button onClick={() => navigate('/historical-places')}>Historical Places</button>
            <button onClick={() => navigate('/products')}>Products</button>
        </div>
    );
};

export default TouristDashboard;