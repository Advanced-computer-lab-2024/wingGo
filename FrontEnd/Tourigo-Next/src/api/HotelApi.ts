import axios from 'axios';

const API_URL = 'http://localhost:8000/tourist';


interface HotelSearchParams {
    cityCode: string;
    checkin: string | null;
    checkout: string | null;
}

export const searchHotels = async (params: HotelSearchParams): Promise<any> => {
    try {
      const response = await axios.get<any>(`${API_URL}/searchHotelsByCity`, {
        params: {
          cityCode: params.cityCode,
          checkin: params.checkin,
          checkout: params.checkout,
        },
      });
      console.log('Hotel dataaaa:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching flight data:', error);
      throw error;
    }
  };

  export const bookHotel = async (params: any): Promise<any> => {
    try {
      console.log('booking hotel:', params);
      const response = await axios.post<any>(`${API_URL}/bookHotel/67240ed8c40a7f3005a1d01d`, {
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
      const response = await axios.get<any>(`${API_URL}/searchHotels/67240ed8c40a7f3005a1d01d`);
      console.log('search hotels data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error searching hotels:', error);
      return error;
    }
  };