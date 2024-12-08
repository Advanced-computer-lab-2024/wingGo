import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8000/tourist';


interface FlightSearchParams {
    origin: string;
    destination: string;
    departureDate: string;
}

interface DecodedToken {
  username: string;
  id: string;
  role: string;
  mustChangePassword: boolean;
}

export const searchFlights = async (params: FlightSearchParams): Promise<any> => {
    try {
      const response = await axios.get<any>(`${API_URL}/searchFlights`, {
        params: {
          origin: params.origin,
          destination: params.destination,
          departureDate: params.departureDate,
        },
      });
      console.log('Flight dataaaa:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching flight data:', error);
      throw error;
    }
  };

  export const bookflight = async (flight: any, paymentMethod: String, promoCode: String, adults: Number): Promise<any> => {
    try {
      
      const cookie = Cookies.get('token');

      if (!cookie) {
        throw new Error('No token found');
      }

      let id = '';
      if(cookie){
        const decodedToken = jwtDecode<DecodedToken>(cookie);
        id = decodedToken.id;
      }

      const response = await axios.post<any>(`${API_URL}/bookFlight/67240ed8c40a7f3005a1d01d`, {
        flightOffers: flight,
        paymentMethod: paymentMethod,
        promoCode: promoCode,
        adults: adults
      });
      console.log('booking data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching flight data:', error);
      return error;
    }
  }

  export const searchFlightsByUserId = async (userId: string): Promise<any> => {
    try {
      const response = await axios.get<any>(`${API_URL}/searchFlights/67240ed8c40a7f3005a1d01d`);
      console.log('search flights data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error searching flights:', error);
      return error;
    }
  };