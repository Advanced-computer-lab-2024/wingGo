import axios from 'axios';
import {  Wishlist } from '../interFace/interFace';

//router.get('/viewWishlist/:touristId', touristController.viewWishlist);

export const fetchWishlist= async (touristId:string): Promise<Wishlist[]> => {
    try {
        const response = await axios.get(`http://localhost:8000/tourist/viewWishlist/${touristId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Prods:", error);
        throw error;
    }
};