// TourGridRight.tsx
"use client";
import React, { useEffect, useState } from "react";
import TourSingleCard from "../common/tourElements/TourSingleCardIt";
import { Itinerary } from "@/interFace/interFace";
import { getItinerariesData, getFilteredItinerariesData } from "@/data/it-data";
import ItinerariesContentHeader from "@/elements/itineraries/it-header";
import ItinerariesSidebarMain from "../itinerariesSidebar/ItinerariesSidebarMain";

interface FilterOptions {
  budget?: number;
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

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      const data = await getItinerariesData();
      setItineraries(data);
      setFilteredItineraries(data); // Initialize with full data
    };
    loadInitialData();
  }, []);

  const applyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    const filteredData = itineraries.filter(itinerary => {
      // Apply budget filter, date filter, preferences, etc.
      let matches = true;
      if (newFilters.budget !== undefined) matches = matches && itinerary.price <= newFilters.budget;
      if (newFilters.language) matches = matches && itinerary.language === newFilters.language;
      // Add more conditions as necessary
      return matches;
    });
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

  return (
    <>
      <section className="bd-tour-grid-area section-space">
        <div className="container">
          <div className="row gy-24">
            <div className="col-xxl-8 col-xl-8 col-lg-7">
              <ItinerariesContentHeader />
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
              <ItinerariesSidebarMain applyFilters={applyFilters} applySearch={applySearch}/>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TourGridRight;