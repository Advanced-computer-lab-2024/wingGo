// itineraryApi.ts

import axios from 'axios';
import { Itinerary } from '../interFace/interFace';

export const fetchAllItineraries = async (): Promise<Itinerary[]> => {
    try {
        const response = await axios.get('http://localhost:8000/tourist/viewItineraries?touristId=67240ed8c40a7f3005a1d01d');
        return response.data.itineraries;
    } catch (error) {
        console.error("Error fetching itineraries:", error);
        throw error;
    }
};

// Admin-specific fetch
export const fetchAdminItineraries = async (): Promise<Itinerary[]> => {
    try {
        const response = await axios.get('http://localhost:8000/admin/getALLitineraries');  // Adjust URL if necessary
        return response.data;  // Return full itineraries list for admin
    } catch (error) {
        console.error("Error fetching itineraries for admin:", error);
        throw error;
    }
};

export const fetchFilteredItineraries = async (filters: {
    budget?: number;
    date?: string;
    preferences?: string;
    language?: string;
    touristId?: string;
}): Promise<Itinerary[]> => {
    try {
        const response = await axios.get(`http://localhost:8000/tourist/filterItineraries`, { params: filters });
        return response.data;
    } catch (error) {
        console.error("Error fetching filtered itineraries:", error);
        throw error;
    }
};

export const searchItineraries = async (query: string): Promise<Itinerary[]> => {
    try {
        const response = await axios.get(`http://localhost:8000/tourist/search`, {
            params: { query },
        });
        return response.data.itineraries; // Only return itineraries from the response
    } catch (error) {
        console.error("Error searching itineraries:", error);
        throw error;
    }
};


// Function to flag/unflag an itinerary for admin
export const toggleFlagItinerary = async (id: string, flagStatus: boolean): Promise<void> => {
    try {
        await axios.put(`http://localhost:8000/admin/flagItinerary/${id}`, { flagged: flagStatus });
    } catch (error) {
        console.error("Error flagging/unflagging itinerary:", error);
        throw error;
    }
};


