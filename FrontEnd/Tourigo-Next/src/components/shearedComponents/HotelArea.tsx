"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import tourImgFive from "../../../public/assets/images/tour/tour-img-5.png";
import { imageLoader } from "@/hooks/image-loader";
import { bookflight, searchFlights } from "@/api/FlightApi";
import { set } from "react-hook-form";
import { bookHotel, searchHotels } from "@/api/HotelApi";



interface HotelAreaProps {
    cityCode: string;
    searchTriggered: boolean;
    setSearchTriggered: (value: boolean) => void;
  }

const HotelArea: React.FC<HotelAreaProps> = ({
    cityCode,
    searchTriggered,
    setSearchTriggered
}) => {
  
  const [tripData, setTripData] = useState<any[]>([]);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await searchHotels({
            cityCode: cityCode,
        });
        const data = await response;
        setTripData(data);
        console.log('Trip data:', data);
      } catch (error) {
        console.error('Error fetching trip data:', error);
      }
    };

    if (searchTriggered && cityCode) {
        fetchTripData();
        setSearchTriggered(false);
    }
  }, [searchTriggered, cityCode]);


   const handleBookHotel = async (hotel: any) => {

        try {
          console.log('Booking hotel:', hotel);
          const response = await bookHotel(hotel);
          console.log('Booking response:', response);
    
          if(response.message === "Hotel booked successfully"){
            alert("Hotel booked successfully");
          }
          else{
            alert("Insufficient balance");
          }
        } catch (error) {
          console.error('Error booking hotel:', error);
        }
      }

  const handleItemClick = (item: any) => {
    console.log(item);
  };


  return (
    <>
      <div className="row gy-24">
        <div className="col-12">
          <h2>Total Hotels Found: {tripData.length}</h2> {/* Display the length of the array */}
        </div>
        {tripData &&
          tripData.map((item) => (
            <div key={item.id} className="col-xl-6 col-lg-6 col-md-6">
              <div className="trip-wrapper trip-style-one p-relative">
                <div className="trip-thumb image-overly">
                  <Link href="#">
                    <Image
                      src={tourImgFive}
                      loader={imageLoader}
                      style={{ width: "100%", height: "auto" }}
                      alt="image"
                    />
                  </Link>
                </div>
                <div className="trip-tag">
                  <div className="trip-number">
                    <span>
                    <Link href={`/destinations-details/${item?.id}`}>
                      {item.offers[0].guests.adults} Adults
                      </Link>
                    </span>
                  </div>
                  <div className="trip-location">
                    <span>
                      <Link href={`/destinations-details/${item?.id}`}>
                        {item.hotel.name}
                      </Link>
                    </span>
                  </div>
                  
                  <div className="col-lg-2 text-center" onClick={() => handleBookHotel(item)} style={{ position: 'absolute', bottom: '0px', right: '10px', width: '150px' }}>
                    <Link href="#" className="bd-switch-btn has-left w-100">
                      <div className="bd-switch-default">
                        <span>{item.offers[0].price.total + " $"}</span>
                      </div>
                      <div className="bd-switch-hover">
                        <span>Book Now</span>
                      </div>
                    </Link>
                   
                  </div>
                </div>
              </div>
            </div>
          ))}
        
      </div>
    </>
  );
};

export default HotelArea;
