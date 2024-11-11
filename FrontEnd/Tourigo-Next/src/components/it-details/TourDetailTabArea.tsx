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
import { Itinerary, TourGuide } from '@/interFace/interFace';
import GetRatting from "@/hooks/GetRatting";

interface TourDetailTabAreaProps {
  itineraryData: Itinerary;
  tourGuideData: TourGuide;
}



// Function to format date into readable string
// Function to format date into a readable string
const formatDate = (date: string | Date) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return dateObj.toLocaleDateString(undefined, options);
};




const TourDetailTabArea: React.FC<TourDetailTabAreaProps> = ({ itineraryData, tourGuideData }) => {
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

            {/* <p className="mb-15">
              <strong>Tourguide Rating:</strong> {tourGuideData.averageRating}
            </p> */}
            <div className="tour-details-meta">
        <h4>Tour Guide Rating & Reviews</h4>
        <div className="rating-badge">
          <span>
            <i className="icon-star"></i>
            {tourGuideData.averageRating} ({tourGuideData.ratings.length} Reviews)
          </span>
        </div>
        <div className="review-wrapper">
          {tourGuideData.comment.map((comment, index) => (
            <div key={index} className="single-review">
              <p>{comment.text}</p>
              {/* <span>- Tourist ID: {comment.tourist}</span> */}
            </div>
          ))}
        </div>
      </div>
            

            <div className="tour-details-faq mb-35">
  <h4 className="mb-20">Available Activities</h4>
  <div className="accordion-wrapper faq-style-3">
    <div className="accordion" id="accordionExampleThree">
      {itineraryData.activities.split(',').map((activity, index) => (
        <div className="accordion-item" key={index}>
          <h6 className="accordion-header" id={`heading${index}`}>
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse${index}`}
              aria-expanded="true"
              aria-controls={`collapse${index}`}
            >
              <span>Activity {index + 1}:</span> {activity.trim()}
            </button>
          </h6>
          <div
            id={`collapse${index}`}
            className="accordion-collapse collapse"
            aria-labelledby={`heading${index}`}
            data-bs-parent="#accordionExampleThree"
          >
            
          </div>
        </div>
      ))}
    </div>
  </div>
  <style jsx>{`
  /* Hide the default Bootstrap accordion arrow */
  .accordion-button::after {
    display: none;
  }
`}</style>

</div>



          </div>
          {/* Gallery Tab */}
         
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
          {/* Display the average rating rounded to one decimal place */}
          <div className="rating-number">
            {itineraryData.averageRating.toFixed(1)}
          </div>
          <div className="rating">      
        <GetRatting averageRating={itineraryData.averageRating} />
      </div>

          <span className="sub-title">
            ({itineraryData.comment.length} {itineraryData.comment.length === 1 ? "Review" : "Reviews"})
          </span>
        </div>
      </div>
    </div>
    <div className="col-lg-10 col-md-8 col-sm-7">
                <div className="review-wrapper">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = itineraryData.ratings.filter((rating) => rating === star).length;
                    const percentage = itineraryData.ratings.length
                      ? ((count / itineraryData.ratings.length) * 100).toFixed(1)
                      : 0;
                    return (
                      <div className="single-progress-bar" key={star}>
                      <div className="rating-text">{star}</div>
                      <div className="progress">
                        <div
                          className={`progress-bar progress-bar-${star}`}
                          role="progressbar"
                          style={{ width: `${percentage}%` }}
                          aria-valuenow={Number(percentage)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                      <span className="value-text">{percentage}%</span>
                      <span className="number">{count}</span>
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <style jsx>{`
              .rating-box .fa-star.filled {
                color: #ffd700; /* Gold color for filled stars */
              }
                .progress-bar-5 {
                  background-color: #4CAF50; /* Green */
                }
                .progress-bar-4 {
                  background-color: #8BC34A; /* Light Green */
                }
                .progress-bar-3 {
                  background-color: #FFC107; /* Amber */
                }
                .progress-bar-2 {
                  background-color: #FF9800; /* Orange */
                }
                .progress-bar-1 {
                  background-color: #F44336; /* Red */
                }
            `}</style>
          </div>

             <TourDetailsPostForm itineraryData={itineraryData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default TourDetailTabArea;
