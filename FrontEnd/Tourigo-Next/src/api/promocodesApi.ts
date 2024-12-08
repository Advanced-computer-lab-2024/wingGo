// promocodesApi.ts

import axios from "axios";
import { PromoCode } from "../interFace/interFace";

const touristId = '67240ed8c40a7f3005a1d01d';
// Fetch available promo codes for a tourist
export const fetchAvailablePromoCodes = async (): Promise<PromoCode[]> => {
  try {
    const response = await axios.get(`http://localhost:8000/tourist/promoCodes/${touristId}`);
    return response.data.promoCodes;
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    throw error;
  }
};
