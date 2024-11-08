// TourDetailTabArea.tsx
"use client";
import { imageLoader } from "@/hooks/image-loader";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import tourImgNine from "../../../public/assets/images/tour/tour-img-9.png";
import tourImgTwentyOne from "../../../public/assets/images/tour/tour-img-21.png";
import tourImgTwentyTwo from "../../../public/assets/images/tour/tour-img-22.png";
import { clientReviewData } from "@/data/client-review-data";
import TourDetailsPostForm from "./TourDetailsPostFrom/TourDetailsPostForm";
import { Itinerary } from '@/interFace/interFace';

interface TourDetailTabAreaProps {
  itineraryData: Itinerary;
}


// Function to format date into readable string
// Function to format date into a readable string
const formatDate = (date: string | Date) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return dateObj.toLocaleDateString(undefined, options);
};




const TourDetailTabArea: React.FC<TourDetailTabAreaProps> = ({ itineraryData }) => {
  return (
    <>
      <div className="tour-details-nav-tabs mb-35">
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              className="nav-link active"
              id="nav-overview-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-overview"
              type="button"
              role="tab"
              aria-controls="nav-overview"
              aria-selected="true"
            >
              Overview
            </button>
            <button
              className="nav-link"
              id="nav-gallery-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-gallery"
              type="button"
              role="tab"
              aria-controls="nav-gallery"
              aria-selected="false"
              tabIndex={-1}
            >
              Gallery
            </button>
            <button
              className="nav-link"
              id="nav-feedback-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-feedback"
              type="button"
              role="tab"
              aria-controls="nav-feedback"
              aria-selected="false"
              tabIndex={-1}
            >
              Feedback
            </button>
          </div>
        </nav>
        <div className="tab-content mt-25" id="nav-tabContent">
          <div
            className="tab-pane fade active show"
            id="nav-overview"
            role="tabpanel"
            aria-labelledby="nav-overview-tab"
            tabIndex={0}
          >
            <p className="mb-15">
              <strong>Language:</strong> {itineraryData.language}
            </p>
            <p className="mb-15">
              <strong>Available Dates:</strong>{" "}
              {itineraryData.availableDates.map((date, index) => (
                <span key={index}>{formatDate(date)}{index < itineraryData.availableDates.length - 1 ? ", " : ""}</span>
              ))}
            </p>
            <p className="mb-15">
              <strong>Pickup Location:</strong> {itineraryData.pickupLocation}
            </p>
            <p className="mb-15">
              <strong>Dropoff Location:</strong> {itineraryData.dropoffLocation}
            </p>

            <div className="tour-details-faq mb-35">
              <h4 className="mb-20">Tour Plan</h4>
              <div className="accordion-wrapper faq-style-3">
                <div className="accordion" id="accordionExampleThree">
                  <div className="accordion-item">
                    <h6 className="accordion-header" id="headingNine">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseNine"
                        aria-expanded="true"
                        aria-controls="collapseNine"
                      >
                        <span>Day 01:</span> Arrival and Exploration
                      </button>
                    </h6>
                    <div
                      id="collapseNine"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingNine"
                      data-bs-parent="#accordionExampleThree"
                    >
                      <div className="accordion-body">
                        Arrive at your destination and check into your
                        accommodation. Lorem ipsum dolor sit amet consectetur
                        adipiscing elit Ut et massa mi. Aliquam hendrerit urna.
                        Pellentesque sit amet sapien fringilla, mattis ligula
                        consectetur, ultrices Maecenas.
                        <div className="accordion-body-list">
                          <ul>
                            <li>Morning: Arrival and Check-in</li>
                            <li>Afternoon: City Tour or Landmarks Visit</li>
                            <li>Evening: Local Cuisine Experience</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Additional days can be added similarly */}
                </div>
              </div>
            </div>
          </div>
          {/* Gallery Tab */}
          <div
            className="tab-pane fade"
            id="nav-gallery"
            role="tabpanel"
            aria-labelledby="nav-gallery-tab"
            tabIndex={0}
          >
            <div className="tour-details-gallery mb-35">
              <h4 className="mb-20">Tour Gallery</h4>
              <div className="row gy-24">
                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
                  <div className="tour-details-gallery-thumb image-hover-effect-two position-relative">
                    <Image
                      src={tourImgTwentyOne}
                      loader={imageLoader}
                      style={{ width: "100%", height: "auto" }}
                      alt="image"
                    />
                  </div>
                </div>
                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
                  <div className="row gy-24">
                    <div className="col-xxl-12">
                      <div className="tour-details-gallery-thumb image-hover-effect-two position-relative">
                        <Image
                          src={tourImgTwentyTwo}
                          loader={imageLoader}
                          style={{ width: "100%", height: "auto" }}
                          alt="image"
                        />
                      </div>
                    </div>
                    <div className="col-xxl-12">
                      <div className="tour-details-gallery-thumb image-hover-effect-two position-relative">
                        <Image
                          src={tourImgNine}
                          loader={imageLoader}
                          style={{ width: "100%", height: "auto" }}
                          alt="image"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Feedback Tab */}
          <div
            className="tab-pane fade"
            id="nav-feedback"
            role="tabpanel"
            aria-labelledby="nav-feedback-tab"
            tabIndex={0}
          >
            <div className="tour-details-rating-wrapper mb-35">
              <div className="row gy-24 align-items-center">
                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4">
                  <div className="rating-box">
                    <div className="inner">
                      <div className="rating-number">5.0</div>
                      <div className="rating">
                        <Link href="#">
                          <i className="fa fa-star"></i>
                        </Link>
                        <Link href="#">
                          <i className="fa fa-star"></i>
                        </Link>
                        <Link href="#">
                          <i className="fa fa-star"></i>
                        </Link>
                        <Link href="#">
                          <i className="fa fa-star"></i>
                        </Link>
                        <Link href="#">
                          <i className="fa fa-star"></i>
                        </Link>
                      </div>
                      <span className="sub-title">(234 Review)</span>
                    </div>
                  </div>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                  <div className="review-wrapper">
                    <div className="single-progress-bar">
                      <div className="rating-text">5</div>
                      <div className="progress">
                        <div
                          className="progress-bar bg-1"
                          role="progressbar"
                          style={{ width: "82%" }}
                          aria-valuenow={63}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                      <span className="value-text">82%</span>
                      <span className="number">212</span>
                    </div>
                    {/* More progress bars for other ratings */}
                  </div>
                </div>
              </div>
            </div>
            <TourDetailsPostForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default TourDetailTabArea;
