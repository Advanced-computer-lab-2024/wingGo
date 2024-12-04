import axios from 'axios';
import { Cart} from '../interFace/interFace';
const touristId='673167d3aa67023ecc799397'


export const fetchCartItems = async (): Promise<Cart[]> => {
  try {
      const response = await axios.get(`http://localhost:8000/tourist/cartItems/${touristId}`);
      return response.data; // Assuming the response contains an 'items' array
  } catch (error) {
      console.error("Error fetching cart items:", error);
      throw error;
  }
}

export const updateCartItemAmount = async (cartItemId: string, amount: number) => {
  try {
    const response = await axios.put(
      `http://localhost:8000/tourist/updateAmountInCart/${cartItemId}`, // Replace with your actual backend URL
      { amount } // Payload for the API
    );
    console.log(response.data);
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error updating cart item amount:', error);
    throw error; // Throw error to handle it in the calling code
  }
};
export const removeFromCart = async (productId: string) => {
  try {
    const response = await axios.delete(
      `http://localhost:8000/tourist/cart/${touristId}/${productId}` // Replace with your actual backend URL
    );
    console.log(response.data);
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error; // Throw error to handle it in the calling code
  }
};

export const addToCart = async (productId: any): Promise<any> => {
  try {
    const response = await axios.post(
      `http://localhost:8000/tourist/cart/${touristId}/${productId}` // Update with your actual backend URL
    );
    console.log("Product added to cart:", response.data.cartItem);
    return response.data.cartItem; // Return the added cart item
  } catch (error: any) {
    console.error("Error adding product to cart:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to add product to cart. Please try again."
    );
  }
};