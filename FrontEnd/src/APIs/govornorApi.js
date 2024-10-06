import axios from 'axios';

const API_URL = 'http://localhost:8000';

//for govornor

//create place
export const createPlace = async (placeData) => {
    try {
        const response = await fetch(`${API_URL}/govornor/createPlace`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(placeData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create new place');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding new place:', error);
        throw error;
    }
};

//get all places

export const getAllPlaces = async () => {
    try {
        const response = await fetch(`${API_URL}/govornor/getAllPlaces`);
        if (!response.ok) {
            throw new Error('Failed to fetch places');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching places:', error);
        throw error;
    }
};

//get place by id


//update place 
export const updatePlace = async (placeId, placeData) => {
    try {
        const response = await fetch(`${API_URL}/govornor/updatePlace/${placeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(placeData),
        });
        if (!response.ok) {
            throw new Error('Failed to update place');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating place:', error);
        throw error;
    }
};