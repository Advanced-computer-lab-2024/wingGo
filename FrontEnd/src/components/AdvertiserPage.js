import React, { useEffect, useState,useRef } from 'react';
import { updateAdvertiserProfile,getAdvertiserProfile, createAdvertiserProfile,getAllActivities,createActivity,
    getActivityById,updateActivity,deleteActivity} from '../APIs/advertiserApi'; // Ensure this API call is correct
import '../styling/AdvertiserPage.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
/////////map
import L from 'leaflet';  // Import Leaflet
import 'leaflet/dist/leaflet.css';  // Import Leaflet CSS
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
////////////////////

/////map
// Initial coordinates for Cairo, Egypt
const initialLatLng = { lat: 30.033333, lng: 31.233334 };
////////////
const AdvertiserPage = () => {

    const advertiserId = "66fb37dda63c04def29f944e";

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
     // To toggle the edit form
    const [newProfile, setNewProfile] = useState({
        companyName: '',
        website: '',
        hotline: '',
        companyProfile: '',
        contactEmail: '',
        contactPerson: '',
        logoUrl: '',
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
    });
  
    const handleChange = (e) => {
        setNewProfile({
            ...newProfile,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateProfile = async (e) => {
        e.preventDefault();
        try {
            await createAdvertiserProfile(advertiserId, {
                companyName: newProfile.companyName,
                website: newProfile.website,
                hotline: newProfile.hotline,
                companyProfile: newProfile.companyProfile,
                contactEmail: newProfile.contactEmail,
                contactPerson: newProfile.contactPerson,
                logoUrl: newProfile.logoUrl,
                socialMediaLinks: {
                    facebook: newProfile.facebook,
                    twitter: newProfile.twitter,
                    instagram: newProfile.instagram,
                    linkedin: newProfile.linkedin
                }
            });
            setShowForm(false); // Hide the form after submission
        } catch (error) {
            alert(error);
            setShowForm(false); 
        }
    };

    const handleViewProfile = async (e) => {
        e.preventDefault();
        try {
            const data = await getAdvertiserProfile(advertiserId); // Fetch the profile using the input ID
            setProfile(data); // Save profile data
            setError(null); // Clear any previous error
        } catch (err) {
            setError('Profile not found'); // Handle error if profile not found
            setProfile(null); // Clear previous profile data
        }
    };

   const handleEditProfile = async (updatedProfile) => {
        try {
            await updateAdvertiserProfile(advertiserId, updatedProfile);
            setProfile(updatedProfile);
            setShowEditForm(false); 
        } catch (error) {
            console.error('Failed to edit profile:', error.response ? error.response.data : error.message);
            alert('Failed to edit profile. Please try again.');
        }
    };


    const handleEditProfileClick = async () => {
        try {
            const data = await getAdvertiserProfile(advertiserId); 
             setProfile(data); 
            setNewProfile(data); // Populate the form with the fetched profile data
            setShowEditForm(true); // Show the edit form after fetching the profile
        } catch (error) {
            setError('Failed to fetch profile for editing');
        }
    };

    return (
        <div className="advertiser-page">
            {/* Create Profile Button */}
            <button onClick={() => setShowForm(true)}>
                Create New Profile
            </button>

            {showForm && ( // Conditional rendering of the form
                <form onSubmit={handleCreateProfile}>
                    <h2>Create Profile</h2>
                    <label>
                        Company Name:
                        <input type="text" name="companyName" value={newProfile.companyName} onChange={handleChange} required />
                    </label>
                    <label>
                        Website:
                        <input type="url" name="website" value={newProfile.website} onChange={handleChange} required />
                    </label>
                    <label>
                        Hotline:
                        <input type="text" name="hotline" value={newProfile.hotline} onChange={handleChange} required />
                    </label>
                    <label>
                        Company Profile:
                        <textarea name="companyProfile" value={newProfile.companyProfile} onChange={handleChange} required />
                    </label>
                    <label>
                        Contact Email:
                        <input type="email" name="contactEmail" value={newProfile.contactEmail} onChange={handleChange} required />
                    </label>
                    <label>
                        Contact Person:
                        <input type="text" name="contactPerson" value={newProfile.contactPerson} onChange={handleChange} required />
                    </label>
                    <label>
                        Logo URL:
                        <input type="text" name="logoUrl" value={newProfile.logoUrl} onChange={handleChange} />
                    </label>
                    <h3>Social Media Links</h3>
                    <label>
                        Facebook:
                        <input type="url" name="facebook" value={newProfile.facebook} onChange={handleChange} />
                    </label>
                    <label>
                        Twitter:
                        <input type="url" name="twitter" value={newProfile.twitter} onChange={handleChange} />
                    </label>
                    <label>
                        Instagram:
                        <input type="url" name="instagram" value={newProfile.instagram} onChange={handleChange} />
                    </label>
                    <label>
                        LinkedIn:
                        <input type="url" name="linkedin" value={newProfile.linkedin} onChange={handleChange} />
                    </label>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
            )}

            <button onClick={handleViewProfile}>Get Profile</button>

            {/* Display profile or error message */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {profile && (
    <div className="profile-details">
        <h2>Profile Details</h2>
        <p>Company Name: {profile.companyName}</p>
        <p>Website: {profile.website}</p>
        <p>Hotline: {profile.hotline}</p>
        <p>Company Profile: {profile.companyProfile}</p>
        <p>Contact Email: {profile.contactEmail}</p>
        <p>Contact Person: {profile.contactPerson}</p>
        <p>Logo URL: {profile.logoUrl}</p>
        <h3>Social Media Links</h3>
        {/* Check if socialMediaLinks exists before rendering its properties */}
        {profile.socialMediaLinks ? (
            <>
                <p>Facebook: {profile.socialMediaLinks.facebook}</p>
                <p>Twitter: {profile.socialMediaLinks.twitter}</p>
                <p>Instagram: {profile.socialMediaLinks.instagram}</p>
                <p>LinkedIn: {profile.socialMediaLinks.linkedin}</p>
            </>
        ) : (
            <p>No social media links available</p>
        )}
    </div>
)}
            {/* Edit Profile Button */}
            <button onClick={handleEditProfileClick}>Edit Profile</button>

                    {showEditForm && (
                        <EditProfile
                            product={profile}
                            onClose={() => setShowEditForm(false)}
                            onSave={handleEditProfile}
                        />
                    )}

                    <ActivityDashboard/>
        </div>
    );
};



const EditProfile = ({ product, onClose, onSave }) => {
    const [companyName, setCompanyName] = useState(product.companyName || "");
    const [website, setWebsite] = useState(product.website || "");
    const [hotline, setHotline] = useState(product.hotline || "");
    const [companyProfile, setCompanyProfile] = useState(product.companyProfile || "");
    const [contactEmail, setContactEmail] = useState(product.contactEmail || "");
    const [contactPerson, setContactPerson] = useState(product.contactPerson || "");
    const [logoUrl, setLogoUrl] = useState(product.logoUrl || "");

    // Social Media Links State
    const [facebook, setFacebook] = useState(product.socialMediaLinks?.facebook || "");
    const [twitter, setTwitter] = useState(product.socialMediaLinks?.twitter || "");
    const [instagram, setInstagram] = useState(product.socialMediaLinks?.instagram || "");
    const [linkedin, setLinkedin] = useState(product.socialMediaLinks?.linkedin || "");

    // New fields: Email, Username, and Password
    const [email, setEmail] = useState(product.email || "");
    const [username, setUsername] = useState(product.username || "");
    const [password, setPassword] = useState(""); // We generally do not display passwords in edit forms

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const updatedProfile = {
            // If the new value is not provided, retain the old value (product field).
            email: email || product.email,
            username: username || product.username,
            password: password || product.password, // Leave the password field as is if not updated
            companyName: companyName || product.companyName,
            website: website || product.website,
            hotline: hotline || product.hotline,
            companyProfile: companyProfile || product.companyProfile,
            contactEmail: contactEmail || product.contactEmail,
            contactPerson: contactPerson || product.contactPerson,
            logoUrl: logoUrl || product.logoUrl,
            socialMediaLinks: {
                facebook: facebook || product.socialMediaLinks?.facebook,
                twitter: twitter || product.socialMediaLinks?.twitter,
                instagram: instagram || product.socialMediaLinks?.instagram,
                linkedin: linkedin || product.socialMediaLinks?.linkedin,
            }
        };
    
        onSave(updatedProfile);
    };

    return (
        <div className="edit-profile">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
            
                  <label>
                    Email:
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        
                    />
                </label> 
                
                {/* Username */}
                 <label>
                    Username:
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        
                    />
                </label> 
                
                {/* Password */}
                <label>
                    Password:
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Leave blank to keep current password"
                    />
                </label> 

                {/* Existing Fields */}
                <label>
                    Company Name:
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </label>
                <label>
                    Website:
                    <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </label>
                <label>
                    Hotline:
                    <input type="text" value={hotline} onChange={(e) => setHotline(e.target.value)} />
                </label>
                <label>
                    Company Profile:
                    <textarea value={companyProfile} onChange={(e) => setCompanyProfile(e.target.value)} />
                </label>
                <label>
                    Contact Email:
                    <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                </label>
                <label>
                    Contact Person:
                    <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
                </label>
                <label>
                    Logo URL:
                    <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
                </label>
                
                {/* Social Media Links */}
                <label>
                    Facebook:
                    <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
                </label>
                <label>
                    Twitter:
                    <input type="text" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
                </label>
                <label>
                    Instagram:
                    <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                </label>
                <label>
                    LinkedIn:
                    <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                </label>

                <button type="submit">Save</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};


const ActivityDashboard = () => {
  const advertiserId ="66fb37dda63c04def29f944e"; 
  const [newActivity, setNewActivity] = useState({
    name: '',
    date: '',
    time: '',
    location: {
      type: 'Point',
      address: '',
      lat: 30.033333,
      lng: 31.233334

    },
    price: 0,
    category: '',
    tags: [],
    specialDiscounts: '',
    bookingOpen: true,
    advertiser: advertiserId,
    ratings: 0
  });

  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [searchActivityId, setSearchActivityId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [activityId, setActivityId] = useState('');
/////////////////map////////////////

const [map, setMap] = useState(null); // Initialize map state
const [marker, setMarker] = useState(null); // Initialize marker state
const mapRef = useRef(null); // Reference for map div
 // Reverse geocoding to convert lat/lng into a human-readable address
 const reverseGeocode = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.address) {
        return data.display_name || "Unknown location";
      } else {
        return "Unknown location";
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return "Unknown location";
    }
  };

///////////////////////////////////////////////////

  useEffect(() => {
    ////////////////////////map
 
    const leafletMap = L.map(mapRef.current).setView([newActivity.location.lat, newActivity.location.lng], 8);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(leafletMap);

    // Set marker icon explicitly
    const icon = L.icon({
        iconUrl: markerIconPng,
        shadowUrl: markerShadowPng,
    });
    const initialMarker = L.marker([newActivity.location.lat, newActivity.location.lng], { 
        icon, 
        draggable: true 
      }).addTo(leafletMap);
  
      // Update coordinates when marker is dragged
      initialMarker.on('dragend', async (event) => {
        const markerPosition = event.target.getLatLng();
        const updatedAddress = await reverseGeocode(markerPosition.lat, markerPosition.lng);
        setNewActivity((prevState) => ({
          ...prevState,
          location: {
            ...prevState.location,
            lat: markerPosition.lat,
            lng: markerPosition.lng,
            address: updatedAddress
          }
        }));
      });
  

    setMarker(initialMarker);
    setMap(leafletMap);
 return () => {
      leafletMap.remove();
    

    ////////////////////////////

    const fetchActivities = async () => {
      const activitiesData = await getAllActivities(advertiserId);
      setActivities(activitiesData.activities);
    };
    fetchActivities();
}}, []);

//////////////////////map

 // Function to handle location changes based on user input
 const handleLocationChange = (e) => {
    const { value } = e.target;
    setNewActivity((prev) => ({
        ...prev,
        location: { ...prev.location, address: value }
    }));
};

// Function to update the map and marker
const updateMapLocation = (lat, lng) => {
    map.setView([lat, lng], 13); // Re-center the map on the new location
    marker.setLatLng([lat, lng]); // Update the marker position
};

// Function to simulate geocoding (you can replace this with a geocoding service like Nominatim)
const handleGeocode = async () => {
    const address = newActivity.location.address;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];  // Get the lat/lon from the first result

        // Update the map and marker position
        map.setView([lat, lon], 13);
        marker.setLatLng([lat, lon]);

        // Update the activity's lat/lng in the state
        setNewActivity((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            lat: parseFloat(lat),
            lng: parseFloat(lon)
          }
        }));
      } else {
        alert('No results found for the given address.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Failed to geocode address.');
    }
  };



