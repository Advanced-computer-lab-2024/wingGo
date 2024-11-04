// TourGridRight.tsx

"use client";
import React, { useEffect, useState } from "react";
import SidebarSearchArea from "../shearedComponents/SidebarSearchArea";
import PaginationWrapper from "../shearedComponents/PaginationWrapper";
import TourSingleCard from "../common/tourElements/TourSingleCardIt";
import { Itinerary } from "@/interFace/interFace";
import { getItinerariesData } from "@/data/it-data";
import BookingFormModal from "@/elements/modals/BookingFormModal";

const TourGridRight = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);

  useEffect(() => {
    const fetchItineraries = async () => {
      const data = await getItinerariesData();
      setItineraries(data);
    };
    fetchItineraries();
  }, []);

  console.log("its "+itineraries.length);
  return (
    <>
      <section className="bd-tour-grid-area section-space">
        <div className="container">
          <div className="row gy-24">
            <div className="col-xxl-8 col-xl-8 col-lg-7">
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
              <SidebarSearchArea placeHolderTextData="Tour Place" />
            </div>
          </div>
          <PaginationWrapper />
        </div>
      </section>
      <BookingFormModal />
    </>
  );
};

export default TourGridRight;
