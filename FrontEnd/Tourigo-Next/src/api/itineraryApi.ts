// itineraryApi.ts

import axios from 'axios';
import { Itinerary, BookedItinerary } from '../interFace/interFace';

const touristId = '67240ed8c40a7f3005a1d01d';
const tourGuideId = '67244655313a2a345110c1e6';  // Hardcoded tour guide ID

export const fetchAllItineraries = async (): Promise<Itinerary[]> => {
    try {
        const response = await axios.get(`http://localhost:8000/tourist/viewItineraries?touristId=${touristId}`);
        return response.data.itineraries;
    } catch (error) {
        console.error("Error fetching itineraries:", error);
        throw error;
    }
};

export const filterItineraries = async (filters: {  ////done with frontend
    budget?: number;
    date?: string;
    preferences?:string;
    language?:string;
    touristId?:string
    
}): Promise<any[]> => {
    try {
        const response = await axios.get(`http://localhost:8000/tourist/filterItineraries`, { params: filters });
        return response.data;
    } catch (error) {
        console.error("Error fetching filtered itineraries:", error);
        throw error;
    }
};

// Check if an itinerary is booked for a specific tourist
export const isItineraryBooked = async ( itineraryId: string): Promise<boolean> => {
    try {
        const response = await axios.get(`http://localhost:8000/tourist/booked-status/${touristId}/booked-status/${itineraryId}`);
        return response.data.isBooked; // Returns true if booked, false otherwise
    } catch (error) {
        console.error("Error checking itinerary booked status:", error);
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

// Tour guide-specific fetch
export const fetchTourGuideItineraries = async (): Promise<Itinerary[]> => {
    try {
        
        const response = await axios.get(`http://localhost:8000/tourguide/itineraries/${tourGuideId}`);
        return response.data;  // Return itineraries for the specific tour guide
    } catch (error) {
        console.error("Error fetching itineraries for tour guide:", error);
        throw error;
    }
};

export const fetchFilteredItineraries = async (filters: {  ////done with frontend
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

export const searchItineraries = async (query: string): Promise<Itinerary[]> => { ////done with frontend
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

// Fetch booked itineraries for a specific tourist
export const fetchBookedItineraries = async (touristId: string): Promise<BookedItinerary[]> => {
    try {
        const response = await axios.get(`http://localhost:8000/tourist/booked-itineraries/${touristId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching booked itineraries:", error);
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

// Function to toggle activation or deactivation of an itinerary
export const toggleItineraryActivation = async (id: string, deactivate: boolean): Promise<void> => {
    try {
        await axios.put(`http://localhost:8000/tourguide/activateOrDeactivateItinerary/${id}`, { deactivate });
    } catch (error) {
        console.error("Error toggling itinerary activation status:", error);
        throw error;
    }
};


//the next 4 will be hardcoded in the folder of it-act-history fi BookingHistory.tsx passed to the ratetabarea

export const rateItineraryApi = async (touristId : string, itineraryId : string, rating : Number) => {
    try {
        const response = await axios.post(`http://localhost:8000/tourist/rateItinerary/${touristId}/${itineraryId}`, { rating });
        return response.data;
    } catch (error) {
        console.error('Error rating itinerary:', error);
        throw error;
    }
};

export const commentOnItineraryApi = async (touristId : string, itineraryId : string, comment : string) => {
    try {
        const response = await axios.post(`http://localhost:8000/tourist/commentItinerary/${touristId}/${itineraryId}`, { comment });
        return response.data;
    } catch (error) {
        console.error('Error commenting on itinerary:', error);
        throw error;
    }
};

// API function to rate a tour guide
export const rateTourGuideApi = async (touristId: string, tourGuideId: string, rating: number) => {
    try {
        const response = await axios.post(`http://localhost:8000/tourist/ratetourguide/${touristId}/${tourGuideId}`, { rating });
        return response.data;
    } catch (error) {
        console.error("Error rating tour guide:", error);
        throw error;
    }
};

// API function to comment on a tour guide
export const commentOnTourGuideApi = async (touristId: string, tourGuideId: string, comment: string) => {
    try {
        const response = await axios.post(`http://localhost:8000/tourist/commenttourguide/${touristId}/${tourGuideId}`, { comment });
        return response.data;
    } catch (error) {
        console.error("Error commenting on tour guide:", error);
        throw error;
    }
};


// Cancel Itinerary function -> touristId will be hardcoded in the folder of it-act-history fi BookingHistory.tsx
export const cancelItineraryApi = async (touristId: string, itineraryId: string) => {
    try {
        const response = await axios.delete(`http://localhost:8000/tourist/cancelItinerary/${touristId}/${itineraryId}`);
        return response.data;
    } catch (error) {
        console.error("Error canceling itinerary:", error);
        throw error;
    }
};

// Function to fetch a tourist's username by their ID
export const fetchTouristUsername = async (touristId: string): Promise<string> => {
    try {
        const response = await axios.get(`http://localhost:8000/tourist/getUsername/${touristId}`);
        return response.data.username; // Extract the username from the response
    } catch (error) {
        console.error("Error fetching tourist username:", error);
        throw error;
    }
};


// Next will be hardcoded in
// Function to book an itinerary for a specific tourist
export const bookItineraryApi = async (touristId: string, itineraryId: string, bookingDate: Date): Promise<void> => {
    try {
        const response = await axios.post(
            `http://localhost:8000/tourist/bookItinerary/${touristId}/${itineraryId}`,
            null,
            { params: { bookingDate: bookingDate.toISOString() } } // Send booking date as a query parameter
        );
        return response.data; // Return the response data if needed
    } catch (error) {
        console.error("Error booking itinerary:", error);
        throw error;
    }
};



// Function to create a new itinerary (POST request)
export const createItinerary = async (itineraryData: any): Promise<any> => {
    try {
        const response = await axios.post("http://localhost:8000/tourguide/Createitinerary", itineraryData);
        return response.data;
    } catch (error) {
        console.error("Error creating itinerary:", error);
        throw error;
    }
};

export const fetchTourGuideRatings = async (tourGuideId: string) => {
    try {
        const response = await axios.get(`http://localhost:8000/tourguide/fetch/${tourGuideId}`);
        return response.data; // Assuming the API returns an object with ratings, averageRating, and comments
    } catch (error) {
        console.error("Error fetching tour guide ratings:", error);
        throw error;
    }
};
