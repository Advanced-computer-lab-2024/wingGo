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

export const getAllPlaces = async (govornorId) => {
    try {
        const response = await fetch(`${API_URL}/govornor/getAllPlaces?govornorId=${govornorId}`);
      
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


export const getPlaceById = async (placeId) => {
    try {
        const response = await fetch(`${API_URL}/govornor/getPlace/${placeId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to specific place by ID');
        }
        return await response.json();
    } catch (error) {
        console.error('Error searching places:', error);
        throw error;
    }
};

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

//delete a place


export const deletePlace = async (placeId) => {
    try {
        const response = await fetch(`${API_URL}/govornor/deletePlace/${placeId}`, {
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
export const addTagToPlace = async (placeId, tag, category) => {
    try {
        const response = await fetch(`${API_URL}/govornor/addTag/${placeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tag, category }), // Send the tag and its category
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add tag to place');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding tag:', error);
        throw error;
    }
};




//add tag to place
//addTagToPlace
//router.put('/addTag/:id', PlaceController.addTagToPlace);