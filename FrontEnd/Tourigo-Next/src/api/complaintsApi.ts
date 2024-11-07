//complaintsApi.ts

import axios from "axios";
import { Complaint } from "../interFace/interFace";

const touristId = '67240ed8c40a7f3005a1d01d';

export const fetchComplaints = async (): Promise<any> => {
    try {
        const response = await axios.get('http://localhost:8000/admin/getcomplaints');
        return response.data;
    } catch (error) {
        console.error("Error fetching complaints:", error);
        throw error;
    }
};

// New API function for fetching complaints by tourist ID async (touristId: string): Promise<Complaint[]> => {
export const fetchTouristComplaints = async (): Promise<Complaint[]> => {
    const touristId = '67240ed8c40a7f3005a1d01d';
    try {
        const response = await axios.get(`http://localhost:8000/tourist/viewmycomplaints/${touristId}`);
        return response.data.complaints;
    } catch (error) {
        console.error("Error fetching tourist complaints:", error);
        throw error;
    }
};


export const replyToComplaint = async (complaintId: string, reply: string) => {
    try {
      const response = await axios.post(`/replytocomplaint/${complaintId}`, { reply });
      return response.data;
    } catch (error) {
      console.error("Error replying to complaint:", error);
      throw error;
    }
  };