"use client";
import { imageLoader } from "@/hooks/image-loader";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TourDetailTabArea from "./TourDetailTabArea";
import { getActivitiesData } from "@/data/act-data";
import { idTypeNew } from "@/interFace/interFace";
import { Activity } from "@/interFace/interFace";
import TourSingleCard from "../common/tourElements/ActivitySingleCard";
import BookingFormModal from "@/elements/modals/BookingFormModal";

const TourDetails = ({ id }: idTypeNew) => {
  const [data, setData] = useState<Activity | null>(null);
  const [activity,setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const activities = await getActivitiesData();
        const activity = activities.find((item) => item._id === id);
        setData(activity || null);

        // Assuming related tours can be the rest of the activities
        setActivities(activities.filter((item) => item._id !== id));
      } catch (err) {
        setError("Error loading tour details.");
        console.error("Error fetching activities:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>Tour not found.</div>;

  
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
                      {data.name}
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
                    <TourDetailTabArea activityData={data} />

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
