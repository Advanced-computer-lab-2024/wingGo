import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const updateAdvertiserProfile = async (id, updatedDAta) => {
    try {
        const response = await fetch(`${API_URL}/advertiser/updateProfile/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedDAta),
        });
        if (!response.ok) {
            throw new Error('Failed to edit profile');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export const getAdvertiserProfile = async (profileId) => {
    try {
        const response = await axios.get(`${API_URL}/advertiser/viewProfile/${profileId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};
export const createAdvertiserProfile = async (profileId,profileData) => {
    try {
        const response = await fetch(`${API_URL}/advertiser/createProfile/${profileId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'profile id is invalid');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating profile', error);
        throw error;
    }
};


export const createActivity = async (activityData) => {
    try {
        const response = await fetch(`${API_URL}/advertiser/activities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(activityData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create new activity');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding new activity:', error);
        throw error;
    }
};

//get all places

export const getAllActivities = async (advertiserId) => {
    try {
        const response = await fetch(`${API_URL}/advertiser/activities?advertiserId=${advertiserId}`);
        // const response = await fetch(`${API_URL}/advertiser/getAllActivities`);
        if (!response.ok) {
            throw new Error('Failed to fetch activities');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching activities:', error);
        throw error;
    }
};

//get place by id


// export const getActivityById = async (activityId,advertiserId) => {
//     try {
//         const response = await fetch(`${API_URL}/advertiser/getActivity/${activityId}?advertiserId=${advertiserId}`);
//         method:'GET',
//         return response.data;  // Return the fetched itineraries
      
//     } catch (error) {
//         console.error('Error searching activities:', error);
//         throw error;
//     }
// };
// export const getActivityById = async (activityId, advertiserId) => {
//     try {
//         const response = await fetch(`${API_URL}/advertiser/getActivity/${activityId}?advertiserId=${advertiserId}`, {
//             method: 'GET',
//         });

//         if (!response.ok) {
//             throw new Error('Activity not found');
//         }

//         return await response.json();
//     } catch (error) {
//         console.error('Error fetching activity:', error);
//         throw error;
//     }
// };
// Get activity by ID
export const getActivityById = async (activityId, advertiserId) => {
    try {
        const response = await fetch(`${API_URL}/advertiser/activities/${activityId}?advertiserId=${advertiserId}`, {
            method: 'GET',
        }); 

        if (!response.ok) {
            throw new Error('Activity not found');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching activity:', error);
        throw error;
    }
};


//update place 
export const updateActivity = async (activityId, activityData,advertiserId) => {
    try {
        const response = await fetch(`${API_URL}/advertiser/activities/${activityId}?advertiserId=${advertiserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(activityData),
        });
        if (!response.ok) {
            throw new Error('Failed to update activity');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

//delete a place


export const deleteActivity = async (activityId,advertiserId) => {
    try {
        const response = await fetch(`${API_URL}/advertiser/activities/${activityId}?advertiserId=${advertiserId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Place not found');
            } else {
                throw new Error('An error occurred while deleting the place');
            }
        }
       // return await response.json();
       return { message: "Place deleted successfully" };
    } catch (error) {
        console.error('Error deleting place:', error);
        throw error;
    }
};
