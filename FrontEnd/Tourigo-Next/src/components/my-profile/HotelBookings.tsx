"use client";

import React, { useEffect, useState } from "react";
import { searchHotelsByUserId } from "@/api/HotelApi";
import { format } from 'date-fns';

interface HotelBooking {
  _id: string;
  hotel: {
    name: string;
    address?: string;
  };
  city: string;
  checkInDate: string;
  checkOutDate: string;
  guests: {
    adults: number;
  }
  price: {
    base: number;
    currency: string;
    total: number;
    taxes: {
      amount: number;
      code: string;
      included: boolean;
    }[];
  };
  bookingStatus: string;
  confirmationNumber?: string;
}

interface HotelBookingsProps {
  id: string;
}

const HotelBookings: React.FC<HotelBookingsProps> = ({ id }) => {
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHotelBookings = async () => {
      try {
        const bookings = await searchHotelsByUserId(id);
        console.log("Fetched bookings:", bookings); // Debugging step
        setHotelBookings(bookings);
      } catch (error) {
        console.error("Error fetching hotel bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelBookings();
  }, [id]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd');
  };

  const formatPrice = (price: { base: number; currency: string; total: number; taxes: { amount: number; code: string; included: boolean; }[] }) => {
    return `${price.total} ${price.currency}`;
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (hotelBookings.length === 0) {
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
                  <h2 className="team-single-title">Hotel Bookings</h2>
                </div>
                <div className="team-info mb-20">
                  <h4 className="mb-15">Bookings:</h4>
                  <ul>
                    {hotelBookings.map((booking) => (
                      <li key={booking._id}>
                        <span className="team-label">Hotel Name: </span>
                        {booking.hotel.name}
                        <br />
                        <span className="team-label">Beds: </span> 
                        {booking.guests.adults}
                        <br />
                        <span className="team-label">Check-In Date: </span>
                        {formatDate(booking.checkInDate)}
                        <br />
                        <span className="team-label">Check-Out Date: </span>
                        {formatDate(booking.checkOutDate)}
                        <br />
                        <span className="team-label">Booking Status: </span>
                        {booking.bookingStatus}
                        <br />
                        <span className="team-label">Confirmation Number: </span>
                        {booking.confirmationNumber || "N/A"}
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

export default HotelBookings;