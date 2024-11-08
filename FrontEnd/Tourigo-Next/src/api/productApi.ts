import axios from 'axios';
import {  Product } from '../interFace/interFace';

export const fetchAllProducts = async (): Promise<Product[]> => {
    try {
        const response = await axios.get('http://localhost:8000/admin/getallproducts');
        return response.data;
    } catch (error) {
        console.error("Error fetching Prods:", error);
        throw error;
    }
};
export const fetchTouristData = async (touristId: string) => {
    try {
        const response = await axios.get(`http://localhost:8000/tourist/${touristId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tourist data:', error);
        throw error;
    }
};

export const fetchSellerData = async (sellerId: string) => {
    try {
        const response = await axios.get(`http://localhost:8000/seller/${sellerId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching seller data:', error);
        throw error;
    }
};

export const ArchiveUnarchiveProduct = async (id: string, sellerId: string, value: boolean) => {
    try {
      const response = await axios.put(`http://localhost:8000/seller/changearchive/${id}`, {
        sellerId,
        value
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error archiving/unarchiving product');
    }
  };

  export const ArchiveUnarchiveProductAdmin = async (id: string, value: boolean) => {
    try {
      const response = await axios.put(`http://localhost:8000/admin/changearchive/${id}`, {
        value
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error archiving/unarchiving product');
    }
  };

  export const rateProduct = async (touristId: string, productId: string, rating: number) => {
    try {
      const response = await axios.post(`http://localhost:8000/tourist/rateProduct/${touristId}/${productId}`, {
        rating,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error rating product');
    }
  };
  
  // Function to review a product
  export const reviewProduct = async (touristId: string, productId: string, review: string) => {
    try {
      const response = await axios.post(`http://localhost:8000/tourist/reviewProduct/${touristId}/${productId}`, {
        review,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error reviewing product');
    }
  };

  export const purchaseProduct = async (touristId: string, productId: string) => {
    try {
        const response = await axios.post(`http://localhost:8000/tourist/purchaseProduct/${touristId}/${productId}`);
        return response.data;
    } catch (error: any) {
        console.error('Error purchasing product:', error);
        throw new Error(error.response?.data?.message || 'Error processing purchase');
    }
};

export const fetchPurchasedProducts = async (touristId: string) => {
  try {
      const response = await axios.get(`http://localhost:8000/tourist/purchasedProducts/${touristId}`);
      return response.data; 
  } catch (error: any) {
      console.error('Error fetching purchased products:', error);
      throw new Error(error.response?.data?.message || 'Error fetching purchased products');
  }
};