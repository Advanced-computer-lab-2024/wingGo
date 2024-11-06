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
      const response = await axios.post<any>(`${API_URL}/bookHotel/670032f480b8a5dc77e2a155`, {
        hotelOffers: params,
      });
      console.log('booking data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching flight data:', error);
      return error;
    }
  }