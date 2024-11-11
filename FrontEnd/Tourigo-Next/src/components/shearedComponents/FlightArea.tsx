"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import tourImgFive from "../../../public/assets/images/tour/tour-img-5.png";
import { imageLoader } from "@/hooks/image-loader";
import { bookflight, searchFlights } from "@/api/FlightApi";
import { set } from "react-hook-form";



interface FlightAreaProps {
    origin: string;
    destination: string;
    departureDate: Date | null;
    searchTriggered: boolean;
    setSearchTriggered: (value: boolean) => void;
  }

const FlightArea: React.FC<FlightAreaProps> = ({
    origin,
    destination,
    departureDate,
    searchTriggered,
    setSearchTriggered
}) => {
  
  const [tripData, setTripData] = useState<any[]>([]);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await searchFlights({
            origin, 
            destination, 
            departureDate: departureDate?.toISOString().split('T')[0] || '',

        });
        const data = await response;
        setTripData(data);
        console.log('Trip data:', data);
      } catch (error) {
        console.error('Error fetching trip data:', error);
      }
    };

    if (searchTriggered && origin && destination && departureDate) {
        fetchTripData();
        setSearchTriggered(false);
    }
  }, [searchTriggered, origin, destination, departureDate?.toISOString().split('T')[0]]);

  const handleBookFlight = async (flight: any) => {
    try {
      console.log('Booking flight:', flight);
      const response = await bookflight(flight);
      console.log('Booking response:', response);

      alert("Booking in Progress");


      if(response.message === "Flight booked successfully"){
        alert("Flight booked successfully");
      }
      else{
        alert("Insufficient balance");
      }
    } catch (error) {
      
      console.error('Error booking flight:', error);
    }
  }

  const handleItemClick = (item: any) => {
    console.log(item);
  };

  const formatSegments = (segments: any[]) => {
    const codes = segments.map(segment => segment.departure.iataCode);
    codes.push(segments[segments.length - 1].arrival.iataCode); // Add the final destination
    return codes.join('->');
  };

  return ( tripData?
    <>
      <div className="row gy-24">
        <div className="col-12">
          <h2>Total Flights Found: {tripData.length}</h2> {/* Display the length of the array */}
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
                        {item.itineraries[0].segments.length - 1 === 0
                          ? "Direct Flight"
                          : `${item.itineraries[0].segments.length - 1} Transit Stops`}
                      </Link>
                    </span>
                  </div>
                  <div className="trip-location">
                    <span>
                      <Link href={`/destinations-details/${item?.id}`}>
                        {formatSegments(item.itineraries[0].segments)}
                      </Link>
                    </span>
                  </div>
                  
                  <div className="col-lg-2 text-center" onClick={() => handleBookFlight(item)} style={{ position: 'absolute', bottom: '0px', right: '10px', width: '150px' }}>
                    <Link href="#" className="bd-switch-btn has-left w-100">
                      <div className="bd-switch-default">
                        <span>{item.price.total + " $"}</span>
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
  :
  <div>
      <h1>Loading...</h1>
  </div>
  );
};

export default FlightArea;
