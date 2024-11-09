import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const addPreferencesToTourist = async (id: string, preferences: Array<any>): Promise<any> => {
  try {
    const response = await axios.put<any>(`${API_URL}/tourist/${id}/preferences`, preferences);
    console.log('Add preferences response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding preferences:', error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw error;
    }
  }
};

export const getAllPreferenceTags = async (): Promise<any> => {
  try {
    const response = await axios.get<any>(`${API_URL}/admin/preferences`);
    console.log('Get all preference tags response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching preference tags:', error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw error;
    }
  }
};