// TourGridRight.tsx
"use client";
import React, { useEffect, useState } from "react";
import TourSingleCard from "../common/tourElements/TourSingleCardIt";
import { Itinerary } from "@/interFace/interFace";
import { getItinerariesData, getFilteredItinerariesData } from "@/data/it-data";
import ItinerariesContentHeader from "@/elements/itineraries/it-header";
import ItinerariesSidebarMain from "../itinerariesSidebar/ItinerariesSidebarMain";

interface FilterOptions {
  budgetMin?: number;
  budgetMax?: number;
  date?: string;
  preferences?: string;
  language?: string;
  touristId?: string;
}

const TourGridRight = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [filteredItineraries, setFilteredItineraries] = useState<Itinerary[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("Default"); // Track the last sort option

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      const data = await getItinerariesData();
      setItineraries(data);
      setFilteredItineraries(data); // Initialize with full data
    };
    loadInitialData();
  }, []);

  const sortData = (data: Itinerary[], option: string) => {
    let sortedData = [...data];
    switch (option) {
      case "Rating: High to Low":
        sortedData.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case "Rating: Low to High":
        sortedData.sort((a, b) => (a.averageRating || 0) - (b.averageRating || 0));
        break;
      case "Price: Low to High":
        sortedData.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "Price: High to Low":
        sortedData.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "Default":
      default:
        sortedData = itineraries; // Reset to the original order if Default
        break;
    }
    return sortedData;
  };
  

  const applyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  
    let filteredData = itineraries.filter((itinerary) => {
      let matches = true;
  
      // Check if both min and max price filters are defined
      if (newFilters.budgetMin !== undefined) matches = matches && itinerary.price >= newFilters.budgetMin;
      if (newFilters.budgetMax !== undefined) matches = matches && itinerary.price <= newFilters.budgetMax;
  
      // Additional filters (e.g., language)
      if (newFilters.language) matches = matches && itinerary.language === newFilters.language;
      
      return matches;
    });
  
    // Reapply sorting after filtering
    filteredData = sortData(filteredData, sortOption);
    setFilteredItineraries(filteredData);
  };

  const applySearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const searchedData = filteredItineraries.filter(itinerary =>
        itinerary.title.toLowerCase().includes(query.toLowerCase()) ||
        itinerary.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredItineraries(searchedData);
    } else {
      // Reset to filtered data if query is cleared
      applyFilters(filters);
    }
  };

const handleSortChange = (selectedOption: string) => {
  setSortOption(selectedOption);
  const sortedData = sortData(filteredItineraries, selectedOption);
  setFilteredItineraries(sortedData);
};


  return (
    <>
      <section className="bd-tour-grid-area section-space">
        <div className="container">
          <div className="row gy-24">
            <div className="col-xxl-8 col-xl-8 col-lg-7">
              <ItinerariesContentHeader
              itineraryCount={filteredItineraries.length}
              onSortChange={handleSortChange}
              />
              <div className="row gy-24">
                {filteredItineraries.map((item) => (
                  <TourSingleCard
                    tour={item}
                    key={item._id}
                    className="col-xxl-4 col-xl-6 col-lg-6 col-md-6"
                    tourWrapperClass="tour-wrapper style-one"
                    isparentClass={true}
                  />
                ))}
              </div>
            </div>
            <div className="col-xxl-4 col-xl-4 col-lg-5">
            <ItinerariesSidebarMain applyFilters={applyFilters} applySearch={applySearch} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TourGridRight;
