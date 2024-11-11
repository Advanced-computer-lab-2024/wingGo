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
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { isActivityBooked } from "@/api/activityApi"; 
import { toast } from "react-toastify";
import axios from "axios";
import { useCurrency } from "@/contextApi/CurrencyContext"; // Import the currency context


const TourDetails = ({ id }: idTypeNew) => {
  const [data, setData] = useState<Activity | null>(null);
  const [activity,setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false); // State for booking status

  const router = useRouter(); // Initialize router
  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { currency, convertAmount } = useCurrency(); // Access currency and conversion function
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null); // Converted price state


  const handleEmailChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = async () => {
    try {
      if (data) {
        const response = await axios.post(`http://localhost:8000/tourist/shareActivityViaEmail/${data._id}`, {
          email: email
        });
        if (response.status === 200) {
          toast.success('Email sent successfully!');
          setIsEmailFormOpen(false);
        }
      } else {
        toast.error('Product item is not available.');
      }
    } catch (error) {
      toast.error('Error sending email');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activities = await getActivitiesData();
        const activity = activities.find((item) => item._id === id);
        setData(activity || null);

        // Assuming related tours can be the rest of the activities
        setActivities(activities.filter((item) => item._id !== id));

        if (activity) {
          // Check if the activity is booked
          const bookedStatus = await isActivityBooked(activity._id);
          setIsBooked(bookedStatus);

          // Convert the activity price to selected currency
          if (activity.price) {
            const priceInSelectedCurrency = await convertAmount(activity.price);
            setConvertedPrice(priceInSelectedCurrency);
          }
        }
      } catch (err) {
        setError("Error loading tour details.");
        console.error("Error fetching activities:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, currency, convertAmount]); // Add currency and convertAmount to dependency array


  const handleBookNowClick = () => {
    router.push(`/booking-activity/${id}`);
  };

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
                            {currency}{" "}
                            {convertedPrice !== null
                              ? convertedPrice.toFixed(2)
                              : data.price.toFixed(2)}
                            <span>/Per Person</span>
                          </h4>
                        <br/><br/>
                          <div className="row gy-24 "  style={{ paddingLeft: '10px'}}   >
                         <button
                              onClick={isBooked ? undefined : handleBookNowClick} // Disable click if booked
                              className="bd-gradient-btn btn-style radius-60 btn-tertiary"
                              style={{
                                padding: '6px 12px',
                                fontSize: '14px',
                                borderRadius: '20px',
                                float: 'right',
                                paddingRight: '10px',
                                marginRight: '20px',
                                width: '150px',
                                textAlign: 'center',
                                opacity: isBooked ? 0.6 : 1, // Dim button if booked
                                cursor: isBooked ? "not-allowed" : "pointer"

                              }}
                            >
                              {isBooked ? "Booked!" : "Book Now"}
                            </button> 
                        </div> 

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
                            {isEmailFormOpen && (
                              <div className="email-form">
                                <h3>Share Activity Via Email</h3>
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
