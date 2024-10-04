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