import axios from 'axios';

const API_URL = 'http://localhost:8000/tourist';


interface HotelSearchParams {
    cityCode: string;
}

export const searchHotels = async (params: HotelSearchParams): Promise<any> => {
    try {
      const response = await axios.get<any>(`${API_URL}/searchHotelsByCity`, {
        params: {
          cityCode: params.cityCode,
        },
      });
      console.log('Hotel dataaaa:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching flight data:', error);
      throw error;
    }
  };

  export const bookHotel = async (params: any): Promise<any> => {
    try {
      console.log('booking hotel:', params);
      const response = await axios.post<any>(`${API_URL}/bookHotel/6703fe21af26882204ffaffc`, {
        hotelOffers: params,
      });
      console.log('booking data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching flight data:', error);
      return error;
    }
  }

  export const searchHotelsByUserId = async (userId: string): Promise<any> => {
    try {
      const response = await axios.get<any>(`${API_URL}/searchHotels/6703fe21af26882204ffaffc`);
      console.log('search hotels data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error searching hotels:', error);
      return error;
    }
  };