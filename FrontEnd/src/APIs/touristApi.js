import axios from 'axios';

const API_URL = 'http://localhost:8000/tourist';

// Register tourist
export const registerTourist = async () => {
    try {
        const response = await axios.get(`${API_URL}/register`);
        return response.data;
    } catch (error) {
        console.error('Error registering tourist:', error);
        throw error;
    }
};

// Get all products
export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/getallproducts`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// View tourist profile
export const getTouristProfile = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/viewProfile/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tourist profile:', error);
        throw error;
    }
};

// Update tourist profile
export const updateTouristProfile = async (id, profileData) => {
    try {
        const response = await axios.put(`${API_URL}/update/${id}`, profileData);
        return response.data;
    } catch (error) {
        console.error('Error updating tourist profile:', error);
        throw error;
    }
};

// Sort products by ratings
export const sortProductsByRatings = async () => {
    try {
        const response = await axios.get(`${API_URL}/sortProducts`);
        return response.data;
    } catch (error) {
        console.error('Error sorting products:', error);
        throw error;
    }
};

// Filter products by price
export const filterProductsByPrice = async (price) => {
    try {
        const response = await axios.get(`${API_URL}/filterProducts`, { params: { price } });
        return response.data;
    } catch (error) {
        console.error('Error filtering products:', error);
        throw error;
    }
};

// Search products by name
export const searchProductsByName = async (name) => {
    try {
        const response = await axios.get(`${API_URL}/searchProductName`, { params: { name } });
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

// Filter places by tag
export const filterPlacesByTag = async (tag) => {
    try {
        const response = await axios.get(`${API_URL}/filterPlacesByTag`, { params: { tag } });
        return response.data;
    } catch (error) {
        console.error('Error filtering places by tag:', error);
        throw error;
    }
};

// Get all upcoming activities
export const getAllUpcomingActivities = async () => {
    try {
        const response = await axios.get(`${API_URL}/viewActivities`);
        return response.data;
    } catch (error) {
        console.error('Error fetching upcoming activities:', error);
        throw error;
    }
};

// Get all upcoming itineraries
export const getAllUpcomingItineraries = async () => {
    try {
        const response = await axios.get(`${API_URL}/viewItineraries`);
        return response.data;
    } catch (error) {
        console.error('Error fetching upcoming itineraries:', error);
        throw error;
    }
};

// Get all upcoming places
export const getAllUpcomingPlaces = async () => {
    try {
        const response = await axios.get(`${API_URL}/viewPlaces`);
        return response.data;
    } catch (error) {
        console.error('Error fetching upcoming places:', error);
        throw error;
    }
};

// Get all upcoming events
export const getAllUpcomingEvents = async () => {
    try {
        const response = await axios.get(`${API_URL}/viewUpcoming`);
        return response.data;
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        throw error;
    }
};

// Filter upcoming activities
export const filterUpcomingActivities = async (filters) => {
    try {
        const response = await axios.get(`${API_URL}/filterActivities`, { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error filtering upcoming activities:', error);
        throw error;
    }
};

// Sort upcoming activities or itineraries
export const sortUpcomingActivityOrItineraries = async (sort) => {
    try {
        const response = await axios.get(`${API_URL}/sort`, { params: { sort, type:'activity'} });
        return response.data;
    } catch (error) {
        console.error('Error sorting upcoming activities or itineraries:', error);
        throw error;
    }
};

// Search all models (activities, itineraries, places)
export const searchAllModels = async (query) => {
    try {
        const response = await axios.get(`${API_URL}/search`, { params: { query } });
        return response.data.activities;
    } catch (error) {
        console.error('Error searching all models:', error);
        throw error;
    }
};

// Filter itineraries
export const filterItineraries = async (filters) => {
    try {
        const response = await axios.get(`${API_URL}/itineraries`, { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error filtering itineraries:', error);
        throw error;
    }
};