//////////////////////////////


  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      const response = await createActivity(newActivity);
      setNewActivity({
        name: '',
        date: '',
        time: '',
        location: { type: 'Point', address: '', lat: 0, lng: 0 },
        price: 0,
        category: '',
        tags: [],
        specialDiscounts: '',
        bookingOpen: true,
        advertiser: advertiserId,
        ratings: 0
      });

      const updatedActivities = await getAllActivities(advertiserId);
      setActivities(updatedActivities.activities);
      alert(response.message || "Activity added successfully");

    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Failed to add activity.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [outerKey, innerKey] = name.split('.');
      setNewActivity(prevState => ({
        ...prevState,
        [outerKey]: {
          ...prevState[outerKey],
          [innerKey]: value
        }
      }));
    } else {
      setNewActivity(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSearchById = async (e) => {
    e.preventDefault();
    try {
        const activity = await getActivityById(searchActivityId, advertiserId);
        console.log(activity); // This will log the fetched activity
        setSearchResult(activity.activity); // Access the 'activity' property directly
    } catch (error) {
        console.error('Failed to fetch activity:', error);
        alert('Failed to fetch activity.');
    }
};

  const handleEditActivity = async (updatedActivity) => {
    const { activityId, ...activityData } = updatedActivity;
    try {
      const response = await updateActivity(activityId, activityData, advertiserId);
      setSelectedActivity(null); // Clear the selected activity
      setActivities(prevActivities => 
        prevActivities.map(activity => 
          activity._id === activityId ? response.activity : activity // Update the specific activity
        )
      );
      alert(response.message || "Activity updated successfully");
    } catch (error) {
      alert('Failed to update activity: ' + error.message);
    }
  };

  const handleDeleteActivity = async (e, id) => {
    e.preventDefault();
    try {
        await deleteActivity(id, advertiserId);
        alert("Activity deleted successfully");
        setActivityId('');
        const updatedActivities = await getAllActivities(advertiserId); // Optionally refresh the activities list
        setActivities(updatedActivities.activities);
    } catch (error) {
        console.error('Failed to delete activity:', error);
        alert('Failed to delete activity: ' + error.message);
    }
};

  return (
    <div className="activity-dashboard">
      <h1>Activity Dashboard</h1>

      <h2>Add New Activity</h2>
      <form onSubmit={handleAddActivity}>
      <label>
          Name:
          <input type="text" name="name" value={newActivity.name} onChange={handleInputChange} required />
        </label>
        <label>
          Date:
          <input type="date" name="date" value={newActivity.date} onChange={handleInputChange} required />
        </label>
        <label>
          Time:
          <input type="text" name="time" value={newActivity.time} onChange={handleInputChange} required />
        </label>
        <label>
          Location Address:
          <input type="text" name="location.address" value={newActivity.location.address} onChange={handleLocationChange} />
          <button type="button" onClick={handleGeocode}>Show on Map</button>
        </label>

        <div ref={mapRef} style={{ width: '100%', height: '300px', marginTop: '20px' }}></div>


        <label>
          Price:
          <input type="number" name="price" value={newActivity.price} onChange={handleInputChange} required />
        </label>
        <label>
          Category:
          <input type="text" name="category" value={newActivity.category} onChange={handleInputChange} required />
        </label>
        <label>
          Special Discounts:
          <input type="text" name="specialDiscounts" value={newActivity.specialDiscounts} onChange={handleInputChange} />
        </label>
        <label>
          Booking Open:
          <input type="checkbox" name="bookingOpen" checked={newActivity.bookingOpen} onChange={(e) => setNewActivity(prevState => ({ ...prevState, bookingOpen: e.target.checked }))} />
        </label>
        <label>
          Advertiser ID:
          <input type="text" name="advertiser" value={newActivity.advertiser} onChange={handleInputChange} required />
        </label>
        <label>
          Ratings:
          <input type="number" name="ratings" value={newActivity.ratings} min="0" max="5" onChange={handleInputChange} />
        </label>
        <button type="submit">Add Activity</button>
      </form>

      <h2>List of All Activities</h2>
      <ul>
        {activities.map(activity => (
          <li key={activity._id}>
            <h3>{activity.category}</h3>
            <p>Location: {activity.location?.address || 'No address available'}</p>
            <p>Name: {activity.name}</p>
            <p>Date: {new Date(activity.date).toLocaleDateString()} Time: {activity.time}</p>
            <p>Price: ${activity.price}</p>
            <p>Special Discounts: {activity.specialDiscounts}</p>
            <p>Booking Open: {activity.bookingOpen ? 'Yes' : 'No'}</p>
            <p>Ratings: {activity.ratings} stars</p>
            <button onClick={() => setSelectedActivity(activity)}>Edit</button>
            <button onClick={(e) => handleDeleteActivity(e, activity._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {selectedActivity && (
        <EditActivity
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onSave={handleEditActivity}
        />
      )}

      <h2>Search Activity by ID</h2>
      <form onSubmit={handleSearchById}>
        <input
          type="text"
          placeholder="Enter Activity ID"
          value={searchActivityId}
          onChange={(e) => setSearchActivityId(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {searchResult && (
    <div>
        <h3>Search Result:</h3>
        <p>Category: {searchResult.category || 'No category available'}</p>
        <p>Name: {searchResult.name || 'No name available'}</p>
        <p>Date: {searchResult.date ? new Date(searchResult.date).toLocaleDateString() : 'Invalid Date'}</p>
        <p>Time: {searchResult.time || 'No time available'}</p>
        <p>Location: {searchResult.location?.address || 'No address available'}</p>
        <p>Price: ${searchResult.price || 'Not available'}</p>
        <p>Ratings: {searchResult.ratings || 'No ratings available'} stars</p>
    </div>
)}

     
    </div>
  );
};
const EditActivity = ({ activity, onClose, onSave }) => {
  const [category, setCategory] = useState(activity.category);
  const [name, setName] = useState(activity.name);
  const [date, setDate] = useState(activity.date);
  const [time, setTime] = useState(activity.time);
  const [location, setLocation] = useState(activity.location?.address || '');
  const [price, setPrice] = useState(activity.price);
  const[tags,setTags]=useState(activity.tags);
  const [discount,setDiscount]=useState(activity.discount);
  const [bookingOpen,setBookingOpen]=useState(activity.bookingOpen);
  const [ratings,setRatings]=useState(activity.ratings);


  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedActivity = {
      activityId: activity._id,
      category,
      name,
      date,
      time,
      location: {
        type: 'Point',
        address: location, // Assuming this is the input address
    },
      price,
      tags,
      discount,
      bookingOpen,
      ratings


    };
    onSave(updatedActivity);
  };

  return (
    <div className="edit-activity">
    <h2>Edit Activity</h2>
    <form onSubmit={handleSubmit}>
      <label>Category:</label>
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />

      <label>Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      
      <label>Date:</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      
      <label>Time:</label>
      <input type="text" value={time} onChange={(e) => setTime(e.target.value)} />
      
      <label>Location Address:</label>
      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
      
      <label>Price:</label>
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      
      <label>Tags:</label>
      <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
      
      <label>Discount:</label>
      <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
      
      <label>Booking Open:</label>
      <input type="checkbox" checked={bookingOpen} onChange={(e) => setBookingOpen(e.target.checked)} />
      
      <label>Ratings:</label>
      <input type="number" value={ratings} onChange={(e) => setRatings(e.target.value)} min="0" max="5" />
      
      <button type="submit">Save Changes</button>
    </form>
    <button onClick={onClose}>Close</button>
  </div>
  
  );
};
  
  

export default AdvertiserPage;