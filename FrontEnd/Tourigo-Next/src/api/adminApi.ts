import axios from 'axios';
import { IPendingUser} from '../interFace/interFace';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    username: string;
    userId: string;
    role: string;
    mustChangePassword: boolean;
}
const adminID = '67326284e3b86017593a03a0'


export const fetchPendingUsers = async (): Promise<any[]> => {
    try {
        const response = await axios.get<IPendingUser[]>('http://localhost:8000/admin/pending-users');
        return response.data;
    } catch (error) {
        console.error("Error fetching pending users:", error);
        throw error;
    }
};
export const approvePendingUserById = async (id: string): Promise<any> => {
    try {
        const response = await axios.put(`http://localhost:8000/admin/approve/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error approving user:", error);
        throw error;
    }
};
export const deletePendingUserById = async (id: string): Promise<any> => {
    try {
        const response = await axios.delete(`http://localhost:8000/admin/pending-users/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error approving user:", error);
        throw error;
    }
};


// View pending user certificate
export const viewPendingUserCertificate = async (id: string): Promise<any> => {
    try {
        const response = await axios.get(`http://localhost:8000/admin/viewPendingUserCertificate/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user certificate:", error);
        throw error;
    }
};

// View pending user ID document
export const viewPendingUserID = async (id: string): Promise<any> => {
    try {
        const response = await axios.get(`http://localhost:8000/admin/viewPendingUserID/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user ID document:", error);
        throw error;
    }
};
export const fetchUsername = async (): Promise<any[]> => {
    try {
        const response = await axios.get<IPendingUser[]>(`http://localhost:8000/admin/getUsername/${adminID}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching username:", error);
        throw error;
    }
};
export const changeAdminPassword = async (id: string, oldPassword: string ,password: string, confirmNewPassword: string): Promise<any> => {
    try {
        
      const response = await axios.put<any>(`http://localhost:8000/admin/changePassword/${id}`, 
        { oldPassword, newPassword: password, confirmNewPassword }
    );
        console.log('Change password response:', response.data);
        return response.data;
        } catch (error) {
          console.error('Error changing password:', error);
          if (axios.isAxiosError(error)) {
            throw error.response?.data || error.message;
          } else {
            throw error;
          }
        }
    };


export const fetchUsers = async (): Promise<any> => {
            

        const cookie = Cookies.get('token');

        let username = '';
    try{

        if(cookie){
            const decodedToken = jwtDecode<DecodedToken>(cookie);
            console.log('Decoded Token:', decodedToken);
            username = decodedToken.username;
            
        }
        
        const response = await axios.get(`http://localhost:8000/admin/getAllUsers?username=${username}`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const searchUsers = async (search: string): Promise<any> => {
    const cookie = Cookies.get('token');

    let username = '';
    try {
        if (cookie) {
            const decodedToken = jwtDecode<DecodedToken>(cookie);
            console.log('Decoded Token:', decodedToken);
            username = decodedToken.username;
        }
        const response = await axios.get(`http://localhost:8000/admin/searchUser?username=${search}&LoggedInUsername=${username}`);
        return response.data;
    } catch (error) {
        console.error("Error searching users:", error);
        throw error;
    }
}

export const deleteUserById = async (id: string): Promise<any> => {
    try {
        const response = await axios.delete(`http://localhost:8000/admin/deleteAccount/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};


export const addAdmin = async (username: string, email: string, password: string): Promise<any> => {

    try {
        const response = await axios.post(`http://localhost:8000/admin/add-admin`, { username, email, password });
        return response.data;
    } catch (error) {
        console.error("Error adding admin:", error);
        throw error;
    }
};

export const addGovernor = async (username: string, email: string, password: string): Promise<any> => {
    
        try {
            const response = await axios.post(`http://localhost:8000/admin/addGovernor`, { username, email, password });
            return response.data;
        } catch (error) {
            console.error("Error adding governer:", error);
            throw error;
        }
    }



