"use client";

import React, { useEffect, useState } from "react";
import { Transport } from "@/interFace/interFace";
import { getTransportsData, bookTransport } from "@/data/transport-data";
import { useCurrency } from "@/contextApi/CurrencyContext"; // Import currency context
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TourDetailsProps {
  id: string;
}

const TourDetails: React.FC<TourDetailsProps> = ({ id }) => {
  const [transport, setTransport] = useState<Transport | null>(null);
  const { currency, convertAmount } = useCurrency();
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null);
  const [isBooked, setIsBooked] = useState<boolean>(false);

  useEffect(() => {
    const fetchTransportDetails = async () => {
      try {
        const transports = await getTransportsData();
        const selectedTransport = transports.find((t) => t._id === id);
        setTransport(selectedTransport || null);

        if (selectedTransport) {
          const priceInSelectedCurrency = await convertAmount(selectedTransport.price);
          setConvertedPrice(priceInSelectedCurrency);
        }
      } catch (error) {
        console.error("Error fetching transport details:", error);
      }
    };

    fetchTransportDetails();
  }, [id, convertAmount]);

  const handleBookNowClick = async () => {
    try {
      if (transport) {
        await bookTransport(transport._id);
        setIsBooked(true);
        toast.success("Transport booked successfully!");
      }
    } catch (error) {
      console.error("Error booking transport:", error);
      if (error instanceof Error) {
        toast.error("Error booking transport: " + error.message);
      } else {
        toast.error("Error booking transport");
      }
    }
  };

  if (!transport) {
    return <p>Loading...</p>;
  }

  return (
    <section className="bd-tour-details-area section-space">
      <div className="container">
        <div className="row gy-24">
          <div className="col-xxl-8 col-xl-8 col-lg-7">
            <div className="tour-details-wrapper">
              <div className="tour-details-content">
                <h2 className="tour-details-title">{transport.type}</h2>
                <p className="tour-details-description">{transport.city}</p>
                <div className="tour-details-price mb-10">
                  <h4 className="tour-details-ammount">
                    {currency}{" "}
                    {convertedPrice !== null
                      ? convertedPrice.toFixed(2)
                      : transport.price.toLocaleString("en-US")}
                  </h4>
                </div>
                <div className="tour-details-info mb-10">
                  <p>Duration:</p>
                  <span>{transport.duration}</span>
                </div>
                <div className="tour-details-info mb-10">
                  <p>City:</p>
                  <span>{transport.city}</span>
                </div>
                <button
                  className="bd-primary-btn btn-style radius-60"
                  onClick={handleBookNowClick}
                  disabled={isBooked}
                >
                  {isBooked ? "Booked" : "Book Now"}
                </button>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-4 col-lg-5">
            {/* Sidebar or additional content can go here */}
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default TourDetails;