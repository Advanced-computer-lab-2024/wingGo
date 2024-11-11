//TourDetails.tsx
"use client";
import { imageLoader } from "@/hooks/image-loader";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import TourDetailTabArea from "./TourDetailTabArea";
import { tourData } from "@/data/tour-data";
import { Place } from "@/interFace/interFace";
import { idTypeNew } from "@/interFace/interFace";
import TourSingleCard from "../common/tourElements/TourSingleCardPlaces";
import BookingFormModal from "@/elements/modals/BookingFormModal";
import { toast } from "react-toastify";

const TourDetails = ({ id }: idTypeNew) => {
  const [data, setData] = useState<Place | null>(null);
  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleEmailChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = async () => {
    try {
      if (data) {
        const response = await axios.post(`http://localhost:8000/tourist/sharePlaceViaEmail/${data._id}`, {
          email: email
        });
        if (response.status === 200) {
          toast.success('Email sent successfully!');
          setIsEmailFormOpen(false);
        }
      } else {
        toast.error('Place is not available.');
      }
    } catch (error) {
      toast.error('Error sending email');
    }
  };

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/govornor/getPlace/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching Place data:", error);
      }
    };

    fetchPlace();
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
                        src={data?.pictures[0]}
                        loader={imageLoader}
                        style={{ width: "100%", height: "auto" }}
                        alt="image"
                      />
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
                        {/* <div className="tour-details-price">
                          <h4 className="price-title">
                            ${data?.tourPrice}
                            <span>/Per Person</span>
                          </h4>
                        </div> */}
                        <div className="tour-details-meta-right d-flex flex-wrap gap-10 align-items-center justify-content-between">
                          {/* <div className="rating-badge border-badge">
                            <span>
                              <i className="icon-star"></i>
                              {data?.tourRating}
                            </span>
                          </div> */}
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
                            <button
                              className="bd-primary-btn btn-style radius-60"
                              onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success("Link copied to clipboard!");
                              }}
                            >
                              <span className="bd-primary-btn-text">Share Link</span>
                              <span className="bd-primary-btn-circle">
                                <i className="fa fa-share" />
                              </span>
                            </button>
                            <button
                              className="bd-primary-btn btn-style radius-60"
                              onClick={() => setIsEmailFormOpen(!isEmailFormOpen)}
                            >
                              Share Via Email
                            </button>
                          </div>
                        </div>
                        {isEmailFormOpen && (
                            <div className="email-form">
                              <h3>Share Place Via Email</h3>
                              <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                  type="email"
                                  id="email"
                                  name="email"
                                  value={email}
                                  onChange={handleEmailChange}
                                  className="form-control"
                                />
                              </div>
                              <button onClick={handleSendEmail} className="bd-primary-btn btn-style radius-60">
                                Send Email
                              </button>
                            </div>
                          )}
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
                              Opening Hours
                            </p>
                            <span className="tour-details-destination-info-bottom small">
                              {data?.openingHours}
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
                        <h4 className="mb-20">Related Places</h4>
                        {/* <div className="row gy-24">
                          {tourDetailsData?.map((item) => (
                            <TourSingleCard
                              key={item?.id}
                              tour={item}
                              className="col-xxl-4 col-xl-4 col-md-6"
                              tourWrapperClass="tour-wrapper style-one"
                              isparentClass={true}
                            />
                          ))}
                        </div> */}
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
