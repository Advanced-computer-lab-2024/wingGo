import React, { useEffect, useState } from 'react';
import { updateAdvertiserProfile,getAdvertiserProfile, createAdvertiserProfile} from '../APIs/advertiserApi'; // Ensure this API call is correct
import '../styling/AdvertiserPage.css';

const AdvertiserPage = () => {

    const advertiserId = "670280d44e96fc474185da5f";
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false); // To toggle the edit form
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




export default AdvertiserPage;