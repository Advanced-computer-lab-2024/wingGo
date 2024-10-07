import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Your API base URL

// Function to add a product as a seller with hardcoded sellerId
export const addProductAsSeller = async (productData) => {
    const hardcodedSellerId = '66fff4b2124570c52a7ccd03'; // Hardcoded sellerId

    productData.append('sellerId', hardcodedSellerId); // Append sellerId to the form data

    try {
        const response = await axios.post(`${API_URL}/seller/addProduct`, productData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Ensure the content type is correct for file uploads
            },
        });

        if (response.status !== 201) {
            throw new Error('Error adding product');
        }
        return response.data;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};
export const editProductAsSeller = async (productId, productData) => {
    const hardcodedSellerId = '66fff4b2124570c52a7ccd03'; // Hardcoded sellerId

    // Append sellerId to the formData before sending the request
    productData.append('sellerId', hardcodedSellerId);

    try {
        const response = await axios.put(`${API_URL}/seller/product/${productId}`, productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status !== 200) {
            throw new Error('Failed to edit product');
        }

        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};




// Function to sort products by ratings
export const sortProductsByRatingsAsSeller = async () => {
    try {
        const response = await axios.get(`${API_URL}/seller/sortProducts`);
        if (response.status !== 200) {
            throw new Error('Failed to sort products by ratings');
        }
        return response.data;
    } catch (error) {
        console.error('Error sorting products by ratings:', error);
        throw error;
    }
};

// Function to filter products by price
export const filterProductByPriceAsSeller = async (price) => {
    try {
        const response = await axios.get(`${API_URL}/seller/filterProducts?price=${price}`);
        if (response.status !== 200) {
            throw new Error('Failed to filter products by price');
        }
        return response.data;
    } catch (error) {
        console.error('Error filtering products:', error);
        throw error;
    }
};

// Function to search products by name
export const searchProductsByNameAsSeller = async (name) => {
    try {
        const response = await axios.get(`${API_URL}/seller/searchProductName?name=${name}`);
        if (response.status !== 200) {
            throw new Error('Failed to search products by name');
        }
        return response.data;
    } catch (error) {
        console.error('Error searching products by name:', error);
        throw error;
    }
};

// Function to get all products
export const getAllProductsAsSeller = async () => {
    try {
        const response = await axios.get(`${API_URL}/seller/getallproducts`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch products');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Function to create a seller profile
export const createSellerProfile = async (profileData) => {
    const hardcodedSellerId = '66fff4b2124570c52a7ccd03'; // Hardcoded sellerId

    try {
        const response = await axios.post(`${API_URL}/seller/createProfile/${hardcodedSellerId}`, profileData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 201) {
            throw new Error('Error creating seller profile');
        }
        return response.data;
    } catch (error) {
        console.error('Error creating seller profile:', error);
        throw error;
    }
};

// Function to update the seller profile
export const updateSellerProfile = async (profileData) => {
    const hardcodedSellerId = '66fff4b2124570c52a7ccd03'; // Hardcoded sellerId

    try {
        const response = await axios.put(`${API_URL}/seller/update/${hardcodedSellerId}`, profileData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            throw new Error('Error updating seller profile');
        }
        return response.data;
    } catch (error) {
        console.error('Error updating seller profile:', error);
        throw error;
    }
};
export const getSeller = async () => {
    const hardcodedSellerId = '66fff4b2124570c52a7ccd03'; // Hardcoded sellerId

    try {
        const response = await axios.get(`${API_URL}/seller/viewProfile/get/${hardcodedSellerId}`);
        
        if (response.status !== 200) {
            throw new Error('Failed to fetch seller profile');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching seller profile:', error);
        throw error;
    }
};