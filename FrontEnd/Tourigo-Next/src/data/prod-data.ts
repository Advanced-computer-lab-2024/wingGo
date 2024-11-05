import { Product } from '../interFace/interFace';

import { fetchAllProducts} from '@/api/productApi';

const API_URL = 'http://localhost:8000/admin';

export const getProductData = async (): Promise<Product[]> => {
    try {
        const Product = await fetchAllProducts();
        return Product;
    } catch (error) {
        console.error("Error loading Prods:", error);
        return [];
    }
};


// export const getFilteredItinerariesData = async (filters: {
//     budget?: number;
//     date?: string;
//     preferences?: string;
//     language?: string;
//     touristId?: string;
// }): Promise<Itinerary[]> => {
//     try {
//         const itineraries = await fetchFilteredItineraries(filters);
//         return itineraries;
//     } catch (error) {
//         console.error("Error loading filtered itineraries:", error);
//         return [];
//     }
// };