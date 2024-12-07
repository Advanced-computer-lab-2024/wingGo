import { fetchSalesReport } from '@/api/adminApi';
import { getSalesReport } from '@/api/TourGuideProfileApi';
import { getAdvertiserSalesReport } from '@/api/AdvertiserProfileApi'; // Import the advertiser API
import { getSellerSalesReport } from '@/api/SellerProfileApi'; // Import the seller API

import { SalesReport } from "@/interFace/interFace"; // Assuming interfaces are in this path
import { TourGuideSales } from "@/interFace/interFace"; // Assuming the interface is defined here
import { AdvertiserSales } from "@/interFace/interFace"; // Assuming the advertiser interface is defined here
import { SellerSales } from "@/interFace/interFace"; // Assuming the seller interface is defined here



export const loadSalesReportGuide = async (tourGuideId: string): Promise<TourGuideSales | null> => {
  try {
    // Fetch the sales report for the given Tour Guide ID
    const salesReport: TourGuideSales = await getSalesReport(tourGuideId);
    return salesReport; // Return the fetched sales report data
  } catch (error) {
    console.error("Failed to load sales report:", error);
    // Return null or handle the error as needed
    return null;
  }
};

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

export const loadAdvertiserSalesReport = async (advertiserId: string): Promise<AdvertiserSales | null> => {
  try {
    // Fetch the sales report for the given Advertiser ID
    const salesReport: AdvertiserSales = await getAdvertiserSalesReport(advertiserId);
    return salesReport; // Return the fetched sales report data
  } catch (error) {
    console.error("Failed to load advertiser sales report:", error);
    // Return null or handle the error as needed
    return null;
  }
};
export const loadSellerSalesReport = async (sellerId: string): Promise<SellerSales | null> => {
  try {
    // Fetch the sales report for the given Seller ID
    const salesReport: SellerSales = await getSellerSalesReport(sellerId);
    return salesReport; // Return the fetched sales report data
  } catch (error) {
    console.error("Failed to load seller sales report:", error);
    // Return null or handle the error as needed
    return null;
  }
};