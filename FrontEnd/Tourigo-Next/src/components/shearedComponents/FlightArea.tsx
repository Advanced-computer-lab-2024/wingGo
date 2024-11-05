"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import tourImgFive from "../../../public/assets/images/tour/tour-img-5.png";
import { imageLoader } from "@/hooks/image-loader";
import { searchFlights } from "@/api/FlightApi";



interface FlightAreaProps {
    origin: string;
    destination: string;
    departureDate: Date | null;
    searchTriggered: boolean;
  }

const FlightArea: React.FC<FlightAreaProps> = ({
    origin,
    destination,
    departureDate,
    searchTriggered,
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
        const data = await response.data;
        setTripData(data);
        console.log('Trip data:', data);
      } catch (error) {
        console.error('Error fetching trip data:', error);
      }
    };

    if (searchTriggered && origin && destination && departureDate) {
        fetchTripData();
    }
  }, [searchTriggered, origin, destination, departureDate?.toISOString().split('T')[0]]);

  const formatSegments = (segments: any[]) => {
    const codes = segments.map(segment => segment.departure.iataCode);
    codes.push(segments[segments.length - 1].arrival.iataCode); // Add the final destination
    return codes.join('->');
  };

  return (
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
                  <Link href={`/destinations-details/${item?.id}`}>
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
                </div>
              </div>
            </div>
          ))}
        
      </div>
    </>
  );
};

export default FlightArea;
