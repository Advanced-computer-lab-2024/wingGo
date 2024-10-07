import React, { useState, useEffect } from 'react';
import { getAllUpcomingActivities, filterUpcomingActivities, sortUpcomingActivityOrItineraries, searchAllModels } from '../APIs/touristApi';
import '../styling/ActivitiesPage.css'; // Import the CSS file

const ActivitiesPage = () => {
    const [activities, setActivities] = useState([]);
    const [filters, setFilters] = useState({
        budget: '',
        date: '',
        category: '',
        ratings: ''
    });
    const [sort, setSort] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Fetch all upcoming activities
        getAllUpcomingActivities()
            .then(data => setActivities(data))
            .catch(error => console.error('Error fetching activities:', error));
    }, []);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearch(query);

        if (query.trim() === '') {
            // If search query is empty, fetch all upcoming activities
            getAllUpcomingActivities()
                .then(data => setActivities(data))
                .catch(error => console.error('Error fetching activities:', error));
        } else {
            // Otherwise, search for activities
            searchAllModels(query)
                .then(data => setActivities(data.activities))
                .catch(error => console.error('Error searching activities:', error));
        }
    };

    const applyFilters = () => {
        filterUpcomingActivities(filters)
            .then(data => setActivities(data))
            .catch(error => console.error('Error filtering activities:', error));
    };

    const applySort = () => {
        sortUpcomingActivityOrItineraries(sort, 'activity')
            .then(data => setActivities(data))
            .catch(error => console.error('Error sorting activities:', error));
    };

    return (
        <div className="activities-page">
            <h1>Upcoming Activities</h1>
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
        Category:
        <input type="text" name="category" value={filters.category} onChange={handleFilterChange} placeholder="e.g., Tour" />
    </label>
    <label>
        Ratings:
        <input type="number" name="ratings" value={filters.ratings} onChange={handleFilterChange} placeholder="e.g., 4.5" />
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
            <div className="activity-list">
                {activities.length > 0 ? (
                    activities.map(activity => (
                        <div key={activity.id} className="activity">
                            <h3>{activity.name}</h3>
                            <p>{activity.description}</p>
                            <p>Price: {activity.price}</p>
                            <p>Ratings: {activity.ratings}</p>
                            <p>Category: {activity.category}</p>
                            <p>Date: {activity.date}</p>
                        </div>
                    ))
                ) : (
                    <p>No upcoming activities found.</p>
                )}
            </div>
        </div>
    );
};

export default ActivitiesPage;