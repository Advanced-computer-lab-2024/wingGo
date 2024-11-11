"use client";
import GetRatting from "@/hooks/GetRatting";
import { imageLoader } from "@/hooks/image-loader";
import useGlobalContext from "@/hooks/use-context";
import { Place } from "@/interFace/interFace";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCurrency } from "@/contextApi/CurrencyContext";

interface ItourPropsType {
  tour: Place;
  className: string;
  tourWrapperClass: string;
  isparentClass: boolean;
  isAdmin?: boolean;
  isTourGuide?: boolean;
}

const TourSingleCard = ({
  tour,
  className,
  tourWrapperClass,
  isparentClass,
  isAdmin = false,
  isTourGuide = false,
}: ItourPropsType) => {
  const { setModalData } = useGlobalContext();
  const { currency, convertAmount } = useCurrency(); // Access currency and conversion function
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null);
  useEffect(() => {
    const convertPrice = async () => {
      if (tour.ticketPrices.foreigner) {
        const priceInSelectedCurrency = await convertAmount(tour.ticketPrices.foreigner);
        setConvertedPrice(priceInSelectedCurrency);
      }
    };
    convertPrice();
  }, [tour.ticketPrices.foreigner, currency, convertAmount]);

  return (
    <>
      {isparentClass ? (
        <div className={className}>
          <div className={tourWrapperClass}>
            <div className="p-relative">
              <div className="tour-thumb image-overly">
                <Link href={`/place-details/${tour._id}`}>
                  <Image
                    src={tour.pictures[0] || "/images/default-image.jpg"}
                    loader={imageLoader}
                    style={{ width: "100%", height: "auto" }}
                    alt={tour.name}
                  />
                </Link>
              </div>
              <div className="tour-meta d-flex align-items-center justify-content-between">
                <button className="tour-favorite tour-like">
                  <i className="icon-heart"></i>
                </button>
                <div className="tour-location">
                  <span>
                    <Link href={`/place-details/${tour._id}`}>
                      <i className="fa-regular fa-location-dot"></i>{" "}
                      {tour.location || "Location not available"}
                    </Link>
                  </span>
                </div>
              </div>
            </div>
            <div className="tour-content">
              <h5 className="tour-title fw-5 underline custom_mb-5">
                <Link href={`/place-details/${tour._id}`}>
                  {tour.name}
                </Link>
              </h5>
              <p>{tour.description}</p>
              <span className="tour-price b3">
                {currency} {convertedPrice?.toLocaleString("en-US") || tour.ticketPrices.foreigner.toLocaleString("en-US")} for foreigners
              </span>
              <div className="tour-divider"></div>

              <div className="tour-meta d-flex align-items-center justify-content-between">
                <div className="time d-flex align-items-center gap--5">
                  <i className="fa-regular fa-clock"></i>
                  <span>{tour.openingHours}</span>
                </div>
                <div className="tour-btn">
                  <button
                    onClick={() => setModalData(tour)}
                    className="bd-text-btn style-two"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#popUpBookingForm"
                  >
                    Book Now
                    <span className="icon__box">
                      <i className="fa-regular fa-arrow-right-long icon__first"></i>
                      <i className="fa-regular fa-arrow-right-long icon__second"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={tourWrapperClass}></div>
      )}
    </>
  );
};

export default TourSingleCard;
