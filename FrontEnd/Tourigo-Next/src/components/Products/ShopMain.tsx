//ShopMain.tsx
"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../common/breadcrumb/BreadCrumb";
// import getProductData from "@/data/prod-data";
import PaginationWrapperTwo from "../shearedComponents/PaginationWrapperTwo";
import ShopSidebarMain from "./ShopSidebarMain";
import ShopModal from "@/elements/modals/ShopModalproduct";
import ShopContentSingleCard from "@/elements/Products/ShopContentSingleCard";
import ShopContentHeader from "@/elements/Products/ShopContentHeader";
import { useProductSearch } from "@/hooks/newProductSearch";
import { useFilter } from "@/hooks/useFilterproduct";
import { useCurrency } from "@/contextApi/CurrencyContext"; // Import the useCurrency hook

const ShopMain = () => {
  const { currency, convertAmount } = useCurrency();
  const filterData = useFilter(0, 18);
  const searchData = useProductSearch();
  const [convertedPrices, setConvertedPrices] = useState<Record<string, number>>({});

  const mapData = (searchData.length ? searchData : filterData).filter(
    (item) => !item.archive && item._id 
  );
  useEffect(() => {
    const convertPrices = async () => {
      const newConvertedPrices: Record<string, number> = {};

      for (const item of mapData) {
        if (item.price && item._id) {
          const convertedPrice = await convertAmount(item.price);
          console.log(`Converted price for ${item._id}: ${convertedPrice}`);
          newConvertedPrices[item._id] = convertedPrice;
        }
      }

      setConvertedPrices(newConvertedPrices);
      console.log("Converted Prices Map:", newConvertedPrices); // Log the final map
    };

    convertPrices();
  }, [currency, mapData, convertAmount]);
  
  return (
    <>
      <Breadcrumb titleOne="Shop" titleTwo="Shop" />
       {/* Display currency and converted amount for testing */}
       <section className="bd-currency-test">
        <p>Current Currency: {currency}</p>
      </section>

      <section className="bd-shop-area section-space">
        <div className="container">
          <div className="row gy-24">
            {mapData?.length ? (
              <>
                <div className="col-xxl-8 col-xl-8 col-lg-12">
                  <ShopContentHeader />
                  <div className="row gy-24">
                    {mapData.map((item, index) => (
                        <ShopContentSingleCard
                        classItem="col-xxl-4 col-xl-4 col-lg4 col-md-4 col-sm-6"
                        key={index}
                        item={{
                          ...item,
                          price: convertedPrices[item._id as string] ?? item.price, // Type assertion as string
                        }}
                        userRole="Tourist"
                      />
                    ))}
                  </div>
                  <PaginationWrapperTwo />
                </div>
              </>
            ) : (
              <>
                <div className="col-xxl-8 col-xl-8 col-lg-12">
                  <h2 className="text-center">No Product Found</h2>
                </div>
              </>
            )}
            <div className="col-xxl-4 col-xl-4 col-lg-6">
              <ShopSidebarMain />
            </div>
          </div>
        </div>
      </section>
      <ShopModal />
    </>
  );
};

export default ShopMain;
