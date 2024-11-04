

import { fetchActivities } from '@/api/activityApi';
import { Activity } from '../interFace/interFace';
const API_URL = 'http://localhost:8000/tourist';

export const getActivitiesData = async (): Promise<Activity[]> => {
    try {
        const activities = await fetchActivities();
        return activities;
    } catch (error) {
        console.error("Error loading activities:", error);
        return [];
    }
};
