import axios from 'axios';

const API_URL = 'http://localhost:8000';

// tour guide
export const createItinerary = async (itineraryData) => {
    try {
        console.log(itineraryData);
        const response = await fetch(`${API_URL}/tourguide/Createitinerary`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itineraryData),
        });
        if (!response.ok) {
            throw new Error('Failed to create itinerary');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating itinerary:', error);
        throw error;
    }
};

export const getItinerariesByTourGuide = async (tourGuideId) => {
    try {
        // Send a GET request to the backend to fetch itineraries by tourGuideId
        const response = await axios.get(`${API_URL}/tourguide/itineraries/${tourGuideId}`);
        return response.data;  // Return the fetched itineraries
    } catch (error) {
        console.error('Error fetching itineraries:', error);
        throw error;  // Rethrow the error for error handling in the frontend
    }
};
// Update itinerary by ID and tourGuideId
export const updateItinerary = async (id, tourGuideId, updatedData) => {
    try {
        const response = await fetch(`http://localhost:8000/tourguide/updateitinerary/${id}?tourGuideId=${tourGuideId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('Failed to update itinerary');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating itinerary:', error);
        throw error;
    }
};
export const deleteItinerary = async (id, tourGuideId) => {
    try {
        const response = await fetch(`http://localhost:8000/tourguide/Deleteitinerary/${id}?tourGuideId=${tourGuideId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete itinerary');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting itinerary:', error);
        throw error;
    }
};
export const createTourGuideProfile = async (profileId,profileData) => {
    try {
        const response = await fetch(`${API_URL}/tourguide/createTourguideProfile/${profileId}`, {
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
