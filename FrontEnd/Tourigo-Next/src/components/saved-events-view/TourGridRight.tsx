// TourGridRight.tsx
"use client";
import React, { useEffect, useState } from "react";
import TourSingleCard from "../common/tourElements/TourSingleCardIt";
import TourSingleCard2 from "../common/tourElements/ActivitySingleCard";
import { Itinerary,Activity } from "@/interFace/interFace";
import { getItinerariesData, getFilteredItinerariesData } from "@/data/it-data";
import ItinerariesContentHeader from "@/elements/itineraries/it-header";
import ItinerariesSidebarMain from "../itinerariesSidebar/ItinerariesSidebarMain";
import { viewAllSavedEventsApi } from "@/api/itineraryApi";
import { it } from "node:test";




const SavedEventsGrid = () => {
  const [savedActivities, setSavedActivities] = useState<Activity[]>([]);
  const [savedItineraries, setSavedItineraries] = useState<Itinerary[]>([]);

  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        const { savedActivities, savedItineraries } = await viewAllSavedEventsApi( "67240ed8c40a7f3005a1d01d");
        setSavedActivities(savedActivities);
        setSavedItineraries(savedItineraries);
      } catch (error) {
        console.error("Error fetching saved events:", error);
      }
    };

    fetchSavedEvents();
  }, []);



  const sortData = (data: Itinerary[], option: string): Itinerary[] => {
    let sortedData = [...data]; // Copy the array to avoid mutating the original data

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
        // No sorting; return data as is
        break;
    }

    return sortedData;
  };





  return (
    <>
      <section className="bd-tour-grid-area section-space">
        <div className="container">
          <div className="row gy-24">
            <div className="col-xxl-8 col-xl-8 col-lg-7">
              <div className="row gy-24">
              {savedItineraries.map((itinerary) => (
                  <TourSingleCard
                    tour={itinerary}
                    key={itinerary._id}
                    className="col-xxl-4 col-xl-6 col-lg-6 col-md-6"
                    tourWrapperClass="tour-wrapper style-one"
                    isparentClass={true}
                  />
                ))}
          {savedActivities.map((activity) => (
            <TourSingleCard2
              tour={activity}
              key={activity._id}
              className="col-xxl-4 col-xl-6 col-lg-6 col-md-6"
              tourWrapperClass="tour-wrapper style-one"
              isparentClass={true}
            />
          ))}


              </div>
            </div>
            <div className="col-xxl-4 col-xl-4 col-lg-5">
            {/* <ItinerariesSidebarMain applyFilters={applyFilters} applySearch={applySearch} /> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SavedEventsGrid;
