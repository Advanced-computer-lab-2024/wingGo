

"use client";
import GetRatting from "@/hooks/GetRatting";
import { imageLoader } from "@/hooks/image-loader";
import useGlobalContext from "@/hooks/use-context";
import { Activity } from "@/interFace/interFace";
import Image from "next/image";
import Link from "next/link";
import React ,{useState, useEffect} from "react";
import { toggleFlagActivity, isActivityBooked, toggleBookingState  } from '@/api/activityApi';
import { useRouter } from "next/navigation";
import { useCurrency } from "@/contextApi/CurrencyContext"; // Import currency context
import Modal from "react-modal";
import { toast } from 'sonner';


interface ItourPropsType {
  tour: Activity; // Use Itinerary type
  className: string;
  tourWrapperClass: string;
  isparentClass: boolean;
  isAdmin?: boolean;
  isAdvertiser?: boolean;
}

const TourSingleCard = ({
  tour,
  className,
  tourWrapperClass,
  isparentClass,
  isAdmin = false,
  isAdvertiser = false
}: ItourPropsType) => {
  const { setModalData } = useGlobalContext();
  const router = useRouter();
  const rating = tour.averageRating ; // Use Itinerary's averageRating, default to 1
  // Local state to keep track of the flagged and deactivated status
  const [isFlagged, setIsFlagged] = useState(tour.flagged);
  const { currency, convertAmount } = useCurrency(); 
  const [isBooked, setIsBooked] = useState(false);
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null);
  const [bookingState, setBookingState] = useState(tour.bookingOpen);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [modalAction, setModalAction] = useState(""); // To track the action (Open/Close Booking)



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

  const handleToggleBooking = (action: string) => {
    setModalAction(action); // Set the action (Open or Close)
    setIsModalOpen(true); // Open the modal
  };
  
  const confirmToggleBooking = async () => {
    const toastId = toast.loading("Processing your Request...");
    try {
      const newBookingState = modalAction === "Open"; // Determine the new state
      await toggleBookingState(tour._id, newBookingState); // Call the backend API
      setBookingState(newBookingState); // Update state after successful API call
      setIsModalOpen(false); // Close the modal
      console.log(`Booking state toggled to: ${newBookingState ? "Open" : "Closed"}`);
      toast.success(`Booking state toggled to ${newBookingState ? 'Open' : 'Closed'} successfully!`, { id: toastId, duration: 1000 });
    } catch (error) {
      console.error("Error toggling booking state:", error);
      toast.error('Failed to toggle booking state. Please try again.', { id: toastId });
    }
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
                    src="/assets/images/Activity.jpeg" // Placeholder image
                    loader={imageLoader}
                    width={370}
                    height={370}
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
                <div className="time d-flex align-items-center gap--5" >
                {(!isAdvertiser) && <i className="icon-heart"></i>}
                  {(!isAdvertiser) && <span>{tour.time}</span>}
                </div>
                <div className="tour-btn">
                {/* {isAdvertiser && (
                  <button
                    onClick={handleToggleBooking}                  
                    style={{
                      backgroundColor: bookingState ? "red" : "green",
                      color: "white",
                      padding: "8px 16px",
                      fontSize: "14px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {bookingState ? "Close Booking" : "Open Booking"}
                  </button>
                )} */}
                
                {isAdvertiser && <button
                    onClick={() => handleToggleBooking(bookingState ? "Close" : "Open")} 
                    className="bd-text-btn style-two"
                    type="button"
                    style={{
                      color:  bookingState ? "red" : "blue"
                     }}
                  >
                   {bookingState ? "Close Booking" : "Open Booking"}
                    <span className="icon__box">
                    <i className="fa-regular fa-arrow-right-long icon__first"></i>
                    <i className="fa-regular fa-arrow-right-long icon__second"></i>
                    </span>
                  </button>}
                
                  <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    contentLabel="Confirm Booking Action"
                    style={{
                      content: {
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        background: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        width: "500px",
                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
                      },
                      overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                      },
                    }}
                  >
                    <h3>Confirm {modalAction} Booking</h3>
                    <p>Are you sure you want to {modalAction.toLowerCase()} booking for this activity?</p>
                    <div style={{ display: "flex", marginTop: "20px" }}>
                      <button
                        onClick={confirmToggleBooking}
                        className="bd-primary-btn btn-style radius-60"
                        style={{
                          marginRight: "10px",
                        }}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="bd-primary-btn btn-style radius-60"
                      >
                        No
                      </button>
                    </div>
                  </Modal>

                
                {(!isAdvertiser) && <button
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
                  </button>}
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
