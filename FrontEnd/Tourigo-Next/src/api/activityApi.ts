// itineraryApi.ts

import axios from 'axios';
import { Activity } from '../interFace/interFace';
const API_URL = 'http://localhost:8000/tourist';

export const fetchActivities = async (): Promise<Activity[]> => {
    try {
        const response = await axios.get('http://localhost:8000/tourist/viewActivities');
        return response.data;
    } catch (error) {
        console.error("Error fetching activities:", error);
        throw error;
    }
};
