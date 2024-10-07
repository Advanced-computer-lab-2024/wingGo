import React, { useState, useEffect } from 'react';
import { getItinerariesByTourGuide, createItinerary, updateItinerary,deleteItinerary,createTourGuideProfile ,getItineraryById ,getTourGuideProfile,updateTourGuideProfile  } from '../APIs/tourguideApi';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome for icons
import '../styling/TourGuideDashboard.css';

const TourGuideDashboard = () => {
    const [itineraries, setItineraries] = useState([]); // Storing itineraries
    const [selectedItinerary, setSelectedItinerary] = useState(null); // For detailed itinerary view
    const [isEditing, setIsEditing] = useState({}); // To toggle editing per field
    const [showItineraryForm, setShowItineraryForm] = useState(false); // Toggle for create itinerary form\
    const [showProfileForm, setShowProfileForm] = useState(false); // Toggle for create profile form
    const [profile, setProfile] = useState(false); // State for storing profile data
    const [itineraryId, setItineraryId] = useState(''); // State to store the entered itinerary ID
    const [itinerary, setItinerary] = useState(null); // State to store fetched itinerary details
    const [error, setError] = useState(null); // State to store any error messag
    const [newProfile, setNewProfile] = useState({
        mobileNumber: '',
        yearsOfExperience: '',
        previousWork: ''
    });
    // Form state for new itinerary creation
    const [title, setTitle] = useState('');
    const [activities, setActivities] = useState('');
    const [locations, setLocations] = useState('');
    const [tags, setTags] = useState('');
    const [timeline, setTimeline] = useState('');
    const [duration, setDuration] = useState('');
    const [language, setLanguage] = useState('');
    const [price, setPrice] = useState('');
    const [availableDates, setAvailableDates] = useState('');
    const [accessibility, setAccessibility] = useState(false);
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');

    const tourGuideId = "66fc472ab494061ba3a410f4"; // Hard-coded tour guide ID for demo
    const handleGetItinerary = async () => {
        try {
            const fetchedItinerary = await getItineraryById(itineraryId, tourGuideId); // Pass tourGuideId here
            setItinerary(fetchedItinerary); // Set the fetched itinerary
            setError(null); // Clear any previous errors
        } catch (err) {
            setError('Itinerary not found or an error occurred');
            setItinerary(null); // Clear itinerary if there's an error
        }
    };

    // Fetch itineraries for the tour guide
    useEffect(() => {
        
        const fetchProfile = async () => {
            try {
                const fetchedProfile = await getTourGuideProfile(tourGuideId);
                setProfile(fetchedProfile); // Save the fetched profile
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
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
    
    const handleProfileChange = (e) => {
        setNewProfile({
            ...newProfile,
            [e.target.name]: e.target.value
        });
    };

    // Function to handle creating a new tour guide profile
    const handleCreateTourGuideProfile = async (e) => {
        e.preventDefault();
        try {
            await createTourGuideProfile(tourGuideId, {
                mobileNumber: newProfile.mobileNumber,
                yearsOfExperience: newProfile.yearsOfExperience,
                previousWork: newProfile.previousWork
            });
            alert('Profile created successfully!');
            // Reset profile form after creation
            setNewProfile({
                mobileNumber: '',
                yearsOfExperience: '',
                previousWork: ''
            });
            setShowProfileForm(false); // Hide form after creation
        } catch (error) {
            console.error('Error creating profile:', error);
            alert('Error creating profile');
        }
    };
    

    // Toggle to show or hide the profile form
    const toggleProfileForm = () => {
        setShowProfileForm(!showProfileForm);
    };

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
                tags,
                timeline,
                duration,
                language,
                price,
                availableDates,
                accessibility,
                pickupLocation,
                dropoffLocation,
            };
    
            // Call the API to create the new itinerary
            const createdItinerary = await createItinerary(itineraryData);
    
            // Update the local state immediately with the new itinerary
            setItineraries((prevItineraries) => [...prevItineraries, createdItinerary]);
    
            alert('Itinerary created successfully!');
            
            // Reset form fields after creation
            setTitle(''); 
            setActivities(''); 
            setLocations(''); 
            setTags('');
            setTimeline('');
            setDuration(''); 
            setLanguage(''); 
            setPrice(''); 
            setAvailableDates('');
            setAccessibility(false); 
            setPickupLocation(''); 
            setDropoffLocation('');
            
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
     // Handle profile field update
     const handleFieldChange2 = (field, value) => {
        setProfile({ ...profile, [field]: value });
    };

    // Handle updating the profile
    const handleUpdateProfile = async (field) => {
        try {
            await updateTourGuideProfile(tourGuideId, { [field]: profile[field] });
            setIsEditing({ ...isEditing, [field]: false }); // Stop editing after saving
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    return (
        <div className="tourguide-dashboard">
             <h1>Tour Guide Profile</h1>

             {profile ? (
                <div className="profile-box">
                    {/* Username */}
                    <div className="profile-field">
                    <h2>
    <i className="fas fa-user" style={{ marginRight: '10px' }}></i>
    {profile.username}
</h2>
                        
                    </div>

                    {/* Email */}
                    <div className="profile-field">
                        <strong>Email:</strong>
                        {isEditing.email ? (
                            <input 
                                type="email" 
                                value={profile.email} 
                                onChange={(e) => handleFieldChange2('email', e.target.value)} 
                            />
                        ) : (
                            <span>{profile.email}</span>
                        )}
                        <i className="fas fa-pen edit-icon" onClick={() => toggleEditField('email')}></i>
                        {isEditing.email && <button onClick={() => handleUpdateProfile('email')}>Save</button>}
                    </div>

                    {/* Mobile Number */}
                    <div className="profile-field">
                        <strong>Mobile Number:</strong>
                        {isEditing.mobileNumber ? (
                            <input 
                                type="text" 
                                value={profile.mobileNumber} 
                                onChange={(e) => handleFieldChange2('mobileNumber', e.target.value)} 
                            />
                        ) : (
                            <span>{profile.mobileNumber}</span>
                        )}
                        <i className="fas fa-pen edit-icon" onClick={() => toggleEditField('mobileNumber')}></i>
                        {isEditing.mobileNumber && <button onClick={() => handleUpdateProfile('mobileNumber')}>Save</button>}
                    </div>

                    {/* Years of Experience */}
                    <div className="profile-field">
                        <strong>Years of Experience:</strong>
                        {isEditing.yearsOfExperience ? (
                            <input 
                                type="number" 
                                value={profile.yearsOfExperience} 
                                onChange={(e) => handleFieldChange2('yearsOfExperience', e.target.value)} 
                            />
                        ) : (
                            <span>{profile.yearsOfExperience}</span>
                        )}
                        <i className="fas fa-pen edit-icon" onClick={() => toggleEditField('yearsOfExperience')}></i>
                        {isEditing.yearsOfExperience && <button onClick={() => handleUpdateProfile('yearsOfExperience')}>Save</button>}
                    </div>

                    {/* Previous Work */}
                    <div className="profile-field">
                        <strong>Previous Work:</strong>
                        {isEditing.previousWork ? (
                            <textarea 
                                value={profile.previousWork} 
                                onChange={(e) => handleFieldChange2('previousWork', e.target.value)} 
                            />
                        ) : (
                            <span>{profile.previousWork}</span>
                        )}
                        <i className="fas fa-pen edit-icon" onClick={() => toggleEditField('previousWork')}></i>
                        {isEditing.previousWork && <button onClick={() => handleUpdateProfile('previousWork')}>Save</button>}
                    </div>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
           {/* Create Profile Button */}
           <button className="toggle-button" onClick={toggleProfileForm}>
                {showProfileForm ? 'Close Profile Form' : 'Create Tour Guide Profile'}
            </button>

            {/* Profile Form */}
            {showProfileForm && (
                <div className="form-container">
                    <h1>Create Tour Guide Profile</h1>
                    <form onSubmit={handleCreateTourGuideProfile}>
                        <label>Mobile Number:</label>
                        <input type="text" name="mobileNumber" value={newProfile.mobileNumber} onChange={handleProfileChange} />
                        <label>Years of Experience:</label>
                        <input type="number" name="yearsOfExperience" value={newProfile.yearsOfExperience} onChange={handleProfileChange} />
                        <label>Previous Work:</label>
                        <textarea name="previousWork" value={newProfile.previousWork} onChange={handleProfileChange}></textarea>
                        <button type="submit">Create Profile</button>
                    </form>
                </div>
            )}
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
                        <label>Tags (separate by "-"):</label>
                        <input type="text" value={tags} onChange={(e) => setTags(e.target.value.split(","))} required />
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


                        <div className="itinerary-field">
                            <strong>Tags:</strong>
                            {isEditing.tags ? (
                                <input
                                    type="text"
                                    value={selectedItinerary.tags.join(", ")}
                                    onChange={(e) => handleFieldChange('tags', e.target.value.split(","))}
                                />
                            ) : (
                                <span>{selectedItinerary.tags.join(', ')}</span>
                            )}
                            <i className="fas fa-pen edit-icon" onClick={() => toggleEditField('tags')}></i>
                            {isEditing.tags && <button onClick={() => handleUpdateItinerary('tags')}>Save</button>}
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
            <h1>Search Itinerary by ID</h1>

{/* Input field for entering itinerary ID */}
<div className="itinerary-search">
    <input
        type="text"
        placeholder="Enter Itinerary ID"
        value={itineraryId}
        onChange={(e) => setItineraryId(e.target.value)}
        className="itinerary-input"
    />
    <button onClick={handleGetItinerary} className="search-button">
        Search
    </button>
</div>

{/* Error message */}
{error && <p className="error-message">{error}</p>}

{/* Display itinerary details if found */}
{itinerary && (
    <div className="itinerary-details">
        <h2>{itinerary.title}</h2>
        <p>
    <strong>Activities:</strong> 
    {Array.isArray(itinerary.activities) ? itinerary.activities.join(', ') : itinerary.activities}
</p>
<p><strong>Locations:</strong> {Array.isArray(itinerary.locations) ? itinerary.locations.join(', ') : itinerary.locations}</p>
<p><strong>Tags:</strong> {Array.isArray(itinerary.tags) ? itinerary.tags.join(', ') : itinerary.tags}</p>
<p><strong>Available Dates:</strong> {Array.isArray(itinerary.availableDates) ? itinerary.availableDates.join(', ') : itinerary.availableDates}</p>
        <p><strong>Timeline:</strong> {itinerary.timeline}</p>
        <p><strong>Duration:</strong> {itinerary.duration}</p>
        <p><strong>Language:</strong> {itinerary.language}</p>
        <p><strong>Price:</strong> {itinerary.price}</p>
        <p><strong>Pickup Location:</strong> {itinerary.pickupLocation}</p>
        <p><strong>Dropoff Location:</strong> {itinerary.dropoffLocation}</p>
    </div>
)}
           
        </div>
    );
};

export default TourGuideDashboard;