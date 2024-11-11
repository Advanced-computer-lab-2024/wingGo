"use client";
import React, { useState,useEffect,FormEvent,ChangeEvent} from "react";
import UploadSingleImg from "./UploadSingleImg";
import TourGallery from "./TourGallary";
import TourContent from "./TourContent";
import NiceSelect from "@/elements/NiceSelect";
import { selectLocationData } from "@/data/nice-select-data";
import ErrorMessage from "@/elements/error-message/ErrorMessage";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { createItinerary, fetchAllItineraries  } from "@/api/itineraryApi";
import { File } from "@/interFace/interFace";
import { Itinerary } from "@/interFace/interFace";
import{getItinerariesData} from '@/data/it-data';
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
  const [largeImg, setlargeImg] = useState<string>("");
  const initialState: NewItinerary = {
    tourGuideId: '67325c530b3e54ad8bfe1678',  // Replace with actual ID or dynamic ID
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
    dropoffLocation: ""
  };
const [newItinerary, setNewItinerary] = useState<NewItinerary>(initialState);
const [itineraries, setItineraries] = useState<Itinerary[]>([]); 
const touristId = '67240ed8c40a7f3005a1d01d';  // Hardcoded tourist ID, or get it dynamically if needed


// Fetch itineraries when the component mounts
useEffect(() => {
  const getItinerariesData = async () => {
    try {
      // Fetch itineraries by passing the touristId
      const fetchedItineraries = await fetchAllItineraries();
      setItineraries(fetchedItineraries);
    } catch (error) {
      console.error("Error loading itineraries:", error);
    }
  };

  getItinerariesData();
}, [touristId]);  // Runs once when the component mounts



  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setNewItinerary((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value.split(",").map(tag => tag.trim());
    setNewItinerary((prev) => ({ ...prev, tags: tagsArray }));
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewItinerary((prev) => ({
      ...prev,
      locations: value.split(",").map(loc => loc.trim()), // Assume comma-separated for multiple locations
    }));
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewItinerary((prev) => ({
      ...prev,
      availableDates: [...prev.availableDates, e.target.value],
    }));
  };

  const handleAddItinerary = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitting itinerary:", newItinerary); // Add this line
    try {
      await createItinerary(newItinerary);
      toast.success("Itinerary added successfully!");
      setNewItinerary(initialState);
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
                <UploadSingleImg setlargeImg={setlargeImg} />

                <div className="form-input-box mb-15">
                  <label>Itinerary Title<span>*</span></label>
                  <input type="text" name="title" value={newItinerary.title} onChange={handleInputChange} required />
                </div>

                <div className="form-input-box mb-15">
                  <label>Tags (comma-separated)</label>
                  <input type="text" name="tags" value={newItinerary.tags.join(", ")} onChange={handleTagsChange} />
                </div>

                <div className="form-input-box">
                  <label>Price<span>*</span></label>
                  <input type="number" name="price" value={newItinerary.price} onChange={handleInputChange} required />
                </div>

                <div className="form-input-box">
                  <label>Available Dates<span>*</span></label>
                  <input type="date" name="availableDates" value={newItinerary.availableDates.join(", ")} onChange={handleDateChange} required />
                </div>

                <div className="form-input-box">
                  <label>Activities<span>*</span></label>
                  <input type="text" name="activities"  value={newItinerary.activities} onChange={handleInputChange} required />
                </div>

                <div className="form-input-box">
                  <label>Timeline<span>*</span></label>
                  <input type="text" name="timeline" value={newItinerary.timeline} onChange={handleInputChange} required />
                </div>

                <div className="form-input-box">
                  <label>Duration<span>*</span></label>
                  <input type="text" name="duration" value={newItinerary.duration} onChange={handleInputChange} required />
                </div>

                <div className="form-input-box">
                  <label>Language<span>*</span></label>
                  <input type="text" name="language" value={newItinerary.language} onChange={handleInputChange} required />
                </div>

                <div className="form-input-box">
                  <label>Locations<span>*</span></label>
                  <input type="text" name="locations" value={newItinerary.locations.join(", ")} onChange={handleLocationChange} placeholder="Enter locations separated by commas" required />
                </div>

                <div className="form-input-box">
                  <label>Pickup Location<span>*</span></label>
                  <input type="text" name="pickupLocation"  value={newItinerary.pickupLocation} onChange={handleInputChange} required />
                </div>

                <div className="form-input-box">
                  <label>Dropoff Location<span>*</span></label>
                  <input type="text" name="dropoffLocation" value={newItinerary.dropoffLocation} onChange={handleInputChange} required />
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