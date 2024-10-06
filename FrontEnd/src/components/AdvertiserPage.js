import React, { useEffect, useState } from 'react';
import { getAdvertiserProfile, createAdvertiserProfile} from '../api'; // Ensure this API call is correct
import '../styling/AdvertiserPage.css';

const AdvertiserPage = () => {
    const advertiserId = "670280d44e96fc474185da5f";
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
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
      // Handle form submission
      const handleCreateProfile = async (e) => {
        e.preventDefault();
        try {
           
            await createAdvertiserProfile(advertiserId,{
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

    // Function to handle profile creation (Placeholder)
   
    return (
        <div className="advertiser-page">
            
            {/* Create Profile Button */}
            <button onClick={() => setShowForm(true)
                
            }>
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

           
        <button onClick={handleViewProfile} >Get Profile</button>
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
                    <p>Logo Linked: {profile.logoUrl}</p>
                    {/* Social Media Links */}
                    <h3>Social Media Links</h3>
                    <p>Facebook: {profile.socialMediaLinks.facebook || 'Not provided'}</p>
                    <p>Twitter: {profile.socialMediaLinks.twitter || 'Not provided'}</p>
                    <p>Instagram: {profile.socialMediaLinks.instagram || 'Not provided'}</p>
                    <p>LinkedIn: {profile.socialMediaLinks.linkedin || 'Not provided'}</p>
                </div>
            )}
        </div>
    );
};

export default AdvertiserPage; 