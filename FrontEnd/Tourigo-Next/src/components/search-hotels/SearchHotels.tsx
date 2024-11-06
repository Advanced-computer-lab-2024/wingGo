"use client";

import React, { useEffect, useState } from "react";
import TripAreaTwo from "../shearedComponents/TripAreaTwo";
import SidebarSearchArea from "../shearedComponents/SidebarSearchArea";
import PaginationWrapperTwo from "../shearedComponents/PaginationWrapperTwo";
import FlightSearchArea from "../shearedComponents/FlightSearchArea";
import FlightArea from "../shearedComponents/FlightArea";
import HotelSearchArea from "../shearedComponents/HotelSearchArea";
import TourSingleCard from "../common/tourElements/TourSingleCard";
import { bookHotel, searchHotels } from "@/api/HotelApi";


const SearchHotels = () => {
    const [cityCode, setCityCode] = useState('');
    const [searchTriggered, setSearchTriggered] = useState(false);

    const [hotelData, setHotelData] = useState<any[]>([]);


    useEffect(() => {
        const fetchTripData = async () => {
          try {
            const response = await searchHotels({
                cityCode: cityCode,
    
            });
            const data = await response;
            setHotelData(data);
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
    
  return (
    <>
      <div className="bd-blog-grid-area section-space">
        <div className="container">
          <div className="row gy-24">
            <div className="col-xxl-4 col-xl-4 col-lg-5 order-lg-0 order-1">
              <HotelSearchArea
                cityCode={cityCode}
                setCityCode={setCityCode}
                setSearchTriggered={setSearchTriggered}/>
                
            </div>
            <div className="col-xxl-8 col-xl-8 col-lg-7 order-lg-1 order-0">
              {/*trip area*/}
              <div className="col-xxl-8 col-xl-8 col-lg-7 order-lg-1 order-0">
              <div className="row gy-24">
                {hotelData?.map((item) => (
                  <TourSingleCard
                    tour={item}
                    key={item?.id}
                    className="col-xxl-4 col-xl-6 col-lg-6 col-md-6"
                    tourWrapperClass="tour-wrapper style-one"
                    isparentClass={true}
                  />
                ))}
              </div>
            </div>
                
              {/*pagination area*/}
              <PaginationWrapperTwo />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchHotels;