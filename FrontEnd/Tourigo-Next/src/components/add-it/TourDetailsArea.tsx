"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";
import UploadSingleImg from "./UploadSingleImg"; 
import { toast } from "sonner";
import { createItinerary } from "@/api/itineraryApi";

interface NewItinerary {
  tourGuideId: string;
  title: string;
  tags: string[];
  activities: string;
  locations: string[];
  timeline: string;
  duration: string;
  language: string;
  price: number;
  availableDates: string[];
  accessibility: boolean;
  pickupLocation: string;
  dropoffLocation: string;
}

const TourDetailsArea = () => {
  const [itinerary, setItinerary] = useState<NewItinerary>({
    tourGuideId: "67325c530b3e54ad8bfe1678", 
    title: "",
    tags: [],
    activities: "",
    locations: [],
    timeline: "",
    duration: "",
    language: "",
    price: 0,
    availableDates: [],
    accessibility: false,
    pickupLocation: "",
    dropoffLocation: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [largeImg, setlargeImg] = useState<string>("");


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
  
    setItinerary((prev) => ({
      ...prev,
      [name]: name === "availableDates" 
        ? [...prev.availableDates, value]  // Add new date to array
        : name === "locations"
        ? value.split(",").map((loc) => loc.trim()) // Split for locations
        : type === "checkbox" 
        ? checked 
        : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAddItinerary = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    // Append form data fields
    formData.append("tourGuideId", itinerary.tourGuideId);
    formData.append("title", itinerary.title);
    formData.append("tags", String(itinerary.tags));
    formData.append("activities", itinerary.activities);
    formData.append("locations", String(itinerary.locations));
    formData.append("timeline", itinerary.timeline);
    formData.append("duration", itinerary.duration);
    formData.append("language", itinerary.language);
    formData.append("price", String(itinerary.price));
    formData.append("availableDates", String(itinerary.availableDates));
    formData.append("pickupLocation", itinerary.pickupLocation);
    formData.append("dropoffLocation", itinerary.dropoffLocation);

    if (image) {
      formData.append("file", image);
    }

    try {
      const response = await createItinerary(formData);
      toast.success(response.message || "Itinerary added successfully");
    } catch (error) {
      console.error("Error adding itinerary:", error);
      toast.error("Failed to add itinerary.");
    }
  };

  return (
    <section className="bd-tour-details-area section-space">
      <form onSubmit={handleAddItinerary}>
        <div className="container">
          <div className="row gy-24 justify-content-center">
            <div className="col-xxl-12 col-xl-12 col-lg-12">
              <div className="tour-details-wrapper">
                <UploadSingleImg setlargeImg={setlargeImg} setImage={setImage}/>

                <div className="form-input-box mb-15">
                  <label htmlFor="title">Itinerary Title<span>*</span></label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={itinerary.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-input-box mb-15">
                  <label htmlFor="tags">Tags (comma-separated)</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={itinerary.tags.join(", ")}
                    onChange={(e) =>
                      setItinerary((prev) => ({
                        ...prev,
                        tags: e.target.value.split(",").map((tag) => tag.trim()),
                      }))
                    }
                  />
                </div>

                <div className="form-input-box">
                  <label htmlFor="price">Price<span>*</span></label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={itinerary.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-input-box">
                  <label htmlFor="availableDates">Available Dates<span>*</span></label>
                  <input
                    type="date"
                    id="availableDates"
                    name="availableDates"
                    onChange={(e) =>
                      setItinerary((prev) => ({
                        ...prev,
                        availableDates: [...prev.availableDates, e.target.value],
                      }))
                    }
                    required
                  />
                </div>

                <div className="form-input-box">
                  <label htmlFor="activities">Activities<span>*</span></label>
                  <input
                    type="text"
                    id="activities"
                    name="activities"
                    value={itinerary.activities}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-input-box">
                  <label htmlFor="timeline">Timeline<span>*</span></label>
                  <input
                    type="text"
                    id="timeline"
                    name="timeline"
                    value={itinerary.timeline}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-input-box">
                  <label htmlFor="duration">Duration<span>*</span></label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={itinerary.duration}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-input-box">
                  <label htmlFor="language">Language<span>*</span></label>
                  <input
                    type="text"
                    id="language"
                    name="language"
                    value={itinerary.language}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-input-box">
                  <label htmlFor="locations">Locations (comma-separated)<span>*</span></label>
                  <input
                    type="text"
                    id="locations"
                    name="locations"
                    onChange={(e) =>
                      setItinerary((prev) => ({
                        ...prev,
                        locations: e.target.value
                          .split(",")
                          .map((loc) => loc.trim()),
                      }))
                    }
                    required
                  />
                </div>

                <div className="form-input-box">
                  <label htmlFor="pickupLocation">Pickup Location<span>*</span></label>
                  <input
                    type="text"
                    id="pickupLocation"
                    name="pickupLocation"
                    value={itinerary.pickupLocation}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-input-box">
                  <label htmlFor="dropoffLocation">Dropoff Location<span>*</span></label>
                  <input
                    type="text"
                    id="dropoffLocation"
                    name="dropoffLocation"
                    value={itinerary.dropoffLocation}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button type="submit" className="bd-btn btn-style radius-4">
                  Add Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};
export default TourDetailsArea;
