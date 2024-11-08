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
                      {/* <Image
                        src={data?.img}
                        loader={imageLoader}
                        style={{ width: "100%", height: "auto" }}
                        alt="image"
                      /> */}
                    </div>
                    <div className="tour-details-content">
                      <div className="tour-details-badge d-flex gap--5 mb-10">
                        <span className="bd-badge warning fw-5">Featured</span>
                        <span className="bd-badge danger fw-5">15% Off</span>
                      </div>
                      <h3 className="tour-details-title mb-15">
                        {data?.name}
                      </h3>
                      <div className="tour-details-meta d-flex flex-wrap gap-10 align-items-center justify-content-between mb-20">
                        <div className="tour-details-price">
                          <h4 className="price-title">
                            ${data?.price}
                            <span>/Per Person</span>
                          </h4>
                        </div>
                        <div className="tour-details-meta-right d-flex flex-wrap gap-10 align-items-center justify-content-between">
                          <div className="rating-badge border-badge">
                            <span>
                              <i className="icon-star"></i>
                              {data?.averageRating}
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
                      <div className="tour-details-destination-wrapper">
                        <div className="tour-details-destination-info">
                          <div className="search-icon-bg is-big">
                            <span>
                              <i className="fa-light fa-clock"></i>
                            </span>
                          </div>
                          <div className="tour-details-destination-info-title">
                            <p className="tour-details-destination-info-top mb-0">
                              Duration
                            </p>
                            <span className="tour-details-destination-info-bottom small">
                              {data?.time}
                            </span>
                          </div>
                        </div>
                        <div className="tour-details-destination-info">
                          <div className="search-icon-bg is-big">
                            <span>
                              <i className="icon-hourglass"></i>
                            </span>
                          </div>
                          <div className="tour-details-destination-info-title">
                            <p className="tour-details-destination-info-top mb-0">
                              Min Age
                            </p>
                            <span className="tour-details-destination-info-bottom small">
                              10 Years+
                            </span>
                          </div>
                        </div>
                        <div className="tour-details-destination-info">
                          <div className="search-icon-bg is-big">
                            <span>
                              <i className="fa-sharp fa-light fa-moped"></i>
                            </span>
                          </div>
                          <div className="tour-details-destination-info-title">
                            <p className="tour-details-destination-info-top mb-0">
                              Tour Type
                            </p>
                            <span className="tour-details-destination-info-bottom small">
                              Adventure, Foodie
                            </span>
                          </div>
                        </div>
                        <div className="tour-details-destination-info">
                          <div className="search-icon-bg is-big">
                            <span>
                              <i className="fa-light fa-location-dot"></i>
                            </span>
                          </div>
                          <div className="tour-details-destination-info-title">
                            <p className="tour-details-destination-info-top mb-0">
                              Location
                            </p>
                            <span className="tour-details-destination-info-bottom">
                              Brasov, Romania
                            </span>
                          </div>
                        </div>
                      </div>
                      {/*tab area start*/}
                      <TourDetailTabArea />
                      {/*tab area end*/}
                      {/*tour area start*/}
                      <div className="tour-details-related-tour mb-35">
                        <h4 className="mb-20">Related Tour</h4>
                        <div className="row gy-24">
                          {activity?.map((item) => (
                            <TourSingleCard
                              key={item?._id}
                              tour={item}
                              className="col-xxl-4 col-xl-4 col-md-6"
                              tourWrapperClass="tour-wrapper style-one"
                              isparentClass={true}
                            />
                          ))}
                        </div>
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
