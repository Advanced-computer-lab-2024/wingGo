import { Product } from '../interFace/interFace';

import { fetchAllProducts, fetchPurchasedProducts} from '@/api/productApi';

// const API_URL = 'http://localhost:8000/admin';

export const getProductData = async (): Promise<Product[]> => {
    try {
        const Product = await fetchAllProducts();
        return Product;
    } catch (error) {
        console.error("Error loading Prods:", error);
        return [];
    }
};


// Function to get only purchased products for a specific tourist
export const getPurchasedProducts = async (touristId: string) => {
    try {
        const purchasedProducts = await fetchPurchasedProducts(touristId);
        return purchasedProducts;
    } catch (error) {
        console.error('Error fetching purchased products:', error);
        throw error;
    }
};

