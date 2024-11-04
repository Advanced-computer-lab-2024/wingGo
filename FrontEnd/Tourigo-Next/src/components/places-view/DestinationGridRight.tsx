"use client";
import React, { useEffect, useState } from "react";
import SidebarSearchArea from "../shearedComponents/SidebarSearchArea";
import PaginationWrapperTwo from "../shearedComponents/PaginationWrapperTwo";
import PlaceElement from "../common/tourElements/TourSingleCardPlaces"; 
import { Place } from "@/interFace/interFace";
import { getPlacesData } from "@/data/placeData"; 

const DestinationGridRight = () => {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    // Fetch updated place data
    const fetchPlaces = async () => {
      const data = await getPlacesData(); // Update function name if API route or logic changed
      setPlaces(data);
    };
    fetchPlaces();
  }, []);

  console.log("Number of places: " + places.length);

  return (
    <div className="bd-blog-grid-area section-space">
      <div className="container">
        <div className="row gy-24">
          {/* Main content area */}
          <div className="col-xxl-8 col-xl-8 col-lg-7">
            <div className="row gy-24">
              {places.map((place) => (
                <div
                  key={place._id}
                  className="col-xxl-4 col-xl-6 col-lg-6 col-md-6"
                >
                  {/* Render PlaceElement with each place */}
                  <PlaceElement
                    item={place}
                    wrapperClass="place-wrapper style-one"
                  />
                </div>
              ))}
            </div>
            {/* Pagination component */}
            <PaginationWrapperTwo />
          </div>
          {/* Sidebar with search functionality */}
          <div className="col-xxl-4 col-xl-4 col-lg-5">
            <SidebarSearchArea placeHolderTextData="Destination" />
          </div>
        </div>
      </div>
    </div>
  );
};


export default DestinationGridRight;
