// TourDetails.tsx
"use client";
import { imageLoader } from "@/hooks/image-loader";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TourDetailTabArea from "./TourDetailTabArea";
import { idTypeNew } from "@/interFace/interFace";
import { Itinerary } from "@/interFace/interFace";
import axios from "axios";
import TourSingleCard from "../common/tourElements/TourSingleCardIt";
import BookingFormModal from "@/elements/modals/BookingFormModal";

const TourDetails = ({ id }: idTypeNew) => {
  const [data, setData] = useState<Itinerary | null>(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/tourguide/getitinerary/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching itinerary data:", error);
      }
    };

    fetchItinerary();
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <section className="bd-tour-details-area section-space">
        {data?._id && (
          <div className="container">
            <div className="row gy-24 justify-content-center">
              <div className="col-xxl-12 col-xl-12 col-lg-12">
                <div className="tour-details-wrapper">
                  <div className="tour-details mb-25">
                    <div className="tour-details-thumb details-slide-full mb-30">
                      <Image
                        src="/images/default-image.jpg" // Placeholder image
                        loader={imageLoader}
                        style={{ width: "100%", height: "auto" }}
                        alt="Itinerary Image"
                      />
                    </div>
                    <div className="tour-details-content">
                      <h3 className="tour-details-title mb-15">
                        {data.title}
                      </h3>
                      <div className="tour-details-meta d-flex flex-wrap gap-10 align-items-center justify-content-between mb-20">
                        <div className="tour-details-price">
                          <h4 className="price-title">
                            ${data.price}
                            <span>/Per Person</span>
                          </h4>
                        </div>
                        <div className="tour-details-meta-right d-flex flex-wrap gap-10 align-items-center justify-content-between">
                          <div className="rating-badge border-badge">
                            <span>
                              <i className="icon-star"></i>
                              {data.averageRating ? data.averageRating.toFixed(1) : 0}
                            </span>
                          </div>
                          <div className="theme-social">
                            <Link href="https://www.facebook.com/">
                              <i className="icon-facebook"></i>
                            </Link>
                            <Link href="https://www.twitter.com/">
                              <i className="icon-twitter-x"></i>
                            </Link>
                            <Link href="https://www.linkedin.com/">
                              <i className="icon-linkedin"></i>
                            </Link>
                            <Link href="https://www.youtube.com/">
                              <i className="icon-youtube"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                      {/* Include more fields as necessary */}
                      <TourDetailTabArea itineraryData={data} />

                      <div className="tour-details-related-tour mb-35">
                        {/* <h4 className="mb-20">Related Tours</h4> */}
                        {/* You can replace this with actual related itineraries if available */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      <BookingFormModal />
    </>
  );
};

export default TourDetails;
