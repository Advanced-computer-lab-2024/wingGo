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