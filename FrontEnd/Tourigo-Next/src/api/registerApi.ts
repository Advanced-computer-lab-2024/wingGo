import axios, { AxiosResponse } from 'axios';


const API_URL = 'http://localhost:8000';

export const registerTourist = async (user: any): Promise<any> => {
    try {
        const response: AxiosResponse<any> = await axios.post(`${API_URL}/register`, user);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { error: error.response.data.error };
        } else {
            return { error: 'An unknown error occurred' };
        }
    }
};

export const registerPendingUser = async (user: any): Promise<any> => {
    const formData = new FormData();
    formData.append('email', user.email);
    formData.append('username', user.username);
    formData.append('password', user.password);
    formData.append('role', user.role);
    formData.append('IDdocument', user.IDdocument);
    formData.append('certificate', user.certificate);

    try {
        const response: AxiosResponse<any> = await axios.post(`${API_URL}/register`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { error: error.response.data.error };
        } else {
            return { error: 'An unknown error occurred' };
        }
    }
};

export const registerUser = async (user: any): Promise<any> => {
    if (user.role === 'tourist') {
        return registerTourist(user as any);
    } else {
        return registerPendingUser(user as any);
    }
};