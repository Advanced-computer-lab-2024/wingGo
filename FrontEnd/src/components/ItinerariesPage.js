import React, { useState, useEffect } from 'react';
import { getAllUpcomingItineraries, sortUpcomingItineraries, filterItineraries, searchAllModels, sortUpcomingActivityOrItineraries } from '../APIs/touristApi';
import '../styling/ItinerariesPage.css'; // Import the CSS file

const ItinerariesPage = () => {
    const [itineraries, setItineraries] = useState([]);
    const [sort, setSort] = useState('');
    const [filters, setFilters] = useState({
        budget: '',
        date: '',
        preferences: '',
        language: ''
    });
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Fetch all upcoming itineraries
        getAllUpcomingItineraries()
            .then(data => setItineraries(data.itineraries))
            .catch(error => console.error('Error fetching itineraries:', error));
    }, []);

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearch(query);

        if (query.trim() === '') {
            // If search query is empty, fetch all upcoming itineraries
            getAllUpcomingItineraries()
                .then(data => setItineraries(data.itineraries))
                .catch(error => console.error('Error fetching itineraries:', error));
        } else {
            // Otherwise, search for itineraries
            searchAllModels(query)
                .then(data => setItineraries(data.itineraries))
                .catch(error => console.error('Error searching itineraries:', error));
        }
    };

    const applySort = () => {
        sortUpcomingActivityOrItineraries(sort, 'itinerary')
            .then(data => setItineraries(data))
            .catch(error => console.error('Error sorting itineraries:', error));
    };

    const applyFilters = () => {
        filterItineraries(filters)
            .then(data => setItineraries(data))
            .catch(error => console.error('Error filtering itineraries:', error));
    };

    return (
        <div className="itineraries-page">
            <h1>Upcoming Itineraries</h1>
            <div className="filters">
                <h2>Filters</h2>
                <label>
                    Budget:
                    <input type="text" name="budget" value={filters.budget} onChange={handleFilterChange} placeholder="e.g., 100-200" />
                </label>
                <label>
                    Date:
                    <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
                </label>
                <label>
                    Preferences:
                    <input type="text" name="preferences" value={filters.preferences} onChange={handleFilterChange} placeholder="e.g., historic areas, beaches" />
                </label>
                <label>
                    Language:
                    <input type="text" name="language" value={filters.language} onChange={handleFilterChange} placeholder="e.g., English" />
                </label>
                <button onClick={applyFilters}>Apply Filters</button>
            </div>
            <div className="sort">
                <h2>Sort By</h2>
                <select value={sort} onChange={handleSortChange}>
                    <option value="">Select</option>
                    <option value="price">Price</option>
                    <option value="ratings">Ratings</option>
                </select>
                <button onClick={applySort}>Apply Sort</button>
            </div>
            <div className="search">
                <h2>Search</h2>
                <input type="text" value={search} onChange={handleSearchChange} placeholder="Search by name, category, or tag" />
            </div>
            <div className="itinerary-list">
                {itineraries.length > 0 ? (
                    itineraries.map(itinerary => (
                        <div key={itinerary._id} className="itinerary">
                            <h3>{itinerary.name}</h3>
                            <p>Category: {itinerary.category}</p>
                            <p>Price: {itinerary.price}</p>
                            <p>Ratings: {itinerary.ratings}</p>
                            <p>Tags: {itinerary.tags.join(', ')}</p>
                        </div>
                    ))
                ) : (
                    <p>No upcoming itineraries found.</p>
                )}
            </div>
        </div>
    );
};

export default ItinerariesPage;