// activityApi.ts

import axios from 'axios';
import { Activity ,BookedActivity} from '../interFace/interFace';
const advertiserId ="66fb37dda63c04def29f944e"; 
const touristId = '67240ed8c40a7f3005a1d01d';

export const fetchActivities = async (): Promise<Activity[]> => {
    try {
        const response = await axios.get('http://localhost:8000/tourist/viewActivities');
        return response.data;
    } catch (error) {
        console.error("Error fetching activities:", error);
        throw error;
    }
};

// Function to create a new activity (POST request)
export const createActivity = async (activityData: any): Promise<any> => {
    try {
        const response = await axios.post(`http://localhost:8000/advertiser/activities`, activityData);
        return response.data;
    } catch (error) {
        console.error("Error creating activity:", error);
        throw error;
    }
};
export const fetchActivitiesAdvertiser = async (): Promise<Activity[]> => {
    try {
        const response = await axios.get(`http://localhost:8000/advertiser/activities?advertiserId=${advertiserId}`);
        return response.data.activities;
    } catch (error) {
        console.error("Error fetching activities:", error);
        throw error;
    }
};

// Function to flag/unflag an activity for admin
export const toggleFlagActivity = async (id: string, flagStatus: boolean): Promise<void> => {
    try {
        await axios.put(`http://localhost:8000/admin/flagActivity/${id}`, { flagged: flagStatus });
    } catch (error) {
        console.error("Error flagging/unflagging activity:", error);
        throw error;
    }
};
export const filterUpcomingActivities = async (filters: {  ////done with frontend
    budget?: number;
    date?: string;
    category?: string;
    ratings?: number;
    
}): Promise<any[]> => {
    try {
        const response = await axios.get(`http://localhost:8000/tourist/filterActivities`, { params: filters });
        return response.data;
    } catch (error) {
        console.error("Error fetching filtered activities:", error);
        throw error;
    }
};
export const fetchAdminActivities = async (): Promise<Activity[]> => {
    try {
        const response = await axios.get('http://localhost:8000/admin/getALLactivities');  // Adjust URL if necessary
        return response.data;  // Return full itineraries list for admin
    } catch (error) {
        console.error("Error fetching activities for admin:", error);
        throw error;
    }
};
export const bookActivityApi = async ( activityId: string) => {
    try {
        const response = await axios.post(`http://localhost:8000/tourist/bookActivity/${touristId}/${activityId}`);
        return response.data;
    } catch (error) {
        console.error('Error booking activity:', error);
        throw error;
    }
};
export const fetchBookedActivities = async (touristId: string): Promise<BookedActivity[]> => {
    try {
        const response = await axios.get(`http://localhost:8000/tourist/booked-activities/${touristId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching booked activities:", error);
        throw error;
    }
};
export const cancelActivityApi = async (touristId: string, activityId: string) => {
    try {
        const response = await axios.delete(`http://localhost:8000/tourist/cancelActivity/${touristId}/${activityId}`);
        return response.data;
    } catch (error) {
        console.error("Error canceling activity:", error);
        throw error;
    }
};

export const rateActivityApi = async (touristId : string, activityId : string, rating : Number) => {
    try {
        const response = await axios.post(`http://localhost:8000/tourist/rateActivity/${touristId}/${activityId}`, { rating });
        return response.data;
    } catch (error) {
        console.error('Error rating activity:', error);
        throw error;
    }
};

export const commentOnActivityApi = async (touristId : string, activityId : string, comment : string) => {
    try {
        const response = await axios.post(`http://localhost:8000/tourist/commentOnActivity/${touristId}/${activityId}`, { comment });
        return response.data;
    } catch (error) {
        console.error('Error commenting on activity:', error);
        throw error;
    }
};


// Check if an activity is booked for a specific tourist
export const isActivityBooked = async (activityId: string): Promise<boolean> => {
    try {
        const response = await axios.get(`http://localhost:8000/tourist/booked-status/${touristId}/activity-status/${activityId}`);
        return response.data.isBooked; // Returns true if booked, false otherwise
    } catch (error) {
        console.error("Error checking activity booked status:", error);
        throw error;
    }
};


export const fetchFilteredActivities = async (filters: { filterType: string }): Promise<any[]> => {
    try {
        const response = await axios.get(`http://localhost:8000/tourist/filteractivitiesdate/${touristId}`, {
            params: filters, // Pass filters including filterType
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching filtered activities:", error);
        throw error;
    }
};


