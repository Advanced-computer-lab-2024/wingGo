"use client";

import React, { useEffect, useState } from "react";
import { searchFlightsByUserId } from "@/api/FlightApi";
import { format } from 'date-fns';

interface FlightBooking {
  _id: string;
  flightId: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  duration: string;
  price: {
    currency: string;
    total: string;
  };
  airline: string;
  flightNumber: string;
  createdAt: string;
}

interface FlightBookingsProps {
  id: string;
}

const FlightBookings: React.FC<FlightBookingsProps> = ({ id }) => {
  const [flightBookings, setFlightBookings] = useState<FlightBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFlightBookings = async () => {
      try {
        const bookings = await searchFlightsByUserId(id);
        console.log("Fetched bookings:", bookings); // Debugging step
        setFlightBookings(bookings);
      } catch (error) {
        console.error("Error fetching flight bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlightBookings();
  }, [id]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd');
  };

  const formatPrice = (price: { currency: string; total: string }) => {
    return `${price.total} ${price.currency}`;
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (flightBookings.length === 0) {
    return <h1>No bookings found.</h1>;
  }

  return (
    <section className="bd-team-details-area section-space position-relative">
      <div className="container">
        <div className="row justify-content-between gy-24">
          <div className="col-xxl-9 col-xl-7 col-lg-7 col-md-7">
            <div className="team-single-wrapper">
              <div className="team-contents mb-30">
                <div className="team-heading mb-15">
                  <h2 className="team-single-title">Flight Bookings</h2>
                </div>
                <div className="team-info mb-20">
                  <h4 className="mb-15">Bookings:</h4>
                  <ul className="booking-list">
                    {flightBookings.map((booking) => (
                      <li key={booking._id} className="booking-item">
                        <div className="booking-details">
                          <span className="team-label">Flight ID: </span>
                          {booking.flightId}
                        </div>
                        <div className="booking-details">
                          <span className="team-label">Origin: </span>
                          {booking.origin}
                        </div>
                        <div className="booking-details">
                          <span className="team-label">Destination: </span>
                          {booking.destination}
                        </div>
                        <div className="booking-details">
                          <span className="team-label">Departure Date: </span>
                          {formatDate(booking.departureDate)}
                        </div>
                        <div className="booking-details">
                          <span className="team-label">Arrival Date: </span>
                          {formatDate(booking.arrivalDate)}
                        </div>
                        <div className="booking-details">
                          <span className="team-label">Duration: </span>
                          {booking.duration}
                        </div>
                        <div className="booking-details">
                          <span className="team-label">Price: </span>
                          {formatPrice(booking.price)}
                        </div>
                        <div className="booking-details">
                          <span className="team-label">Airline: </span>
                          {booking.airline}
                        </div>
                        <div className="booking-details">
                          <span className="team-label">Flight Number: </span>
                          {booking.flightNumber}
                        </div>
                        <div className="booking-details">
                          <span className="team-label">Booking Date: </span>
                          {formatDate(booking.createdAt)}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlightBookings;