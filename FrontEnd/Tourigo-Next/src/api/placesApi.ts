// placesApi.ts
import axios from 'axios';
import { Place } from '../interFace/interFace';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; 

interface DecodedToken {
    username: string;
    id: string;
    role: string;
    mustChangePassword:boolean;
  }
const API_URL = 'http://localhost:8000/tourist';
const governorId='674d045f99ed6f4415cbdd39'

// Fetch all places
export const fetchAllPlaces = async (): Promise<Place[]> => {
    try {
        const response = await axios.get(`http://localhost:8000/tourist/viewPlaces`);
        return response.data.places;
    } catch (error) {
        console.error("Error fetching places:", error);
        throw error;
    }
};
export const createPlace = async (
   
    data: any
  ): Promise<any> => {
   
    try {
      const response = await axios.post(
        `http://localhost:8000/govornor/createPlace?governorId=${governorId}`, 
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating place:", error);
      throw error;
    }
  };
// Delete a place
export const deletePlace = async (placeId: string): Promise<void> => {
    try {
        await axios.delete(`http://localhost:8000/govornor/deletePlace/${placeId}`);
        console.log(`Place with ID ${placeId} has been deleted.`);
    } catch (error) {
        console.error("Error deleting place:", error);
        throw error;
    }
};
export const updatePlace = async (id:string, updatedData:any) => {
    const token = Cookies.get('token');
    let governorId = "";
    try {
        if (token) {
            const decodedToken = jwtDecode<DecodedToken>(token);
            console.log("Decoded Token:", decodedToken);
            governorId = decodedToken.id;  // Extract governorId from the token
        } else {
            throw new Error("No token found. Please log in.");
        }
        const response = await axios.put(
            `http://localhost:8000/govornor/updatePlace/${id}?governorId=${governorId}`,
            updatedData
        );
        return response.data; // Contains message and updated place data
    } catch (error) {
        console.error('Error updating place:', error);
        throw error;
    }
};

// Fetch distinct tags for places
export const fetchDistinctTags = async (): Promise<string[]> => {
    try {
      const response = await axios.get(`${API_URL}/places/tags`);
      console.log("Distinct tags fetched successfully:", response.data);
      return response.data.distinctTags; // Return the array of distinct tags
    } catch (error: any) {
      console.error("Error fetching distinct tags:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to fetch distinct tags. Please try again."
      );
    }
  };

  
  export const filterPlaces = async (filters: { 
    
    tag?:string;
    
    
}): Promise<any[]> => {
    try {
        const response = await axios.get(`http://localhost:8000/tourist/filterPlacesByTag`, { params: filters });
        console.log("tag is",filters);
        return response.data;
    } catch (error) {
        console.error("Error fetching filtered places:", error);
        throw error;
    }
};


export const getAvailableTags = async (): Promise<string[]> => {
    try {
        const response = await axios.get(`http://localhost:8000/govornor/viewPreferences`);
        console.log("Tags available:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
};