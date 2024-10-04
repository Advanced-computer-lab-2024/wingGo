import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/getallproducts`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const editProduct = async (productId, productData) => {
    try {
        const response = await axios.put(`${API_URL}/admin/product/${productId}`, productData);
        return response.data;
    } catch (error) {
        console.error('Error editing product:', error);
        throw error;
    }
};