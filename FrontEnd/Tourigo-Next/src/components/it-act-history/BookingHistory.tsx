// BookingHistory.tsx

'use client';
import { imageLoader } from '@/hooks/image-loader';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { getBookedItinerariesData } from '@/data/it-data';
import { BookedItinerary } from '@/interFace/interFace';
import Link from 'next/link';
import RateCommentModal from './RateCommentModal';

const BookingHistory = () => {
    const [bookedItineraries, setBookedItineraries] = useState<BookedItinerary[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<BookedItinerary | null>(null);
    const touristId = "67240ed8c40a7f3005a1d01d"; // Hardcoded tourist ID
    const currentDate = new Date();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getBookedItinerariesData(touristId);
                setBookedItineraries(data);
            } catch (error) {
                console.error("Failed to load booked itineraries:", error);
            }
        };
        fetchData();
    }, []);

    const handleRateCommentClick = (booking: BookedItinerary) => {
        setSelectedBooking(booking); // Set the selected booking to pass its details to the modal
    };

    const closeModal = () => {
        setSelectedBooking(null);
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
                                </div>
                                <div className="recent-activity-content">
                                    <div className="table-responsive">
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
                                                                        className="cancel-booking-button"
                                                                        style={{
                                                                            backgroundColor: "red",
                                                                            color: "white",
                                                                            padding: "8px 16px",
                                                                            fontSize: "14px",
                                                                            borderRadius: "4px",
                                                                            cursor: "pointer",
                                                                            marginBottom: "8px"
                                                                        }}
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rate and Comment Modal */}
            {selectedBooking && (
                <RateCommentModal
                    bookingData={selectedBooking}
                    touristId={touristId}
                    itineraryId={selectedBooking.itinerary._id}
                    tourGuideId={selectedBooking.itinerary.tourGuideId} // Pass the tour guide ID
                    onClose={closeModal}
                />
            )}
        </>
    );
};

export default BookingHistory;
