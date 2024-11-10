import axios from 'axios';

const ADVERTISER_API_URL = 'http://localhost:8000/advertiser';

export const viewAdvertiserProfile = async (id: string): Promise<any> => {
  try {
    const response = await axios.get<any>(`${ADVERTISER_API_URL}/viewProfile/${id}`);
    console.log('Profile data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw error;
    }
  }
};

export const requestAccountDeletion = async (id: string): Promise<any> => {
  try {
    const response = await axios.delete<any>(`${ADVERTISER_API_URL}/requestAccountDeletion/${id}`);
    console.log('Delete response:', response);
    return response.data;
  } catch (error) {
    console.error('Error deleting profile:', error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw error;
    }
  }
}


export const getAdvertiserLogo = async (id: string): Promise<any> => {
  try {
    const response = await axios.get<any>(`${ADVERTISER_API_URL}/viewLogo/${id}`);
    console.log('Logo data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching logo data:', error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw error;
    }
  }
}


export const changeAdvertiserPassword = async (id: string, oldPassword: string ,password: string, confirmNewPassword: string): Promise<any> => {

  try {
    const response = await axios.put<any>(`${ADVERTISER_API_URL}/changePassword/${id}`, 
      { oldPassword, newPassword: password, confirmNewPassword }
    );
    console.log('Change password response:', response);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw error;
    }
  }
}

export const uploadAdvertiserLogo = async (id: string, formData: FormData): Promise<any> => {
  
  try {
    const response = await axios.post<any>(`${ADVERTISER_API_URL}/uploadLogo/${id}`, formData);
    console.log('Upload logo response:', response);
    return response.data;
  } catch (error) {
    console.error('Error uploading logo:', error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw error;
    }
  }
}