// it-data.ts

import { fetchAllItineraries, fetchFilteredItineraries, searchItineraries, fetchAdminItineraries } from '@/api/itineraryApi';
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

// Admin-specific data fetch
export const getAdminItinerariesData = async (): Promise<Itinerary[]> => {
    try {
        const itineraries = await fetchAdminItineraries();
        return itineraries;
    } catch (error) {
        console.error("Error loading admin itineraries:", error);
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

// Add function to handle search itineraries
export const getSearchItinerariesData = async (query: string): Promise<Itinerary[]> => {
    try {
        const itineraries = await searchItineraries(query);
        return itineraries;
    } catch (error) {
        console.error("Error searching itineraries:", error);
        return [];
    }
};