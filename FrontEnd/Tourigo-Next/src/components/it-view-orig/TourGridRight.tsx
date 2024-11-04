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
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load initial data only once
  useEffect(() => {
    const loadInitialData = async () => {
      const data = await getItinerariesData();
      setItineraries(data);
      setIsInitialLoad(false);
    };
    if (isInitialLoad) loadInitialData();
  }, [isInitialLoad]);

  const applyFilters = async (newFilters: FilterOptions) => {
    setFilters(newFilters);
    const data = await getFilteredItinerariesData(newFilters);
    setItineraries(data);
  };

  return (
    <>
      <section className="bd-tour-grid-area section-space">
        <div className="container">
          <div className="row gy-24">
            <div className="col-xxl-8 col-xl-8 col-lg-7">
              <ItinerariesContentHeader />
              <div className="row gy-24">
                {itineraries.map((item) => (
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
              <ItinerariesSidebarMain applyFilters={applyFilters} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TourGridRight;
