import { imageLoader } from "@/hooks/image-loader";
import { Place } from "@/interFace/interFace";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface IPlacePropsType {
  item: Place;
  wrapperClass?: string;
}

const PlaceElement = ({ item, wrapperClass }: IPlacePropsType) => {
  return (
    <>
      <div
        className={
          wrapperClass ? wrapperClass : "activity-wrapper activity-style-three"
        }
      >
        {/* Thumbnail Section */}
        <div className="p-relative">
          <div className="activity-thumb image-overly">
            <Link href={`/places-details/${item._id}`}>
              <Image
                src={item.pictures[0]}
                loader={imageLoader}
                style={{ width: "100%", height: "auto" }}
                alt="Place Image"
              />
            </Link>
          </div>

          {/* Location Meta Section */}
          <div className="tour-meta d-flex align-items-center justify-content-between">
            <button className="tour-favorite tour-like">
              <i className="icon-heart"></i>
            </button>
            <div className="tour-location">
              <span>
                <Link href={`/places-details/${item._id}`}>
                  <i className="fa-regular fa-location-dot"></i> {item.location || "Location not available"}
                </Link>
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="activity-content-wrap text-center">
          {/* Rating */}
          <div className="tour-rating d-flex align-items-center gap-10 mb-10">
            <div className="tour-rating-icon fs-14 d-flex rating-color">
              {/* Assuming there's a rating in Place, use a similar rating component */}
              {/* Placeholder rating */}
              <span>⭐ 4.5</span>
            </div>
            <div className="tour-rating-text">
              <span>4.5 (20 Ratings)</span>
            </div>
          </div>

          {/* Place Name */}
          <h6 className="tour-title fw-5 underline custom_mb-5">
            <Link href={`/places-details/${item._id}`}>
              {item.name}
            </Link>
          </h6>

          {/* Book Now Button */}
          <div className="tour-btn">
            <Link href={`/places-details/${item._id}`} className="bd-text-btn style-two">
              View Details
              <span className="icon__box">
                <i className="fa-regular fa-arrow-right-long icon__first"></i>
                <i className="fa-regular fa-arrow-right-long icon__second"></i>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceElement;
