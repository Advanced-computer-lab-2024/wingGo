"use client";
import { imageLoader } from "@/hooks/image-loader";
import { Transport } from "@/interFace/interFace";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/contextApi/CurrencyContext"; // Import currency context

interface TransportSingleCardProps {
  transport: Transport;
  className: string;
  transportWrapperClass: string;
  isparentClass: boolean;
  isAdmin?: boolean;
}

const TransportSingleCard = ({
  transport,
  className,
  transportWrapperClass,
  isparentClass,
  isAdmin = false,
}: TransportSingleCardProps) => {
  const router = useRouter();
  const { currency, convertAmount } = useCurrency();
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null);

  useEffect(() => {
    const convertTransportPrice = async () => {
      if (transport.price) {
        const priceInSelectedCurrency = await convertAmount(transport.price);
        setConvertedPrice(priceInSelectedCurrency);
      }
    };
    convertTransportPrice();
  }, [currency, transport.price, convertAmount]);

  const handleBookNowClick = () => {
    // Redirect to the specific page (replace "/booking-page" with the desired path)
    router.push(`/transport-details/${transport._id}`);
  };

  return (
    <>
      {isparentClass ? (
        <div className={className}>
          <div className={transportWrapperClass}>
            <div className="p-relative">
              <div className="tour-thumb image-overly">
                <Link href={`/transport-details/${transport._id}`}>
                  <Image
                    src="/images/default-image.jpg" // Placeholder image
                    loader={imageLoader}
                    width={370}
                    height={250}
                    style={{ width: "100%", height: "auto" }}
                    alt="Transport Image"
                  />
                </Link>
              </div>
              <div className="transport-meta d-flex align-items-center justify-content-between">
                <div className="transport-location">
                  <span>
                    <Link href={`/transport-details/${transport._id}`}>
                      <i className="fa-regular fa-location-dot"></i>{" "}
                      {transport.city || "City not available"}
                    </Link>
                  </span>
                </div>
              </div>
            </div>
            <div className="transport-content">
              <h5 className="transport-title fw-5 underline custom_mb-5">
                <Link href={`/transport-details/${transport._id}`}>
                  {transport.type}
                </Link>
              </h5>
              <span className="transport-price b3">
                {currency}{" "}
                {convertedPrice !== null
                  ? convertedPrice.toFixed(2)
                  : transport.price.toLocaleString("en-US")}
              </span>
              <div className="transport-divider"></div>

              <div className="transport-meta d-flex align-items-center justify-content-between">
                <div className="duration d-flex align-items-center gap--5">
                  <i className="icon-clock"></i>
                  <span>{transport.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Non-parent layout, adjust as needed
        <div className={transportWrapperClass}>
          {/* Non-parent layout logic can go here if needed */}
        </div>
      )}
    </>
  );
};

export default TransportSingleCard;