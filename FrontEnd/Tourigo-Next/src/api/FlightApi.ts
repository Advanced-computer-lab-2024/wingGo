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
      console.log('Flight dataaaa:', response.data.data.flightOffers);
      return response.data.data.flightOffers;
    } catch (error) {
      console.error('Error fetching flight data:', error);
      throw error;
    }
  };

  export const bookflight = async (params: any): Promise<any> => {
    try {
      console.log('booking flight:', params);
      const response = await axios.post<any>(`${API_URL}/bookFlight/6703fe21af26882204ffaffc`, {
        flightOffers: params,
      });
      console.log('booking data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching flight data:', error);
      return error;
    }
  }