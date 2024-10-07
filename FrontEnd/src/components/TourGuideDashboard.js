import React, { useState, useEffect } from 'react';
import { getItinerariesByTourGuide, createItinerary, updateItinerary,deleteItinerary  } from '../APIs/tourguideApi';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome for icons
import '../styling/TourGuideDashboard.css';

const TourGuideDashboard = () => {
    const [itineraries, setItineraries] = useState([]); // Storing itineraries
    const [selectedItinerary, setSelectedItinerary] = useState(null); // For detailed itinerary view
    const [isEditing, setIsEditing] = useState({}); // To toggle editing per field
    const [showItineraryForm, setShowItineraryForm] = useState(false); // Toggle for create itinerary form

    // Form state for new itinerary creation
    const [title, setTitle] = useState('');
    const [activities, setActivities] = useState('');
    const [locations, setLocations] = useState('');
    const [timeline, setTimeline] = useState('');
    const [duration, setDuration] = useState('');
    const [language, setLanguage] = useState('');
    const [price, setPrice] = useState('');
    const [availableDates, setAvailableDates] = useState('');
    const [accessibility, setAccessibility] = useState(false);
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');

    const tourGuideId = "66fc472ab494061ba3a410f4"; // Hard-coded tour guide ID for demo

    // Fetch itineraries for the tour guide
    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const fetchedItineraries = await getItinerariesByTourGuide(tourGuideId);
                setItineraries(fetchedItineraries); // Set fetched itineraries
            } catch (error) {
                console.error('Error fetching itineraries:', error);
            }
        };

        fetchItineraries();
    }, []);

    // Handle showing/hiding itinerary form
    const toggleCreateForm = () => {
        setShowItineraryForm(!showItineraryForm);
    };

    // Handle creating a new itinerary
    const handleCreateItinerary = async (e) => {
        e.preventDefault();

        try {
            const itineraryData = {
                tourGuideId,
                title,
                activities,
                locations,
                timeline,
                duration,
                language,
                price,
                availableDates,
                accessibility,
                pickupLocation,
                dropoffLocation,
            };

            await createItinerary(itineraryData);
            alert('Itinerary created successfully!');
            
            // Reset form fields after creation
            setTitle(''); setActivities(''); setLocations(''); setTimeline('');
            setDuration(''); setLanguage(''); setPrice(''); setAvailableDates('');
            setAccessibility(false); setPickupLocation(''); setDropoffLocation('');
            
            toggleCreateForm(); // Hide the form after submission

        } catch (error) {
            console.error('Error creating itinerary:', error);
            alert('Error creating itinerary');
        }
    };

    // Handle clicking to view an itinerary
    const handleItineraryClick = (itinerary) => {
        setSelectedItinerary(itinerary); // Set itinerary to view
        setIsEditing({}); // Reset all edit modes
    };

    // Toggle edit mode for a field
    const toggleEditField = (field) => {
        setIsEditing({ ...isEditing, [field]: !isEditing[field] });
    };

    // Handle field update
    const handleFieldChange = (field, value) => {
        setSelectedItinerary({ ...selectedItinerary, [field]: value });
    };

    // Handle updating the itinerary
    const handleUpdateItinerary = async (field) => {
        try {
            // Update the selected itinerary field in the database
            await updateItinerary(selectedItinerary._id, tourGuideId, { [field]: selectedItinerary[field] });
    
            // Update the local state immediately after the database update
            setItineraries((prevItineraries) =>
                prevItineraries.map((itinerary) =>
                    itinerary._id === selectedItinerary._id
                        ? { ...itinerary, [field]: selectedItinerary[field] }
                        : itinerary
                )
            );
    
            // Turn off editing for the updated field
            setIsEditing({ ...isEditing, [field]: false });
    
            alert('Itinerary updated successfully!');
        } catch (error) {
            console.error('Error updating itinerary:', error);
            alert('Error updating itinerary');
        }
    };
    const handleDeleteItinerary = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this itinerary?');

        if (confirmDelete) {
            try {
                await deleteItinerary(id, tourGuideId);
                // Remove the itinerary from the state
                setItineraries((prevItineraries) => prevItineraries.filter(itinerary => itinerary._id !== id));
                alert('Itinerary deleted successfully!');
            } catch (error) {
                console.error('Error deleting itinerary:', error);
                alert('Failed to delete itinerary');
            }
        }
    };
    return (
        <div className="tourguide-dashboard">
            <h1>My Itineraries</h1>
            <button className="toggle-button" onClick={toggleCreateForm}>
                {showItineraryForm ? 'Close' : 'Create New Itinerary'}
            </button>

            {showItineraryForm && (
                <div className="form-container">
                    <h1>Create New Itinerary</h1>
                    <form onSubmit={handleCreateItinerary}>
                        <label>Title:</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        <label>Activities:</label>
                        <textarea value={activities} onChange={(e) => setActivities(e.target.value)} required></textarea>
                        <label>Locations (separate by "-"):</label>
                        <input type="text" value={locations} onChange={(e) => setLocations(e.target.value.split(","))} required />
                        <label>Timeline:</label>
                        <input type="text" value={timeline} onChange={(e) => setTimeline(e.target.value)} required />
                        <label>Duration:</label>
                        <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                        <label>Language:</label>
                        <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} required />
                        <label>Price:</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        <label>Available Dates:</label>
                        <input type="text" value={availableDates} onChange={(e) => setAvailableDates(e.target.value.split(","))} required />
                        <label>Accessibility:</label>
                        <input type="checkbox" checked={accessibility} onChange={(e) => setAccessibility(e.target.checked)} />
                        <label>Pickup Location:</label>
                        <input type="text" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} required />
                        <label>Dropoff Location:</label>
                        <input type="text" value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} required />
                        <button type="submit">Create Itinerary</button>
                    </form>
                </div>
            )}

            <h2 className="itinerary-list-title">List of Itineraries</h2>
            <div className="itinerary-slider">
                {itineraries && itineraries.length > 0 ? itineraries.map((itinerary) => (
                    <div className="itinerary-card" key={itinerary._id} onClick={() => handleItineraryClick(itinerary)}>
                        <h3>{itinerary.title}</h3>
                         <i className="fas fa-trash delete-icon" onClick={() => handleDeleteItinerary(itinerary._id)}></i>
                    </div>
                )) : <p>No itineraries found.</p>}
            </div>

            {selectedItinerary && (
                <div className="itinerary-form-overlay">
                    <div className="itinerary-form">
                        <h2>{selectedItinerary.title}</h2>

                        {/* Title */}
                        <div className="itinerary-field">
                            <strong>Title:</strong>
                            {isEditing.title ? (
                                <input
                                    type="text"
                                    value={selectedItinerary.title}
                                    onChange={(e) => handleFieldChange('title', e.target.value)}
                                />
                            ) : (
                                <span>{selectedItinerary.title}</span>
                            )}
                            <i className="fas fa-pen edit-icon" onClick={() => toggleEditField('title')}></i>
                            {isEditing.title && <button onClick={() => handleUpdateItinerary('title')}>Save</button>}
                        </div>

                        {/* Activities */}
                        <div className="itinerary-field">
                            <strong>Activities:</strong>
                            {isEditing.activities ? (
                                <textarea
                                    value={selectedItinerary.activities}
                                    onChange={(e) => handleFieldChange('activities', e.target.value)}
                                ></textarea>
                            ) : (
                                <span>{selectedItinerary.activities}</span>
                            )}
                            <i className="fas fa-pen edit-icon" onClick={() => toggleEditField('activities')}></i>
                            {isEditing.activities && <button onClick={() => handleUpdateItinerary('activities')}>Save</button>}
                        </div>

                        {/* Locations */}
                        <div className="itinerary-field">
                            <strong>Locations:</strong>
                            {isEditing.locations ? (
                                <input
                                    type="text"
                                    value={selectedItinerary.locations.join(", ")}
                                    onChange={(e) => handleFieldChange('locations', e.target.value.split(","))}
                                />
                            ) : (
                                <span>{selectedItinerary.locations.join(', ')}</span>
                            )}
                            <i className="fas fa-pen edit-icon" onClick={() => toggleEditField('locations')}></i>
                            {isEditing.locations && <button onClick={() => handleUpdateItinerary('locations')}>Save</button>}
                        </div>

                        {/* Timeline */}
                        <div className="itinerary-field">
                            <strong>Timeline:</strong>
                            {isEditing.timeline ? (
                                <input
                                    type="text"
                                    value={selectedItinerary.timeline}
                                    onChange={(e) => handleFieldChange('timeline', e.target.value)}
                                />
                            ) : (
                                <span>{selectedItinerary.timeline}</span>
                            )}
                            <i className="fas fa-pen edit-icon" onClick={() => toggleEditField('timeline')}></i>
                            {isEditing.timeline && <button onClick={() => handleUpdateItinerary('timeline')}>Save</button>}
                        </div>

                        {/* Duration */}
                        <div className="itinerary-field">
                            <strong>Duration:</strong>
                            {isEditing.duration ? (
                                <input
                                    type="text"
                                    value={selectedItinerary.duration}
                                    onChange={(e) => handleFieldChange('duration', e.target.value)}
                                />
                            ) : (
                                <span>{selectedItinerary.duration}</span>
                            )}
                            <i className="fas fa-pen edit-icon" onClick={() => toggleEditField('duration')}></i>
                            {isEditing.duration && <button onClick={() => handleUpdateItinerary('duration')}>Save</button>}
                        </div>

                        {/* Language */}
                        <div className="itinerary-field">
                            <strong>Language:</strong>
                            {isEditing.language ? (
                                <input
                                    type="text"
                                    value={selectedItinerary.language}
                                    onChange={(e) => handleFieldChange('language', e.target.value)}
                                />
                            ) : (
                                <span>{selectedItinerary.language}</span>
                            )}
                            <i className="fas fa-pen edit-icon" onClick={() => toggleEditField('language')}></i>
                            {isEditing.language && <button onClick={() => handleUpdateItinerary('language')}>Save</button>}
                        </div>

                        {/* Price */}
                        <div className="itinerary-field">
                            <strong>Price:</strong>
                            {isEditing.price ? (
                                <input
                                    type="number"
                                    value={selectedItinerary.price}
                                    onChange={(e) => handleFieldChange('price', e.target.value)}
                                />
                            ) : (
                                <span>${selectedItinerary.price}</span>
                            )}
                            <i className="fas fa-pen edit-icon" onClick={() => toggleEditField('price')}></i>
                            {isEditing.price && <button onClick={() => handleUpdateItinerary('price')}>Save</button>}
                        </div>

                        {/* Available Dates */}
                        <div className="itinerary-field">
                            <strong>Available Dates:</strong>
                            {isEditing.availableDates ? (
                                <input
                                    type="text"
                                    value={selectedItinerary.availableDates.join(", ")}
                                    onChange={(e) => handleFieldChange('availableDates', e.target.value.split(","))}
                                />
                            ) : (
                                <span>{selectedItinerary.availableDates.join(', ')}</span>
                            )}
                            <i className="fas fa-pen edit-icon" onClick={() => toggleEditField('availableDates')}></i>
                            {isEditing.availableDates && <button onClick={() => handleUpdateItinerary('availableDates')}>Save</button>}
                        </div>

                        {/* Accessibility */}
                        <div className="itinerary-field">
                            <strong>Accessibility:</strong>
                            {isEditing.accessibility ? (
                                <input
                                    type="checkbox"
                                    checked={selectedItinerary.accessibility}
                                    onChange={(e) => handleFieldChange('accessibility', e.target.checked)}
                                />
                            ) : (
                                <span>{selectedItinerary.accessibility ? "Yes" : "No"}</span>
                            )}
                            <i className="fas fa-pen edit-icon" onClick={() => toggleEditField('accessibility')}></i>
                            {isEditing.accessibility && <button onClick={() => handleUpdateItinerary('accessibility')}>Save</button>}
                        </div>

                        {/* Pickup Location */}
                        <div className="itinerary-field">
                            <strong>Pickup Location:</strong>
                            {isEditing.pickupLocation ? (
                                <input
                                    type="text"
                                    value={selectedItinerary.pickupLocation}
                                    onChange={(e) => handleFieldChange('pickupLocation', e.target.value)}
                                />
                            ) : (
                                <span>{selectedItinerary.pickupLocation}</span>
                            )}
                            <i className="fas fa-pen edit-icon" onClick={() => toggleEditField('pickupLocation')}></i>
                            {isEditing.pickupLocation && <button onClick={() => handleUpdateItinerary('pickupLocation')}>Save</button>}
                        </div>

                        {/* Dropoff Location */}
                        <div className="itinerary-field">
                            <strong>Dropoff Location:</strong>
                            {isEditing.dropoffLocation ? (
                                <input
                                    type="text"
                                    value={selectedItinerary.dropoffLocation}
                                    onChange={(e) => handleFieldChange('dropoffLocation', e.target.value)}
                                />
                            ) : (
                                <span>{selectedItinerary.dropoffLocation}</span>
                            )}
                            <i className="fas fa-pen edit-icon" onClick={() => toggleEditField('dropoffLocation')}></i>
                            {isEditing.dropoffLocation && <button onClick={() => handleUpdateItinerary('dropoffLocation')}>Save</button>}
                        </div>

                        <button onClick={() => setSelectedItinerary(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TourGuideDashboard;