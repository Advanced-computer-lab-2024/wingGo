// TourDetailTabArea.tsx
"use client";
import { imageLoader } from "@/hooks/image-loader";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Itinerary, TourGuide } from '@/interFace/interFace';
import GetRatting from "@/hooks/GetRatting";
import TourDetailsPostForm from "./TourDetailsPostFrom/TourDetailsPostForm";
import { TbEdit } from "react-icons/tb";
import { useState } from "react";
import { toast } from "sonner"; // For notifications, if not already imported
import { updateItineraryApi } from "@/api/itineraryApi";
interface TourDetailTabAreaProps {
  itineraryData: Itinerary;
  tourGuideData: TourGuide;
}

// Function to format date into a readable string
const formatDate = (date: string | Date) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return dateObj.toLocaleDateString(undefined, options);
};

const TourDetailTabArea: React.FC<TourDetailTabAreaProps> = ({ itineraryData: initialItineraryData, tourGuideData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [itineraryData, setItineraryData] = useState(initialItineraryData); // Manage itineraryData locally
  const [updatedItinerary, setUpdatedItinerary] = useState({
    language: itineraryData.language || "",
    pickupLocation: itineraryData.pickupLocation || "",
    dropoffLocation: itineraryData.dropoffLocation || "",
    availableDates: itineraryData.availableDates || [],
    activities: itineraryData.activities || "", 
    tags: itineraryData.tags || [], // New field
    price: itineraryData.price || 0, // New field
    duration: itineraryData.duration || "", // New field
    timeline: itineraryData.timeline || "", // New field
    accessibility: itineraryData.accessibility || false,
  });

  const handleSaveChanges = async (itineraryId: string, tourGuideId: string) => {
    const updates = {
      language: updatedItinerary.language,
      pickupLocation: updatedItinerary.pickupLocation,
      dropoffLocation: updatedItinerary.dropoffLocation,
      availableDates: updatedItinerary.availableDates,
      activities: updatedItinerary.activities, // Include activities here
      tags: updatedItinerary.tags,
      price: updatedItinerary.price,
      duration: updatedItinerary.duration,
      timeline: updatedItinerary.timeline,
      accessibility: updatedItinerary.accessibility,
    };
  
    try {
      await updateItineraryApi(itineraryId, updates, tourGuideId);
      setItineraryData((prevData) => ({
        ...prevData,
        ...updates,
      }));
      toast.success("Itinerary updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update itinerary. Please try again.");
    }
  };
  return (
    <>
      <div className="tour-details-nav-tabs mb-35">
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              className="nav-link active"
              id="nav-overview-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-overview"
              type="button"
              role="tab"
              aria-controls="nav-overview"
              aria-selected="true"
            >
              Overview
            </button>
            <button
              className="nav-link"
              id="nav-feedback-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-feedback"
              type="button"
              role="tab"
              aria-controls="nav-feedback"
              aria-selected="false"
              tabIndex={-1}
            >
              Feedback
            </button>
            <button
              className="nav-link"
              id="nav-reviews-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-reviews"
              type="button"
              role="tab"
              aria-controls="nav-reviews"
              aria-selected="false"
              tabIndex={-1}
            >
              Reviews
            </button>
          </div>
        </nav>
        <div className="tab-content mt-25" id="nav-tabContent">
          <div
            className="tab-pane fade active show"
            id="nav-overview"
            role="tabpanel"
            aria-labelledby="nav-overview-tab"
            tabIndex={0}
          >
                       <p className="mb-15 d-flex align-items-center">
    <strong>Language:</strong>
    {isEditing ? (
      <input
        type="text"
        value={updatedItinerary.language}
        onChange={(e) =>
          setUpdatedItinerary({ ...updatedItinerary, language: e.target.value })
        }
        className="form-control ms-2"
        style={{ width: "auto" }}
      />
    ) : (
      <span>{itineraryData.language}</span>
    )}
    <button
      onClick={() => setIsEditing(!isEditing)}
      className="btn btn-link p-0 ms-2"
      style={{ cursor: "pointer" }}
    >
      <TbEdit size={20} />
    </button>
  </p>

  <p className="mb-15 d-flex align-items-center">
    <strong>Available Dates:</strong>
    {isEditing ? (
      itineraryData.availableDates.map((date, index) => (
        <input
          key={index}
          type="date"
          value={new Date(date).toISOString().substring(0, 10)}
          onChange={(e) => {
            const newDates = [...itineraryData.availableDates];
            newDates[index] = new Date(e.target.value);
            setUpdatedItinerary({ ...updatedItinerary, availableDates: newDates });
          }}
          className="form-control ms-2"
          style={{ width: "auto" }}
        />
      ))
    ) : (
      <span>
        {itineraryData.availableDates.map((date, index) => (
          <span key={index}>
            {formatDate(date)}
            {index < itineraryData.availableDates.length - 1 ? ", " : ""}
          </span>
        ))}
      </span>
    )}
    <button
      onClick={() => setIsEditing(!isEditing)}
      className="btn btn-link p-0 ms-2"
      style={{ cursor: "pointer" }}
    >
      <TbEdit size={20} />
    </button>
  </p>
  <p className="mb-15 d-flex align-items-center">
    <strong>Pickup Location:</strong>
    {isEditing ? (
      <input
        type="text"
        value={updatedItinerary.pickupLocation}
        onChange={(e) =>
          setUpdatedItinerary({
            ...updatedItinerary,
            pickupLocation: e.target.value,
          })
        }
        className="form-control ms-2"
        style={{ width: "auto" }}
      />
    ) : (
      <span>{itineraryData.pickupLocation}</span>
    )}
    <button
      onClick={() => setIsEditing(!isEditing)}
      className="btn btn-link p-0 ms-2"
      style={{ cursor: "pointer" }}
    >
      <TbEdit size={20} />
    </button>
  </p>

  <p className="mb-15 d-flex align-items-center">
    <strong>Dropoff Location:</strong>
    {isEditing ? (
      <input
        type="text"
        value={updatedItinerary.dropoffLocation}
        onChange={(e) =>
          setUpdatedItinerary({
            ...updatedItinerary,
            dropoffLocation: e.target.value,
          })
        }
        className="form-control ms-2"
        style={{ width: "auto" }}
      />
    ) : (
      <span>{itineraryData.dropoffLocation}</span>
    )}
    <button
      onClick={() => setIsEditing(!isEditing)}
      className="btn btn-link p-0 ms-2"
      style={{ cursor: "pointer" }}
    >
      <TbEdit size={20} />
    </button>
  </p>


  <p className="mb-15 d-flex align-items-center">
  <strong>Tags:</strong>
  {isEditing ? (
    <input
      type="text"
      value={updatedItinerary.tags.join(", ")}
      onChange={(e) =>
        setUpdatedItinerary({
          ...updatedItinerary,
          tags: e.target.value.split(",").map((tag) => tag.trim()),
        })
      }
      className="form-control ms-2"
      style={{ width: "auto" }}
    />
  ) : (
    <span>{itineraryData.tags.join(", ")}</span>
  )}
  <button
    onClick={() => setIsEditing(!isEditing)}
    className="btn btn-link p-0 ms-2"
    style={{ cursor: "pointer" }}
  >
    <TbEdit size={20} />
  </button>
</p>


<p className="mb-15 d-flex align-items-center">
  <strong>Price:</strong>
  {isEditing ? (
    <input
      type="number"
      value={updatedItinerary.price}
      onChange={(e) =>
        setUpdatedItinerary({ ...updatedItinerary, price: +e.target.value })
      }
      className="form-control ms-2"
      style={{ width: "auto" }}
    />
  ) : (
    <span>{itineraryData.price} USD</span>
  )}
  <button
    onClick={() => setIsEditing(!isEditing)}
    className="btn btn-link p-0 ms-2"
    style={{ cursor: "pointer" }}
  >
    <TbEdit size={20} />
  </button>
</p>

<p className="mb-15 d-flex align-items-center">
  <strong>Duration:</strong>
  {isEditing ? (
    <input
      type="text"
      value={updatedItinerary.duration}
      onChange={(e) =>
        setUpdatedItinerary({ ...updatedItinerary, duration: e.target.value })
      }
      className="form-control ms-2"
      style={{ width: "auto" }}
    />
  ) : (
    <span>{itineraryData.duration}</span>
  )}
  <button
    onClick={() => setIsEditing(!isEditing)}
    className="btn btn-link p-0 ms-2"
    style={{ cursor: "pointer" }}
  >
    <TbEdit size={20} />
  </button>
</p>

<p className="mb-15 d-flex align-items-center">
  <strong>Timeline:</strong>
  {isEditing ? (
    <textarea
      value={updatedItinerary.timeline}
      onChange={(e) =>
        setUpdatedItinerary({ ...updatedItinerary, timeline: e.target.value })
      }
      className="form-control ms-2"
      style={{ width: "auto" }}
    />
  ) : (
    <span>{itineraryData.timeline}</span>
  )}
  <button
    onClick={() => setIsEditing(!isEditing)}
    className="btn btn-link p-0 ms-2"
    style={{ cursor: "pointer" }}
  >
    <TbEdit size={20} />
  </button>
</p>
<p className="mb-15 d-flex align-items-center">
  <strong>Accessibility:</strong>
  {isEditing ? (
    <input
      type="checkbox"
      checked={updatedItinerary.accessibility}
      onChange={(e) =>
        setUpdatedItinerary({ ...updatedItinerary, accessibility: e.target.checked })
      }
      className="form-check-input ms-2"
    />
  ) : (
    <span>{itineraryData.accessibility ? "Accessible" : "Not Accessible"}</span>
  )}
  <button
    onClick={() => setIsEditing(!isEditing)}
    className="btn btn-link p-0 ms-2"
    style={{ cursor: "pointer" }}
  >
    <TbEdit size={20} />
  </button>
</p>
 

              <div className="tour-details-faq mb-35">
  <h4 className="mb-20 d-flex align-items-center">
    Available Activities
    <button
      onClick={() => setIsEditing(!isEditing)}
      className="btn btn-link p-0 ms-2"
      style={{ cursor: "pointer" }}
    >
      <TbEdit size={20} />
    </button>
  </h4>
  <div className="accordion-wrapper faq-style-3">
    {isEditing ? (
      <textarea
        value={updatedItinerary.activities || itineraryData.activities}
        onChange={(e) =>
          setUpdatedItinerary({
            ...updatedItinerary,
            activities: e.target.value,
          })
        }
        className="form-control"
        style={{ width: "100%", minHeight: "100px" }}
      />
    ) : (
      <div className="accordion" id="accordionExampleThree">
        {itineraryData.activities.split(",").map((activity, index) => (
          <div className="accordion-item" key={index}>
            <h6 className="accordion-header" id={`heading${index}`}>
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${index}`}
                aria-expanded="true"
                aria-controls={`collapse${index}`}
              >
                <span>Activity {index + 1}:</span> {activity.trim()}
              </button>
            </h6>
            <div
              id={`collapse${index}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading${index}`}
              data-bs-parent="#accordionExampleThree"
            >
              {/* Additional content for each activity can go here */}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  {isEditing && (
    <button
      onClick={() => handleSaveChanges(itineraryData._id, tourGuideData._id)}
      className="btn btn-primary mt-3"
    >
      Save Changes
    </button>
  )}
</div>



          </div>
          {/* Gallery Tab */}
         

             
            
           
          </div>
        </div>
     
    </>
  );
};

export default TourDetailTabArea;