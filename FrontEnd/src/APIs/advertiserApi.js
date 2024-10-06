import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const updateAdvertiserProfile = async (id, updatedDAta) => {
    try {
        const response = await fetch(`${API_URL}/advertiser/updateProfile/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedDAta),
        });
        if (!response.ok) {
            throw new Error('Failed to edit profile');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export const getAdvertiserProfile = async (profileId) => {
    try {
        const response = await axios.get(`${API_URL}/advertiser/viewProfile/${profileId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};
export const createAdvertiserProfile = async (profileId,profileData) => {
    try {
        const response = await fetch(`${API_URL}/advertiser/createProfile/${profileId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'profile id is invalid');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating profile', error);
        throw error;
    }
};