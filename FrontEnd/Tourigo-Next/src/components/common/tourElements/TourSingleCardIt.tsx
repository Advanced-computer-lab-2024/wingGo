// TourSingleCardIt.tsx

"use client";
import GetRatting from "@/hooks/GetRatting";
import { imageLoader } from "@/hooks/image-loader";
import useGlobalContext from "@/hooks/use-context";
import { Itinerary } from "@/interFace/interFace";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { toggleFlagItinerary } from '@/api/itineraryApi';

interface ItourPropsType {
  tour: Itinerary; // Use Itinerary type
  className: string;
  tourWrapperClass: string;
  isparentClass: boolean;
  isAdmin?: boolean; // Optional prop to check if the view is admin
}

const TourSingleCard = ({
  tour,
  className,
  tourWrapperClass,
  isparentClass,
  isAdmin = false,
}: ItourPropsType) => {
  const { setModalData } = useGlobalContext();
  const rating = tour.averageRating || 1; // Use Itinerary's averageRating, default to 1

  // Local state to keep track of the flagged status
  const [isFlagged, setIsFlagged] = useState(tour.flagged);

const handleFlagItinerary = async () => {
    try {
        // Toggle the flagged state in the backend
        await toggleFlagItinerary(tour._id, !isFlagged);

        // Update the local state to reflect the new flagged status
        setIsFlagged((prevFlagged) => !prevFlagged);
    } catch (error) {
        console.error("Error updating flagged status:", error);
    }
};

  return (
    <>
      {isparentClass ? (
        <div className={className}>
          <div className={tourWrapperClass}>
            <div className="p-relative">
              <div className="tour-thumb image-overly">
                <Link href={`/tour-details/${tour._id}`}>
                  <Image
                    src="/images/default-image.jpg" // Placeholder image
                    loader={imageLoader}
                    style={{ width: "100%", height: "auto" }}
                    alt="Itinerary Image"
                  />
                </Link>
              </div>
              <div className="tour-meta d-flex align-items-center justify-content-between">
                <button className="tour-favorite tour-like">
                  <i className="icon-heart"></i>
                </button>
                <div className="tour-location">
                  <span>
                    <Link href={`/tour-details/${tour._id}`}>
                      <i className="fa-regular fa-location-dot"></i>{" "}
                      {tour.locations[0] || "Location not available"}
                    </Link>
                  </span>
                </div>
              </div>
            </div>
            <div className="tour-content">
              <div className="tour-rating d-flex align-items-center gap-10 mb-10">
                <div className="tour-rating-icon fs-14 d-flex rating-color">
                  <GetRatting averageRating={rating} />
                </div>
                <div className="tour-rating-text">
                  <span>
                    {rating.toFixed(1)} ({tour.ratings.length} Ratings)
                  </span>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="tour-title fw-5 underline custom_mb-5">
                  <Link href={`/tour-details/${tour._id}`}>
                    {tour.title}
                  </Link>
                </h5>
                {isAdmin && (
                  <button
                    onClick={handleFlagItinerary}
                    className="flag-itinerary-button"
                    style={{
                      backgroundColor: isFlagged ? "green" : "red",
                      color: "white",
                      padding: "8px 16px",      // Adjust padding to make the button bigger
                      fontSize: "14px",          // Increase font size
                      borderRadius: "4px",       // Adjust border radius as desired
                      cursor: "pointer",
                    }}
                  >
                    {isFlagged ? "Unflag" : "Flag"}
                  </button>
                )}
              </div>
              <span className="tour-price b3">
                ${tour.price.toLocaleString("en-US")}
              </span>
              <div className="tour-divider"></div>

              <div className="tour-meta d-flex align-items-center justify-content-between">
                <div className="time d-flex align-items-center gap--5">
                  <i className="icon-heart"></i>
                  <span>{tour.duration}</span>
                </div>
                <div className="tour-btn">
                  <button
                    onClick={() => setModalData(tour)}
                    className="bd-text-btn style-two"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#popUpBookingForm"
                  >
                    Book Now
                    <span className="icon__box">
                      <i className="fa-regular fa-arrow-right-long icon__first"></i>
                      <i className="fa-regular fa-arrow-right-long icon__second"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Non-parent layout, adjust as needed
        <div className={tourWrapperClass}>
          {/* Non-parent layout logic can go here if needed */}
        </div>
      )}
    </>
  );
};

export default TourSingleCard;
