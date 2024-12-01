import axios from 'axios';
import { IPendingUser} from '../interFace/interFace';
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
    try {
        const response = await axios.get(`http://localhost:8000/admin/getAllUsers`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export const searchUsers = async (search: string): Promise<any> => {
    try {
        const response = await axios.get(`http://localhost:8000/admin/searchUser?username=${search}`);
        return response.data;
    } catch (error) {
        console.error("Error searching users:", error);
        throw error;
    }
}



