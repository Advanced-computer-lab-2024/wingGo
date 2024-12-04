import { fetchSalesReport } from '@/api/adminApi';
import { SalesReport } from "@/interFace/interFace"; // Assuming interfaces are in this path

export const loadSalesReport = async (): Promise<SalesReport | null> => {
  try {
    const salesReport: SalesReport = await fetchSalesReport(); // Type-safe fetch
    return salesReport; // Return the sales report data
  } catch (error) {
    console.error("Failed to load sales report:", error);
    // Return null or handle error as needed
    return null;
  }
};
