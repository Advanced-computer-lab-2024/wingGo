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

// Function to edit a product
export const editProduct = async (productId: string, updates: Partial<Product>, pictureFile?: File) => {
  try {
    const formData = new FormData();

    // Append fields to formData if they are provided
    if (updates.name) formData.append('name', updates.name);
    if (updates.price !== undefined) formData.append('price', updates.price.toString());
    if (updates.quantity !== undefined) formData.append('quantity', updates.quantity.toString());
    if (updates.description) formData.append('description', updates.description);

    // Append the picture file if provided
    if (pictureFile) formData.append('picture', pictureFile);

    const response = await axios.put(`http://localhost:8000/admin/product/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error updating product:', error);
    throw new Error(error.response?.data?.message || 'Error updating product');
  }
};
export const createProduct = async (productData: any): Promise<any> => {
  try {
      const response = await axios.post(`http://localhost:8000/admin/add-product`, productData);
      return response.data;
  } catch (error) {
      console.error("Error creating product:", error);
      throw error;
  }
};
export const createProductsel = async (productData: any): Promise<any> => {
try {
    const response = await axios.post(`http://localhost:8000/seller/addProduct`, productData);
    return response.data;
} catch (error) {
    console.error("Error creating product:", error);
    throw error;
}
};