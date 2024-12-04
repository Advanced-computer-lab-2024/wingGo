import axios from 'axios';

const API_URL = 'http://localhost:8000';
const touristId = "67240ed8c40a7f3005a1d01d";

export const addPreferencesToTourist = async (id: string, preferences: any): Promise<any> => {
  try {
    console.log('Selected Preferences IN API:', preferences);
    const response = await axios.put<any>(`${API_URL}/tourist/${id}/preferences`, {
      preferences,
    });
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

export const deletePreferenceFromTourist = async (id: string, preferences: string): Promise<any> => {
  try {
    const response = await axios.delete<any>(`${API_URL}/tourist/${id}/preferences`, {
      data: { preferences }
    });
    console.log('Delete preference response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting preference:', error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw error;
    }
  }
}

export const getAllPreferenceTags = async (): Promise<Array<any>> => {
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

export const toggleNotificationPreferenceApi = async (
  touristId: string,
  notifyOnInterest: boolean
) => {
  try {
    const response = await axios.put(
      `http://localhost:8000/tourist/toggleNotificationPreference/${touristId}`,
      { notifyOnInterest }
    );
    return response.data;
  } catch (error) {
    console.error('Error toggling notification preference:', error);
    throw error;
  }
};

export const getTouristNotificationsApi = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/tourist/notifications/${touristId}`);
    return response.data.notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};