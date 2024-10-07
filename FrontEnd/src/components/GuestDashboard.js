import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/TouristDashboard.css'; // Import the CSS file

const GuestDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="tourist-dashboard">
            <h1>Tourist Dashboard</h1>
            <button onClick={() => navigate('/activities')}>Activities</button>
            <button onClick={() => navigate('/itineraries')}>Itineraries</button>
            <button onClick={() => navigate('/historical-places')}>Historical Places</button>

        </div>
    );
};

export default GuestDashboard;