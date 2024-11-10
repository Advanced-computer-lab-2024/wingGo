

import { fetchActivities,fetchActivitiesAdvertiser,fetchAdminActivities,fetchBookedActivities} from '@/api/activityApi';
import { Activity, BookedActivity } from '../interFace/interFace';
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
export const getActivities_Adv = async (): Promise<Activity[]> => {
    try {
        const activities = await fetchActivitiesAdvertiser();
        return activities;
    } catch (error) {
        console.error("Error loading activities:", error);
        return [];
    }
};

export const getAdminActivitiesData = async (): Promise<Activity[]> => {
    try {
        const activities = await fetchAdminActivities();
        return activities;
    } catch (error) {
        console.error("Error loading admin activities:", error);
        return [];
    }
};
export const getBookedActivitiesData = async (touristId: string): Promise<BookedActivity[]> => {
    try {
        const bookedActivities = await fetchBookedActivities(touristId);
        return bookedActivities;
    } catch (error) {
        console.error("Error loading booked activities:", error);
        return [];
    }
};

