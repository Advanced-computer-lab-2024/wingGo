import axios from 'axios';
import {  Wishlist } from '../interFace/interFace';
const touristId = '673167d3aa67023ecc799397';

//router.get('/viewWishlist/:touristId', touristController.viewWishlist);

export const fetchWishlist= async (): Promise<Wishlist[]> => {
    try {
        const response = await axios.get(`http://localhost:8000/tourist/viewWishlist/${touristId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Prods:", error);
        throw error;
    }
};

export const getProductById = async (productId: string): Promise<any> => {
    try {
      // Construct the API URL with the product ID
      const url = `http://localhost:8000/tourist/product/${productId}`;
  
      // Make the GET request
      const response = await axios.get(url);
  
      console.log('Product fetched successfully:', response.data);
      return response.data.product; // Return the product details
    } catch (error: any) {
      console.error('Error fetching product by ID:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch the product. Please try again.'
      );
    }
  };

  //router.post('/wishlist/:touristId/:productId', touristController.addWishlist);
export const addItemtoWishlist = async(productId:any): Promise<any>=>{
  try{
    const url = `http://localhost/8000/tourist/wishlist/${touristId}/${productId}`;

    const response=await axios.post(url);
    console.log('Product added to wishlist successfully:', response.data.product);
    return response.data.product;
  } catch (error: any) {
    console.error("Error adding product to wishlist:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to add product to wishlist. Please try again."
    );
  }
};