import { Transport } from '../interFace/interFace';
import { fetchTransports, bookTransportApi } from '@/api/transportApi';

export const getTransportsData = async (): Promise<Transport[]> => {
    try {
        const transports = await fetchTransports();
        return transports;
    } catch (error) {
        console.error("Error loading transports:", error);
        return [];
    }
};

export const bookTransport = async (transportId: string) => {
    try {
        const response = await bookTransportApi(transportId);
        return response;
    } catch (error) {
        console.error("Error booking transport:", error);
        return [];
    }
};