//BookingHistory.tsx
"use client";
import { imageLoader } from '@/hooks/image-loader';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { getBookedItinerariesData } from '@/data/it-data';
// import { getBookedActivitiesData } from '@/data/act-data';
import { BookedItinerary ,BookedActivity} from '@/interFace/interFace';
import {Activity} from '@/interFace/interFace';
import Link from 'next/link';
import RateCommentModal from './RateCommentModal';
import RateCommentModalActivity from './RateCommentModalActivity';
import { cancelItineraryApi } from '@/api/itineraryApi';
import { cancelActivityApi, fetchFilteredActivities } from '@/api/activityApi';
import CancelConfirmationModal from "./CancelConfirmationModal"; // Import the new modal component
import { useCurrency } from "@/contextApi/CurrencyContext"; 

interface FilterOptions {
    date?: string;
    
  
  }

const BookingHistory = () => {
    const [bookedItineraries, setBookedItineraries] = useState<BookedItinerary[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<BookedItinerary | null>(null);
    // const [bookedActivities, setBookedActivities] = useState<BookedActivity[]>([]);
    const [selectedBooking_act, setSelectedBooking_act] = useState<Activity | null>(null);
    const [activeTab, setActiveTab] = useState('itinerary'); // New state for tab selection
    const touristId = "67240ed8c40a7f3005a1d01d";
    const currentDate = new Date();
    const { currency, convertAmount } = useCurrency(); // Access currency and conversion function
    const [convertedItineraryPrices, setConvertedItineraryPrices] = useState<{ [key: string]: number }>({});
    const [convertedActivityPrices, setConvertedActivityPrices] = useState<{ [key: string]: number }>({});
    // const [filterType_it, setFilterType_it] = useState<'all' | 'past' | 'upcoming'>('all');
    const [filterType, setFilterType] = useState<'all' | 'past' | 'upcoming'>('all');
    // const [filteredActivities, setFilteredActivities] = useState<BookedActivity[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
    const [filters, setFilters] = useState<FilterOptions>({});
    


    const [showCancelModal, setShowCancelModal] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState<BookedItinerary | null>(null);

    const handleCancelBookingClick = (booking: BookedItinerary) => {
        setBookingToCancel(booking);
        setShowCancelModal(true);
    };

    const loadFilteredActivities = async () => {
        try {
          const apiFilters: FilterOptions = {
            date: filters.date,
          };
    
          const data = await fetchFilteredActivities(apiFilters);
    
          // Apply local search filtering if searchQuery is provided
       
          setFilteredActivities(data);
        } catch (error) {
          console.error("Failed to fetch filtered itineraries:", error);
        }
      };
    

      // Fetch filtered activities when filterType or activeTab changes
      useEffect(() => {
       
            if (activeTab === 'activity') {
                loadFilteredActivities();
                    
            }
       
    }, [filters, activeTab]);

    const applyFilters = (newFilters: FilterOptions) => {
        setFilters((prevFilters) => ({
          ...prevFilters,
          ...newFilters, // Update filters with new values
        }));
      };
    

    // useEffect(() => {
    //     console.log('Filtered Activities Updated:', filteredActivities);
    // }, [filteredActivities]);
    

    const confirmCancellation = async () => {
        if (!bookingToCancel) return;

        try {
            await cancelItineraryApi(touristId, bookingToCancel.itinerary._id);
            setBookedItineraries((prev) =>
                prev.filter((item) => item.itinerary._id !== bookingToCancel.itinerary._id)
            );
            alert('Booking canceled successfully');
        } catch (error: any) {
            if (error.response?.data?.message === 'Cannot cancel the itinerary within 48 hours of the booking date.') {
                alert("Cannot cancel the itinerary within 48 hours of the booking date.");
            } else {
                alert('Failed to cancel the booking');
            }
        } finally {
            setShowCancelModal(false);
            setBookingToCancel(null);
        }
    };

    const closeCancelModal = () => {
        setShowCancelModal(false);
        setBookingToCancel(null);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getBookedItinerariesData(touristId);
                setBookedItineraries(data);
            } catch (error) {
                console.error("Failed to load booked activities:", error);
            }
        };
        fetchData();
    }, []);



    const handleRateCommentClick = (booking: BookedItinerary) => {
        setSelectedBooking(booking);
    };

    const closeModal = () => {
        setSelectedBooking(null);
    };

    const isCancellable= (bookingDate: Date): boolean => {
        const now = new Date();
        const diffInMilliseconds = new Date(bookingDate).getTime() - now.getTime();
        return diffInMilliseconds >= 48 * 60 * 60 * 1000;
    };

    // const handleCancelBookingClick= async (booking: BookedItinerary) => {
    //     const userConfirmed = window.confirm("Are you sure you want to cancel this booking?");
    //     if (!userConfirmed) return;
    
    //     try {
    //         await cancelItineraryApi(touristId, booking.itinerary._id);
    //         alert('Booking canceled successfully');
    //         setBookedItineraries((prev) =>
    //             prev.filter((item) => item.itinerary._id !== booking.itinerary._id)
    //         );
    //     } catch (error: any) {
    //         if (error.response?.data?.message === 'Cannot cancel the itinerary within 48 hours of the booking date.') {
    //             alert("Cannot cancel the itinerary within 48 hours of the booking date.");
    //         } else {
    //             alert('Failed to cancel the booking');
    //         }
    //     }
    // };
    ////////////////////  Activity Part  /////////////////////////////////
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const Activities = await getBookedActivitiesData(touristId);
    //             // console.log("yay");
    //             // console.log(Activities);
    //             setFilteredActivities(Activities);
    //             const convertedPrices = await convertPrices(Activities, 'activity');
    //             setConvertedActivityPrices(convertedPrices);
    //         } catch (error) {
    //             console.error("Failed to load booked itineraries:", error);
    //         }
    //     };
    //     fetchData();
    // }, [currency]);
    // const convertPrices = async (
    //     bookings: BookedItinerary[] | BookedActivity[],
    //     type: 'itinerary' | 'activity'
    //   ) => {
    //     const convertedPrices: Record<string, number> = {};
    //     for (const booking of bookings) {
    //       const price = type === 'itinerary' ? (booking as BookedItinerary).itinerary.price : (booking as BookedActivity).activity.price;
    //       if (price) {
    //         const convertedPrice = await convertAmount(price);
    //         const id = type === 'itinerary' ? (booking as BookedItinerary).itinerary._id : (booking as BookedActivity).activity._id;
    //         convertedPrices[id] = convertedPrice;
    //       }
    //     }
    //     return convertedPrices;
    //   };


    const handleRateCommentClick_act = (booking: Activity) => {
        setSelectedBooking_act(booking);
    };

    const closeModal_act = () => {
        setSelectedBooking_act(null);
    };

    const isCancellable_act = (bookingDateString: string): boolean => {
        // Parse the booking date string to a Date object
        const bookingDate = new Date(bookingDateString);
    
        // Check if the parsed date is valid
        if (isNaN(bookingDate.getTime())) {
            console.error("Invalid date format. Please provide a valid date string.");
            return false;
        }
    
        const now = new Date();
        // Calculate the time difference in milliseconds
        const diffInMilliseconds = bookingDate.getTime() - now.getTime();
    
        // Check if the difference is 48 hours or more
        return diffInMilliseconds >= 48 * 60 * 60 * 1000;
    };
    

    const handleCancelBookingClick_act = async (booking: Activity) => {
        const userConfirmed = window.confirm("Are you sure you want to cancel this booking?");
        if (!userConfirmed) return;
    
        try {
            await cancelActivityApi(touristId, booking._id);
            alert('Booking canceled successfully');
            setFilteredActivities((prev) =>
                prev.filter((item) => item._id !== booking._id)
            );
        } catch (error: any) {
            if (error.response?.data?.message === 'Cannot cancel the activity within 48 hours of the booking date.') {
                alert("Cannot cancel the activity within 48 hours of the booking date.");
            } else {
                alert('Failed to cancel the booking');
            }
        }
    };

    const handleTabSwitch = (tab: 'itinerary' | 'activity') => {
        setActiveTab(tab);
        setFilterType('all'); // Reset filter to 'all' whenever the tab changes
        // setFilterType_it('all'); // Reset filter to 'all' whenever the tab changes
    };
    


    return (
        <>
            <section className="bd-recent-activity section-space-small-bottom">
                <div className="container" style={{ paddingTop: "40px" }}>
                    <div className="row">
                        <div className="col-xxl-12">
                            <div className="recent-activity-wrapper">
                                <div className="section-title-wrapper section-title-space">
                                    <h2 className="section-title">Booking History</h2>

                                    {/* Tab Navigation */}
                                    <nav>
                                        <div className="nav nav-tabs" role="tablist" style={{ paddingTop: '7px' }}>
                                            <button
                                                className={`nav-link ${activeTab === 'itinerary' ? 'active' : ''}`}
                                                onClick={() => handleTabSwitch('itinerary')}
                                                type="button"
                                                role="tab"
                                                aria-selected={activeTab === 'itinerary'}
                                                style={{ marginRight: '10px' }}
                                            >
                                                Itinerary History
                                            </button>
                                            
                                            <button
                                                className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`}
                                                onClick={() => handleTabSwitch('activity')}
                                                type="button"
                                                role="tab"
                                                aria-selected={activeTab === 'activity'}
                                            >
                                                Activity History
                                            </button>
                                        </div>
                                    </nav>
                                </div>

                                <div className="col-auto" style={{ paddingBottom: '30px'}}>
                                <select
                                    onChange={(e) => setFilterType(e.target.value as 'all' | 'past' | 'upcoming')}
                                    value={filterType}
                                    
                                >
                                    <option value="all">All</option>
                                    <option value="past">Past</option>
                                    <option value="upcoming">Upcoming</option>
                                </select>
                                </div>

                                <div className="recent-activity-content">
                               
                                    <div className="table-responsive">
                                        {activeTab === 'itinerary' ? (
                                            <table className="table mb-0">
                                               
                                                <tbody>
                                                    {bookedItineraries
                                                    .filter((booking) => {
                                                        const isPast = new Date(booking.bookingDate) < currentDate;
                                                        if (filterType === 'past') return isPast;
                                                        if (filterType === 'upcoming') return !isPast;
                                                        return true; // 'all'
                                                    })
                                                    .map((booking) => (
                                                        <tr key={booking.itinerary._id} className="table-custom">
                                                            <td>
                                                                <div className="dashboard-thumb-wrapper p-relative">
                                                                    <div className="dashboard-thu   mb image-hover-effect-two position-relative">
                                                                        <Image
                                                                            src=""
                                                                            loader={imageLoader}
                                                                            style={{ width: '100%', height: "auto" }}
                                                                            alt="itinerary image" 
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="recent-activity-title-box d-flex align-items-center gap-10">
                                                                    <div>
                                                                        <h5 className="tour-title fw-5 underline">
                                                                            <Link href={`/it-details/${booking.itinerary._id}`}>
                                                                                {booking.itinerary.title}
                                                                            </Link>
                                                                        </h5>
                                                                        <div className="recent-activity-location">
                                                                            Locations: {booking.itinerary.locations.join(", ")}
                                                                        </div>
                                                                        <p className="">Activities: {booking.itinerary.activities}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                            {showCancelModal && (
                                                            <CancelConfirmationModal
                                                                onConfirm={confirmCancellation}
                                                                onCancel={closeCancelModal}
                                                            />
                                                        )}
                                                            </td>
                                                            <td>
                                                                <div className="recent-activity-price-box">
                                                                <h5 className="mb-10">
                                                                        {currency} {convertedItineraryPrices[booking.itinerary._id]?.toFixed(2) || booking.itinerary.price.toLocaleString("en-US")}
                                                                    </h5>
                                                                    <p>Total/Person</p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    {new Date(booking.bookingDate) < currentDate ? (
                                                                        <button
                                                                            onClick={() => handleRateCommentClick(booking)}
                                                                            className="rate-comment-button"
                                                                            style={{
                                                                                backgroundColor: "blue",
                                                                                color: "white",
                                                                                padding: "8px 16px",
                                                                                fontSize: "14px",
                                                                                borderRadius: "4px",
                                                                                cursor: "pointer",
                                                                                marginBottom: "8px"
                                                                            }}
                                                                        >
                                                                            Rate & Comment
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleCancelBookingClick(booking)}
                                                                            className="cancel-booking-button"
                                                                            style={{
                                                                                backgroundColor: isCancellable(booking.bookingDate) ? "red" : "gray",
                                                                                color: "white",
                                                                                padding: "8px 16px",
                                                                                fontSize: "14px",
                                                                                borderRadius: "4px",
                                                                                cursor: isCancellable(booking.bookingDate) ? "pointer" : "not-allowed",
                                                                                marginBottom: "8px"
                                                                            }}
                                                                            disabled={!isCancellable(booking.bookingDate)}
                                                                            title={!isCancellable(booking.bookingDate) ? "Cannot cancel within 48 hours of booking date." : ""}
                                                                        >
                                                                            Cancel Booking
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            // Render Activity History when 'activity' tab is selected
                                            <div>
                                                
                                                <table className="table mb-0">
                                                <tbody>
                                                { filteredActivities.length>0 && filteredActivities.filter((booking) => {
                                                        const isPast = new Date(booking.date) < currentDate;
                                                        if (filterType === 'past') return isPast;
                                                        else if (filterType === 'upcoming') return !isPast;
                                                        return true; // 'all'
                                                    }).map((booking) => (
                        <tr key={booking._id} className="table-custom">
                            <td>
                                <div className="dashboard-thumb-wrapper p-relative">
                                    <div className="dashboard-thumb image-hover-effect-two position-relative">
                                        
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="recent-activity-title-box d-flex align-items-center gap-10">
                                    <div>
                                        <h5 className="tour-title fw-5 underline">
                                            <Link href={`/activity-details/${booking._id}`}>
                                                {booking.name}
                                            </Link>
                                        </h5>
                                        <div className="recent-activity-location">
                                            Address: {booking.location.address}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                                                <div className="recent-activity-price-box">
                                                                <h5 className="mb-10">
                                                                      {currency} {convertedActivityPrices[booking._id]?.toFixed(2) || booking.price.toFixed(2)}
                                                                    </h5>
                                                                    <p>Total/Person</p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    {new Date(booking.date) < currentDate ? (
                                                                        <button
                                                                            onClick={() => handleRateCommentClick_act(booking)}
                                                                            className="rate-comment-button"
                                                                            style={{
                                                                                backgroundColor: "blue",
                                                                                color: "white",
                                                                                padding: "8px 16px",
                                                                                fontSize: "14px",
                                                                                borderRadius: "4px",
                                                                                cursor: "pointer",
                                                                                marginBottom: "8px"
                                                                            }}
                                                                        >
                                                                            Rate & Comment
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleCancelBookingClick_act(booking)}
                                                                            className="cancel-booking-button"
                                                                            style={{
                                                                                backgroundColor: isCancellable_act(booking.date) ? "red" : "gray",
                                                                                color: "white",
                                                                                padding: "8px 16px",
                                                                                fontSize: "14px",
                                                                                borderRadius: "4px",
                                                                                cursor: isCancellable_act(booking.date) ? "pointer" : "not-allowed",
                                                                                marginBottom: "8px"
                                                                            }}
                                                                            disabled={!isCancellable_act(booking.date)}
                                                                            title={!isCancellable_act(booking.date) ? "Cannot cancel within 48 hours of booking date." : ""}
                                                                        >
                                                                            Cancel Booking
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {selectedBooking && (
                <RateCommentModal
                    bookingData={selectedBooking}
                    touristId={touristId}
                    itineraryId={selectedBooking.itinerary._id}
                    tourGuideId={selectedBooking.itinerary.tourGuideId}
                    onClose={closeModal}
                />
            )}
            {selectedBooking_act && (
                <RateCommentModalActivity
                    bookingData={selectedBooking_act}
                    touristId={touristId}
                    activityId={selectedBooking_act._id}
                    
                    onClose={closeModal_act}
                />
            )}
        </>
    );
};

export default BookingHistory;
