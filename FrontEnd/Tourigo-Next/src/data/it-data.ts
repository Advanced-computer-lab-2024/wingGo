// it-data.ts

import { fetchAllItineraries, fetchFilteredItineraries } from '@/api/itineraryApi';
import { Itinerary } from '../interFace/interFace';
const API_URL = 'http://localhost:8000/tourist';

export const getItinerariesData = async (): Promise<Itinerary[]> => {
    try {
        const itineraries = await fetchAllItineraries();
        return itineraries;
    } catch (error) {
        console.error("Error loading itineraries:", error);
        return [];
    }
};


export const getFilteredItinerariesData = async (filters: {
    budget?: number;
    date?: string;
    preferences?: string;
    language?: string;
    touristId?: string;
}): Promise<Itinerary[]> => {
    try {
        const itineraries = await fetchFilteredItineraries(filters);
        return itineraries;
    } catch (error) {
        console.error("Error loading filtered itineraries:", error);
        return [];
    }
};