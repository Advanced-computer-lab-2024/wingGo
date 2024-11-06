// itineraryApi.ts

import axios from 'axios';
import { Activity } from '../interFace/interFace';

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
