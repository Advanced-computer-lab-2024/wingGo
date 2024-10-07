import React, { useState, useEffect } from 'react';
import { getTouristProfile, updateTouristProfile } from '../APIs/touristApi';
import '../styling/TouristProfile.css';

const TouristProfile = () => {
    const [touristProfile, setTouristProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleViewProfile = async (id) => {
        setProfileLoading(true);
        setProfileError(null);
        try {
            const profileData = await getTouristProfile(id);
            setTouristProfile(profileData);
        } catch (error) {
            setProfileError(error.message);
        } finally {
            setProfileLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTouristProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setUpdateError(null);
        setUpdateSuccess(null);
        try {
            // Exclude the username from the payload
            const { username, ...updateData } = touristProfile;
            console.log('Updating profile with data:', updateData); // Log the payload
            await updateTouristProfile(touristProfile._id, updateData);
            setUpdateSuccess('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error.response || error.message); // Log the error response
            setUpdateError(error.response?.data?.message || error.message);
        } finally {
            setUpdateLoading(false);
        }
    };

    useEffect(() => {
        const touristId = '670422443b355ca39e9da66d';
        handleViewProfile(touristId);
    }, []);

    return (
        <div className="tourist-profile">
            <h1>Tourist Profile</h1>
            {profileLoading && <p className="loading-message">Loading profile...</p>}
            {profileError && <p className="error-message">{profileError}</p>}
            {touristProfile && (
                <div className="profile-details">
                    <h2>Profile Details</h2>
                    {!isEditing ? (
                        <div>
                            <p>ID: {touristProfile._id}</p>
                            <p>Name: {touristProfile.username}</p>
                            <p>Email: {touristProfile.email}</p>
                            <p>Mobile Number: {touristProfile.mobileNumber}</p>
                            <p>Nationality: {touristProfile.nationality}</p>
                            <p>Date of Birth: {touristProfile.DOB}</p>
                            <p>Wallet: {touristProfile.wallet}</p>
                            <p>Job/Student: {touristProfile.jobOrStudent}</p>
                            <button onClick={() => setIsEditing(true)}>Edit</button>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdateProfile}>
                            <div className="form-group">
                                <label htmlFor="username">Name:</label>
                                <p>{touristProfile.username}</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={touristProfile.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="mobileNumber">Mobile Number:</label>
                                <input
                                    type="text"
                                    id="mobileNumber"
                                    name="mobileNumber"
                                    value={touristProfile.mobileNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="nationality">Nationality:</label>
                                <input
                                    type="text"
                                    id="nationality"
                                    name="nationality"
                                    value={touristProfile.nationality}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="DOB">Date of Birth:</label>
                                <input
                                    type="date"
                                    id="DOB"
                                    name="DOB"
                                    value={touristProfile.DOB}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wallet">Wallet:</label>
                                <p>{touristProfile.wallet}</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="jobOrStudent">Job/Student:</label>
                                <input
                                    type="text"
                                    id="jobOrStudent"
                                    name="jobOrStudent"
                                    value={touristProfile.jobOrStudent}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <button type="submit" disabled={updateLoading}>
                                {updateLoading ? 'Updating...' : 'Save'}
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                            {updateError && <p className="error-message">{updateError}</p>}
                            {updateSuccess && <p className="success-message">{updateSuccess}</p>}
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default TouristProfile;