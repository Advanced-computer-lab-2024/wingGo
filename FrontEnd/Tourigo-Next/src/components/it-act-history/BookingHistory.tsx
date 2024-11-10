//BookingHistory.tsx
"use client";
import { imageLoader } from '@/hooks/image-loader';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { getBookedItinerariesData } from '@/data/it-data';
import { getBookedActivitiesData } from '@/data/act-data';
import { BookedItinerary ,BookedActivity} from '@/interFace/interFace';
import Link from 'next/link';
import RateCommentModal from './RateCommentModal';
import RateCommentModalActivity from './RateCommentModalActivity';
import { cancelItineraryApi } from '@/api/itineraryApi';
import { cancelActivityApi } from '@/api/activityApi';

const BookingHistory = () => {
    const [bookedItineraries, setBookedItineraries] = useState<BookedItinerary[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<BookedItinerary | null>(null);
    const [bookedActivities, setBookedActivities] = useState<BookedActivity[]>([]);
    const [selectedBooking_act, setSelectedBooking_act] = useState<BookedActivity | null>(null);
    const [activeTab, setActiveTab] = useState('itinerary'); // New state for tab selection
    const touristId = "67240ed8c40a7f3005a1d01d";
    const currentDate = new Date();

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

    const handleCancelBookingClick= async (booking: BookedItinerary) => {
        const userConfirmed = window.confirm("Are you sure you want to cancel this booking?");
        if (!userConfirmed) return;
    
        try {
            await cancelItineraryApi(touristId, booking.itinerary._id);
            alert('Booking canceled successfully');
            setBookedItineraries((prev) =>
                prev.filter((item) => item.itinerary._id !== booking.itinerary._id)
            );
        } catch (error: any) {
            if (error.response?.data?.message === 'Cannot cancel the itinerary within 48 hours of the booking date.') {
                alert("Cannot cancel the itinerary within 48 hours of the booking date.");
            } else {
                alert('Failed to cancel the booking');
            }
        }
    };
    ////////////////////  Activity Part  /////////////////////////////////
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getBookedActivitiesData(touristId);
                setBookedActivities(data);
            } catch (error) {
                console.error("Failed to load booked activities:", error);
            }
        };
        fetchData();
    }, []);

    const handleRateCommentClick_act = (booking: BookedActivity) => {
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
    

    const handleCancelBookingClick_act = async (booking: BookedActivity) => {
        const userConfirmed = window.confirm("Are you sure you want to cancel this booking?");
        if (!userConfirmed) return;
    
        try {
            await cancelActivityApi(touristId, booking.activity._id);
            alert('Booking canceled successfully');
            setBookedActivities((prev) =>
                prev.filter((item) => item.activity._id !== booking.activity._id)
            );
        } catch (error: any) {
            if (error.response?.data?.message === 'Cannot cancel the activity within 48 hours of the booking date.') {
                alert("Cannot cancel the activity within 48 hours of the booking date.");
            } else {
                alert('Failed to cancel the booking');
            }
        }
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
                                                onClick={() => setActiveTab('itinerary')}
                                                type="button"
                                                role="tab"
                                                aria-selected={activeTab === 'itinerary'}
                                                style={{ marginRight: '10px' }}
                                            >
                                                Itinerary History
                                            </button>
                                            <button
                                                className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('activity')}
                                                type="button"
                                                role="tab"
                                                aria-selected={activeTab === 'activity'}
                                            >
                                                Activity History
                                            </button>
                                        </div>
                                    </nav>
                                </div>

                                <div className="recent-activity-content">
                                    <div className="table-responsive">
                                        {activeTab === 'itinerary' ? (
                                            <table className="table mb-0">
                                                <tbody>
                                                    {bookedItineraries.map((booking) => (
                                                        <tr key={booking.itinerary._id} className="table-custom">
                                                            <td>
                                                                <div className="dashboard-thumb-wrapper p-relative">
                                                                    <div className="dashboard-thumb image-hover-effect-two position-relative">
                                                                        <Image
                                                                            src="/images/default-image.jpg"
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
                                                                <div className="recent-activity-price-box">
                                                                    <h5 className="mb-10">${booking.itinerary.price.toLocaleString("en-US")}</h5>
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
                                                    {bookedActivities.map((booking) => (
                                                        <tr key={booking.activity._id} className="table-custom">
                                                            <td>
                                                                <div className="dashboard-thumb-wrapper p-relative">
                                                                    <div className="dashboard-thumb image-hover-effect-two position-relative">
                                                                        <Image
                                                                            src="/images/default-image.jpg"
                                                                            loader={imageLoader}
                                                                            style={{ width: '100%', height: "auto" }}
                                                                            alt="activity image" 
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="recent-activity-title-box d-flex align-items-center gap-10">
                                                                    <div>
                                                                        <h5 className="tour-title fw-5 underline">
                                                                            <Link href={`/activity-details/${booking.activity._id}`}>
                                                                                {booking.activity.name}
                                                                            </Link>
                                                                        </h5>
                                                                        <div className="recent-activity-location">
                                                                            Address: {booking.activity.location.address}
                                                                        </div>
                                                                       
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="recent-activity-price-box">
                                                                    <h5 className="mb-10">${booking.activity.price.toLocaleString("en-US")}</h5>
                                                                    <p>Total/Person</p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    {new Date(booking.activity.date) < currentDate ? (
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
                                                                                backgroundColor: isCancellable_act(booking.activity.date) ? "red" : "gray",
                                                                                color: "white",
                                                                                padding: "8px 16px",
                                                                                fontSize: "14px",
                                                                                borderRadius: "4px",
                                                                                cursor: isCancellable_act(booking.activity.date) ? "pointer" : "not-allowed",
                                                                                marginBottom: "8px"
                                                                            }}
                                                                            disabled={!isCancellable_act(booking.activity.date)}
                                                                            title={!isCancellable_act(booking.activity.date) ? "Cannot cancel within 48 hours of booking date." : ""}
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
                    activityId={selectedBooking_act.activity._id}
                    
                    onClose={closeModal_act}
                />
            )}
        </>
    );
};

export default BookingHistory;
