import React, { useState, useEffect } from 'react';
import { getAllUpcomingPlaces, filterPlacesByTag, searchAllModels } from '../APIs/touristApi';
import '../styling/HistoricalPlacesPage.css'; // Import the CSS file

const HistoricalPlacesPage = () => {
    const [places, setPlaces] = useState([]);
    const [types, setTypes] = useState('');
    const [historicalPeriods, setHistoricalPeriods] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Fetch all upcoming historical places
        getAllUpcomingPlaces()
            .then(data => setPlaces(data))
            .catch(error => console.error('Error fetching historical places:', error));
    }, []);

    const handleTypesChange = (e) => {
        setTypes(e.target.value);
    };

    const handleHistoricalPeriodsChange = (e) => {
        setHistoricalPeriods(e.target.value);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearch(query);

        if (query.trim() === '') {
            // If search query is empty, fetch all upcoming historical places
            getAllUpcomingPlaces()
                .then(data => setPlaces(data))
                .catch(error => console.error('Error fetching historical places:', error));
        } else {
            // Otherwise, search for historical places
            searchAllModels(query)
                .then(data => setPlaces(data.places))
                .catch(error => console.error('Error searching historical places:', error));
        }
    };

    const applyTagFilter = () => {
        const filters = {
            types,
            historicalPeriods
        };
        filterPlacesByTag(filters)
            .then(data => setPlaces(data))
            .catch(error => console.error('Error filtering historical places:', error));
    };

    return (
        <div className="historical-places-page">
            <h1>Upcoming Historical Places</h1>
            <div className="filters">
                <h2>Filter by Tag</h2>
                <input type="text" value={types} onChange={handleTypesChange} placeholder="Enter types" />
                <input type="text" value={historicalPeriods} onChange={handleHistoricalPeriodsChange} placeholder="Enter historical periods" />
                <button onClick={applyTagFilter}>Apply Tag Filter</button>
            </div>
            <div className="search">
                <h2>Search</h2>
                <input type="text" value={search} onChange={handleSearchChange} placeholder="Search by name, category, or tag" />
            </div>
            <div className="place-list">
                {places.length > 0 ? (
                    places.map(place => (
                        <div key={place._id} className="place">
                            <h3>{place.name}</h3>
                            <p>Category: {place.category}</p>
                            <p>Tags: {place.tags.types.join(', ')}, {place.tags.historicalPeriods.join(', ')}</p>
                        </div>
                    ))
                ) : (
                    <p>No upcoming historical places found.</p>
                )}
            </div>
        </div>
    );
};

export default HistoricalPlacesPage;