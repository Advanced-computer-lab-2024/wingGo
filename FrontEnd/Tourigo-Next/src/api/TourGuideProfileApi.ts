import axios from 'axios';
import { TourGuideSales , TouristReportOfGuide} from '@/interFace/interFace'; // Adjust the path based on your project structure


const ADVERTISER_API_URL = 'http://localhost:8000/tourguide';

export const viewTourGuideProfile = async (id: string): Promise<any> => {
  try {
    const response = await axios.get<any>(`${ADVERTISER_API_URL}/fetch/${id}`);
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

export const updateTourGuideProfile = async (id: string, updatedData: any): Promise<any> => {

  try {
    const response = await axios.put<any>(`${ADVERTISER_API_URL}/update/${id}`, updatedData);
    console.log('Update response:', response);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw error;
    }
  }
}

export const requestAccountDeletion = async (id: string): Promise<any> => {
  try {
    const response = await axios.delete<any>(`${ADVERTISER_API_URL}/deleteAccount/${id}`);
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


export const getTourGuidePhoto = async (id: string): Promise<any> => {
  try {
    const response = await axios.get<any>(`${ADVERTISER_API_URL}/viewProfilePhoto/${id}`);
    console.log('Photo data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching photo data:', error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw error;
    }
  }
}


export const changeTourGuidePassword = async (id: string, oldPassword: string ,password: string, confirmNewPassword: string): Promise<any> => {

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

export const uploadTourGuidePhoto = async (id: string, formData: FormData): Promise<any> => {
  
  try {
    const response = await axios.post<any>(`${ADVERTISER_API_URL}/changeProfilePhoto/${id}`, formData);
    console.log('Upload photo response:', response);
    return response.data;
  } catch (error) {
    console.error('Error uploading photo:', error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw error;
    }
  }
}

export const acceptTermsAndConditions = async (id: string): Promise<any> => {
    try {
        const response = await axios.put<any>(`${ADVERTISER_API_URL}/acceptterms/${id}`);
        console.log('Accept terms response:', response);
        return response.data;
    } catch (error) {
        console.error('Error accepting terms:', error);
        if (axios.isAxiosError(error)) {
        throw error.response?.data || error.message;
        } else {
        throw error;
        }
    }
    }

    export const getSalesReport = async (tourGuideId: string): Promise<TourGuideSales> => {
      try {
        const response = await axios.get<TourGuideSales>(`${ADVERTISER_API_URL}/sales-report/${tourGuideId}`);
        console.log('Sales report data:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching sales report:', error);
        if (axios.isAxiosError(error)) {
          throw error.response?.data || error.message;
        } else {
          throw error;
        }
      }
    };

    // Fetch Tourist Report
export const getTouristReportofguide = async (tourGuideId: string): Promise<TouristReportOfGuide> => {
  try {
    const response = await axios.get<TouristReportOfGuide>(`${ADVERTISER_API_URL}/tourist-report/${tourGuideId}`);
    console.log('Tourist report data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching tourist report:', error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw error;
    }
  }
};