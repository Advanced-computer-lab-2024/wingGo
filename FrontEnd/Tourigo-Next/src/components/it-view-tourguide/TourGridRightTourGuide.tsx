// TourGridRightTourGuide.tsx
"use client";
import React, { useEffect, useState } from "react";
import TourSingleCard from "../common/tourElements/TourSingleCardIt";
import { Itinerary } from "@/interFace/interFace";
import { getTourGuideItinerariesData } from "@/data/it-data";
import ItinerariesContentHeader from "@/elements/itineraries/it-header";
import ItinerariesSidebarMain from "../itinerariesSidebar/ItinerariesSidebarMain";

interface FilterOptions {
  budget?: number;
  language?: string;
}

const TourGridRightTourGuide = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [filteredItineraries, setFilteredItineraries] = useState<Itinerary[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      const data = await getTourGuideItinerariesData();
      setItineraries(data);
      setFilteredItineraries(data); // Initialize with full data
    };
    loadInitialData();
  }, []);

  // Apply filters locally
  const applyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    const filteredData = itineraries.filter((itinerary) => {
      let matches = true;
      if (newFilters.budget !== undefined) matches = matches && itinerary.price <= newFilters.budget;
      if (newFilters.language) matches = matches && itinerary.language === newFilters.language;
      return matches;
    });
    setFilteredItineraries(filteredData);
  };

  // Apply search locally
  const applySearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const searchedData = filteredItineraries.filter((itinerary) =>
        itinerary.title.toLowerCase().includes(query.toLowerCase()) ||
        itinerary.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredItineraries(searchedData);
    } else {
      applyFilters(filters); // Re-apply filters if search query is cleared
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
                    isTourGuide={true} // Set isTourGuide to true for tour guide view
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

export default TourGridRightTourGuide;
