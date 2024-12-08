import axios from 'axios';
import { Transport} from '../interFace/interFace';

const touristId = '673167d3aa67023ecc799397';

export const fetchTransports = async (): Promise<Transport[]> => {
    try {
        const response = await axios.get('http://localhost:8000/tourist/transports');
        return response.data;
    } catch (error) {
        console.error("Error fetching activities:", error);
        throw error;
    }
};

export const bookTransportApi = async ( transportId: string) => {
    try {
        const response = await axios.put(`http://localhost:8000/tourist/bookTransport/${touristId}/${transportId}`);
        return response.data;
    } catch (error) {
        console.error('Error booking transport:', error);
        throw error;
    }
};

export const getTransportPrice = async (transportId: string, promoCode: string | null): Promise<{ totalPrice: number, promoCodeApplied: boolean }> => {
    try {
        const url = promoCode 
            ? `http://localhost:8000/tourist/transportPrice/${transportId}/${promoCode}`
            : `http://localhost:8000/tourist/transportPrice/${transportId}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching transport price:", error);
        throw error;
    }
};

export const bookTransport = async (
    touristId: string,
    transportId: string,
    paymentMethod: string,
    promoCode?: string
  ): Promise<any> => {
    try {
      const response = await axios.put(
        `http://localhost:8000/tourist/bookTransport/${touristId}/${transportId}`,
        {
          paymentMethod,
          promoCode,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error during transport booking:", error);
      throw error;
    }
  };