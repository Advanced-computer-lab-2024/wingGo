import{fetchComplaints} from '@/api/complaintsApi';
//import{fetchAllComplaints}from'@/api/complaintsApi';
import{Complaint}from'../interFace/interFace';


export const getComplaintsData=async():Promise<Complaint[]>=>{
    try{
        const complaints=await fetchComplaints();
        return complaints;
    }catch(error){
        console.error("Error loading complaints:",error);
        return[];
    }
};


