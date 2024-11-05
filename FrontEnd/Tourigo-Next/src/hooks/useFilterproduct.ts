import {getProductData} from "@/data/prod-data";
import useGlobalContext from "./use-context";
import { Product } from '@/interFace/interFace';
import React, { useEffect, useState } from "react";

export const useFilter = (start: number, end: number) => {
  const [products, setProducts] = useState<Product[]>([]);
      
        useEffect(() => {
          const fetchProducts = async () => {
            const data = await getProductData();
            setProducts(data || []);  // Fallback to an empty array if data is undefined
          };
          fetchProducts();
        }, []);
  const { filterRange, niceSelectData } = useGlobalContext();

  // First filter the data based on the range
  let filteredData = products?.filter((item) => {
    let passesRange = true;

    if (
      filterRange.length &&
      (item.price < filterRange[0] || item.price > filterRange[1])
    ) {
      passesRange = false;
    }

    return passesRange;
  });

  // Then sort the filtered data based on niceSelectData
  if (niceSelectData !== "no-data" && typeof niceSelectData === "string") {
    if (niceSelectData === "Price (Low > High)") {
      filteredData = filteredData.sort((a, b) => a.price - b.price);
    } else if (niceSelectData === "Price (High > Low)") {
      filteredData = filteredData.sort((a, b) => b.price - a.price);
    }
  }

  // Additional logic for number type niceSelectData if needed
  if (typeof niceSelectData === "number") {
    filteredData = filteredData.slice(0, niceSelectData);
  }

  // Slice the filtered and sorted data to get the desired range
  const result = filteredData.slice(start, end);
  return result;
};
