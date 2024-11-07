//complaintsApi.ts

import axios from "axios";
import { Complaint } from "../interFace/interFace";

//const touristId = '67240ed8c40a7f3005a1d01d';

export const fetchComplaints = async (): Promise<any> => {
    try {
        const response = await axios.get('http://localhost:8000/admin/getcomplaints');
        return response.data;
    } catch (error) {
        console.error("Error fetching complaints:", error);
        throw error;
    }
};


