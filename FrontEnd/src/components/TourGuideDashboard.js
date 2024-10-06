import React, { useState } from 'react';
import { createItinerary } from '../APIs/tourguideApi';
import '../styling/TourGuideDashboard.css';

const TourGuideDashboard = () => {
    const [newItinerary, setNewItinerary] = useState({
        title: '',
        activities: '',
        locations: '',
        timeline: '',
        duration: '',
        language: '',
        price: '',
        availableDates: '',
        accessibility: false,
        pickupLocation: '',
        dropoffLocation: '',
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewItinerary((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCreateItinerary = async (e) => {
        e.preventDefault();
        try {
            const itineraryData = {
                tourGuideId: '66fc472ab494061ba3a410f4', // Hardcoded tour guide ID
                ...newItinerary,
                locations: newItinerary.locations.split('-'), // Use dash `-` as the separator for locations
                availableDates: newItinerary.availableDates.split(','), // Keeping dates split by comma
            };
            const response = await createItinerary(itineraryData);
            alert('Itinerary created successfully!');
            setNewItinerary({
                title: '',
                activities: '',
                locations: '',
                timeline: '',
                duration: '',
                language: '',
                price: '',
                availableDates: '',
                accessibility: false,
                pickupLocation: '',
                dropoffLocation: '',
            });
        } catch (error) {
            alert('Error creating itinerary');
            console.error('Error creating itinerary:', error);
        }
    };

    return (
        <div className="tour-guide-dashboard">
            <h1>Tour Guide Dashboard</h1>
            <h2>Create New Itinerary</h2>
            <form onSubmit={handleCreateItinerary}>
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={newItinerary.title}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Activities:
                    <input
                        type="text"
                        name="activities"
                        value={newItinerary.activities}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Locations:
                    <input
                        type="text"
                        name="locations"
                        value={newItinerary.locations}
                        onChange={handleInputChange}
                        placeholder="Enter multiple locations separated by a dash (-)"
                        required
                    />
                </label>
                <label>
                    Timeline:
                    <input
                        type="text"
                        name="timeline"
                        value={newItinerary.timeline}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Duration:
                    <input
                        type="text"
                        name="duration"
                        value={newItinerary.duration}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Language:
                    <input
                        type="text"
                        name="language"
                        value={newItinerary.language}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Price:
                    <input
                        type="number"
                        name="price"
                        value={newItinerary.price}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Available Dates:
                    <input
                        type="text"
                        name="availableDates"
                        value={newItinerary.availableDates}
                        onChange={handleInputChange}
                        placeholder="Enter multiple dates separated by a comma"
                        required
                    />
                </label>
                <label>
                    Accessibility:
                    <input
                        type="checkbox"
                        name="accessibility"
                        checked={newItinerary.accessibility}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Pickup Location:
                    <input
                        type="text"
                        name="pickupLocation"
                        value={newItinerary.pickupLocation}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Dropoff Location:
                    <input
                        type="text"
                        name="dropoffLocation"
                        value={newItinerary.dropoffLocation}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <button type="submit">Create Itinerary</button>
            </form>
        </div>
    );
};

export default TourGuideDashboard;