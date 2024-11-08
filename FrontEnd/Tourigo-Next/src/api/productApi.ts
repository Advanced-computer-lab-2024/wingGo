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