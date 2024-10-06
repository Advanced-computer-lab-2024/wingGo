import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const getPendingUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/admin/pending-users`);
        if (!response.ok) {
            throw new Error('Failed to fetch pending users');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching pending users:', error);
        throw error;
    }
};

// src/api.js
export const deletePendingUser = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/admin/pending-users/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to decline user');
        }
        return await response.json();
    } catch (error) {
        console.error('Error declining user:', error);
        throw error;
    }
};

export const approvePendingUser = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/admin/approve/${userId}`, {
            method: 'PUT',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to approve user');
        }
        return await response.json();
    } catch (error) {
        console.error('Error approving user:', error);
        throw error;
    }
};

export const addProductAsAdmin = async (productData) => {
    try {
        const response = await fetch(`${API_URL}/admin/add-product`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'SellerID is invalid');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};


export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/getallproducts`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const filterProductByPrice = async (price) => {
    try {
        const response = await fetch(`${API_URL}/admin/filterProducts?price=${price}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to filter products');
        }
        return await response.json();
    } catch (error) {
        console.error('Error filtering products:', error);
        throw error;
    }
};

export const searchProductsByName = async (name) => {
    try {
        const response = await fetch(`${API_URL}/admin/searchProductName?name=${name}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to search products');
        }
        return await response.json();
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

export const editProduct = async (productId, productData) => {
    try {
        const response = await fetch(`${API_URL}/admin/product/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });
        if (!response.ok) {
            throw new Error('Failed to edit product');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteAccountById = async (accountId) => {
    try {
        const response = await fetch(`${API_URL}/admin/deleteAccount/${accountId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('ID is non-existent');
            } else {
                throw new Error('An error occurred while deleting the account');
            }
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
};
// tour guide
export const createItinerary = async (itineraryData) => {
    try {
        console.log(itineraryData);
        const response = await fetch(`${API_URL}/tourguide/Createitinerary`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itineraryData),
        });
        if (!response.ok) {
            throw new Error('Failed to create itinerary');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating itinerary:', error);
        throw error;
    }
};

export const addTourismGovernor = async (governorData) => {
    try {
        const response = await fetch(`${API_URL}/admin/addGovernor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(governorData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add Tourism Governor');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding Tourism Governor:', error);
        throw error;
    }
};

export const getAttractions = async () => {
    try {
        const response = await fetch(`${API_URL}/admin/getAttractions`);
        if (!response.ok) {
            throw new Error('Failed to fetch attractions');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching attractions:', error);
        throw error;
    }
};

export const getTagsByAttractionId = async (id) => {
    try {
        const response = await fetch(`${API_URL}/admin/attractions/${id}/tags`);
        if (!response.ok) {
            throw new Error('Failed to fetch tags');
        }
        const data = await response.json();
        console.log('API response for tags:', data); // Debug log
        return data;
    } catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
    }
};

export const addTag = async (id, tag) => {
    try {
        const response = await fetch(`${API_URL}/admin/attractions/${id}/addTags`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tag }),
        });
        if (!response.ok) {
            throw new Error('Failed to add tag');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding tag:', error);
        throw error;
    }
};

export const deleteTag = async (id, tag) => {
    try {
        const response = await fetch(`${API_URL}/admin/attractions/${id}/deleteTag`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tag }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete tag');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting tag:', error);
        throw error;
    }
};

export const updateTag = async (id, oldTag, newTag) => {
    try {
        const response = await fetch(`${API_URL}/admin/attractions/${id}/updateTags`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ oldTag, newTag }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update tag');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating tag:', error);
        throw error;
    }
};

export const addAdmin = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/admin/add-admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add admin');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding admin:', error);
        throw error;
    }
};

export const sortProductsByRatings = async () => {
    try {
        const response = await fetch(`${API_URL}/admin/sortProducts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch sorted products');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching sorted products:', error);
        throw error;
    }
};