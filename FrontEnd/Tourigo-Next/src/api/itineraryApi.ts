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
