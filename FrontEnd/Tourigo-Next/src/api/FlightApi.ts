import axios from 'axios';

const API_URL = 'http://localhost:8000/tourist';


interface FlightSearchParams {
    origin: string;
    destination: string;
    departureDate: string;
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
      console.log('Flight data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching flight data:', error);
      throw error;
    }
  };