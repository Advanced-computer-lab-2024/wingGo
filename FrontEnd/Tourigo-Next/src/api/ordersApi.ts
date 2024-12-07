import axios from "axios";
import { Order } from "../interFace/interFace";

const touristId = '67240ed8c40a7f3005a1d01d'; 
const orderId= '6743699901c1ed599c8de321';

export const fetchTouristOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get(`http://localhost:8000/tourist/pastandcurrentorders/${touristId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tourist orders:', error);
    throw error;
  }
};

export const fetchOrderDetails = async  (): Promise<Order[]> => {
    try {
      const response = await axios.get(`http://localhost:8000/tourist/orderDetails/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching order details:", error.message);
      throw error;
    }
  };

//   export const fetchCancelOrder = async (touristId: string, orderId: string): Promise<Order> => {
//     try {
//       const response = await axios.put(`http://localhost:8000/tourist/cancelOrder/${touristId}/${orderId}`);
//       return response.data.order; // Return the updated order object from the response
//     } catch (error: any) {
//       console.error("Error canceling order:", error.response?.data?.message || error.message);
//       throw error;
//     }
//   };

export const fetchCancelOrder = async (touristId: string, orderId: string): Promise<{ message: string; order: any }> => {
    try {
      const response = await axios.put(
        `http://localhost:8000/tourist/cancelOrder/${touristId}/${orderId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error cancelling the order:', error.message);
      throw error;
    }
  };