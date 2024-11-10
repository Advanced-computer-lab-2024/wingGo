import axios from 'axios';
import { IPendingUser} from '../interFace/interFace';


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




