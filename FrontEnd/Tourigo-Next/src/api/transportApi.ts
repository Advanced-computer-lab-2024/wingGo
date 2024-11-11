import axios from 'axios';
import { Transport} from '../interFace/interFace';

const touristId = '67240ed8c40a7f3005a1d01d';

export const fetchTransports = async (): Promise<Transport[]> => {
    try {
        const response = await axios.get('http://localhost:8000/tourist/transports');
        return response.data;
    } catch (error) {
        console.error("Error fetching activities:", error);
        throw error;
    }
};

export const bookTransportApi = async ( transportId: string) => {
    try {
        const response = await axios.post(`http://localhost:8000/tourist/bookTransport/${touristId}/${transportId}`);
        return response.data;
    } catch (error) {
        console.error('Error booking activity:', error);
        throw error;
    }
};