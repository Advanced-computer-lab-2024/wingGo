// TourDetails.tsx
"use client";
import { imageLoader } from "@/hooks/image-loader";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TourDetailTabArea from "./TourDetailTabArea";
import { idTypeNew } from "@/interFace/interFace";
import { Itinerary, TourGuide } from "@/interFace/interFace";
import axios from "axios";
import TourSingleCard from "../common/tourElements/TourSingleCardIt";
import BookingFormModal from "@/elements/modals/BookingFormModal";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { isItineraryBooked, fetchTourGuideRatings } from "@/api/itineraryApi"; // Import the booking status function
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling
import { ToastContainer, toast } from "react-toastify";
import { useCurrency } from "@/contextApi/CurrencyContext"; // Import useCurrency



const TourDetails = ({ id }: idTypeNew) => {
  const [data, setData] = useState<Itinerary | null>(null);
  const [isBooked, setIsBooked] = useState(false); // State for booking status
  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { currency, convertAmount } = useCurrency(); // Access currency and conversion function
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null);
  const [tourGuide, setTourGuide] = useState<TourGuide | null>(null);



  const handleEmailChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = async () => {
    try {
      if (data) {
        const response = await axios.post(`http://localhost:8000/tourist/shareItineraryViaEmail/${data._id}`, {
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
    const fetchItinerary = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/tourguide/getitinerary/${id}`);
        setData(response.data);
        

        // Fetch the tour guide ratings and comments if tourGuideId is available
        if (response.data.tourGuideId) {
          const tourGuideData = await fetchTourGuideRatings(response.data.tourGuideId);
          setTourGuide(tourGuideData);
          console.log(tourGuideData);
        }

        // Check if the itinerary is booked
        const bookedStatus = await isItineraryBooked(id);
        setIsBooked(bookedStatus);

        // Convert the itinerary price
        if (response.data.price) {
          const priceInSelectedCurrency = await convertAmount(response.data.price);
          setConvertedPrice(priceInSelectedCurrency);
        }
      } catch (error) {
        console.error("Error fetching itinerary data:", error);
      }
    };

    fetchItinerary();
  }, [id, currency, convertAmount]); 

  const router = useRouter(); // Initialize router

  const handleBookNowClick = () => {
    router.push(`/booking-it/${id}`);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <section className="bd-tour-details-area section-space">
        {data?._id && tourGuide?._id && (
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
                                <h3>Share Itenirary Via Email</h3>
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
                      <TourDetailTabArea itineraryData={data} tourGuideData={tourGuide}/>

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
      <ToastContainer />
    </>
  );
};

export default TourDetails;
