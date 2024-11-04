// it-data.ts

import { fetchAllItineraries } from '@/api/itineraryApi';
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
