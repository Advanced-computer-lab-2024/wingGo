

"use client";
import GetRatting from "@/hooks/GetRatting";
import { imageLoader } from "@/hooks/image-loader";
import useGlobalContext from "@/hooks/use-context";
import { Activity } from "@/interFace/interFace";
import Image from "next/image";
import Link from "next/link";
import React ,{useState, useEffect} from "react";
import { toggleFlagActivity, isActivityBooked  } from '@/api/activityApi';
import { useRouter } from "next/navigation";
import { useCurrency } from "@/contextApi/CurrencyContext"; // Import currency context


interface ItourPropsType {
  tour: Activity; // Use Itinerary type
  className: string;
  tourWrapperClass: string;
  isparentClass: boolean;
  isAdmin?: boolean;
}

const TourSingleCard = ({
  tour,
  className,
  tourWrapperClass,
  isparentClass,
  isAdmin = false,
}: ItourPropsType) => {
  const { setModalData } = useGlobalContext();
  const router = useRouter();
  const rating = tour.averageRating ; // Use Itinerary's averageRating, default to 1
  // Local state to keep track of the flagged and deactivated status
  const [isFlagged, setIsFlagged] = useState(tour.flagged);
  const { currency, convertAmount } = useCurrency(); 
  const [isBooked, setIsBooked] = useState(false);
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null);


   // Fetch booking status when component mounts
   useEffect(() => {
    const checkIfBooked = async () => {
      try {
        const bookedStatus = await isActivityBooked(tour._id);
        setIsBooked(bookedStatus);
      } catch (error) {
        console.error("Error checking booked status:", error);
      }
    };
    checkIfBooked();
  }, [tour._id]);
  useEffect(() => {
    const convertTourPrice = async () => {
      if (tour.price) {
        const priceInSelectedCurrency = await convertAmount(tour.price);
        setConvertedPrice(priceInSelectedCurrency);
      }
    };
    convertTourPrice();
  }, [currency, tour.price, convertAmount]); 

  const handleFlagActivity = async () => {
    try {
      // Toggle the flagged state in the backend
      await toggleFlagActivity(tour._id, !isFlagged);
      setIsFlagged((prevFlagged) => !prevFlagged);
    } catch (error) {
      console.error("Error updating flagged status:", error);
    }
  };
  const handleBookNowClick = () => {
    // Redirect to the specific page (replace "/booking-page" with the desired path)
    router.push(`/booking-activity/${tour._id}`);
  };


  return (
    <>
      {isparentClass ? (
        <div className={className}>
          <div className={tourWrapperClass}>
            <div className="p-relative">
              <div className="tour-thumb image-overly">
                <Link href={`/activity-details/${tour._id}`}>
                  <Image
                    src="/images/default-image.jpg" // Placeholder image
                    loader={imageLoader}
                    style={{ width: "100%", height: "auto" }}
                    alt="Activity Image"
                  />
                </Link>
              </div>
              <div className="tour-meta d-flex align-items-center justify-content-between">
                <button className="tour-favorite tour-like">
                  <i className="icon-heart"></i>
                </button>
                <div className="tour-location">
                  <span>
                    <Link href={`/activity-details/${tour._id}`}>
                      <i className="fa-regular fa-location-dot"></i>{" "}
                      {tour.location.address || "Location not available"}
                    </Link>
                  </span>
                </div>
              </div>
            </div>
            <div className="tour-content">
              <div className="tour-rating d-flex align-items-center gap-10 mb-10">
                <div className="tour-rating-icon fs-14 d-flex rating-color">
                  <GetRatting averageRating={rating} />
                </div>
                <div className="tour-rating-text">
                  <span>
                    {rating.toFixed(1)} ({tour.ratings.length} Ratings)
                  </span>
                </div>
              </div>
              <h5 className="tour-title fw-5 underline custom_mb-5">
                <Link href={`/activity-details/${tour._id}`}>
                  {tour.name}
                </Link>
              </h5>
              {isAdmin && (
                  <button
                    onClick={handleFlagActivity}
                    className="flag-itinerary-button"
                    style={{
                      backgroundColor: isFlagged ? "green" : "red",
                      color: "white",
                      padding: "8px 16px",
                      fontSize: "14px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {isFlagged ? "Unflag" : "Flag"}
                  </button>
                )}
              <span className="tour-price b3">
                {currency}{" "}
                {convertedPrice !== null
                  ? convertedPrice.toFixed(2)
                  : tour.price.toLocaleString("en-US")}
              </span>
              <div className="tour-divider"></div>

              <div className="tour-meta d-flex align-items-center justify-content-between">
                <div className="time d-flex align-items-center gap--5">
                  <i className="icon-heart"></i>
                  <span>{tour.time}</span>
                </div>
                <div className="tour-btn">
                <button
                    onClick={isBooked ? undefined : handleBookNowClick} // Disable click if already booked
                    className="bd-text-btn style-two"
                    type="button"
                    style={{
                      cursor: isBooked ? "not-allowed" : "pointer",
                      color: isBooked ? "gray" : "inherit",
                    }}
                    disabled={isBooked}
                  >
                    {isBooked ? "Booked!" : "Book Now"}
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
        // Non-parent layout, adjust as needed
        <div className={tourWrapperClass}>
          {/* Non-parent layout logic can go here if needed */}
        </div>
      )}
    </>
  );
};

export default TourSingleCard;
