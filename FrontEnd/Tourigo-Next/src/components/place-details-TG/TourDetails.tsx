//TourDetails.tsx
"use client";
import { imageLoader } from "@/hooks/image-loader";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import TourDetailTabArea from "./TourDetailTabArea";
import { tourData } from "@/data/tour-data";
import { Place } from "@/interFace/interFace";
import { idTypeNew } from "@/interFace/interFace";
import TourSingleCard from "../common/tourElements/TourSingleCardPlacesTG";
import BookingFormModal from "@/elements/modals/BookingFormModal";
import {updatePlace} from '@/api/placesApi';

type EditableField = "name" | "description" | "location" | "openingHours" | "ticketPrices" | "tagss";

const TourDetails = ({ id }: idTypeNew) => {
  const [data, setData] = useState<Place | null>(null);

  // Editable fields states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [ticketPrices, setTicketPrices] = useState({
    foreigner: 0,
    native: 0,
    student: 0,
  });
  const [tagss, setTagss] = useState<string[]>([]);

  // Toggle states for edit mode
  const [editMode, setEditMode] = useState({
    name: false,
    description: false,
    location: false,
    openingHours: false,
    ticketPrices: false,
    tagss: false,
  });

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/govornor/getPlace/${id}`);
        setData(response.data);
        const placeData = response.data;
        setData(placeData);

        // Initialize form fields with fetched data
        setName(placeData.name);
        setDescription(placeData.description);
        setLocation(placeData.location);
        setOpeningHours(placeData.openingHours);
        setTicketPrices(placeData.ticketPrices);
        setTagss(placeData.tagss);
      } catch (error) {
        console.error("Error fetching Place data:", error);
      }
    };

    fetchPlace();
  }, [id]);
  const handleToggleEdit = (field:EditableField) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFieldSave = async (field: EditableField) => {
    try {
      // Prepare the updated data based on the field being updated
      const updatedData = {
        [field]: field === "ticketPrices" ? ticketPrices : field === "tagss" ? tagss : {
          name,
          description,
          location,
          openingHours,
          ticketPrices
        }[field], // Get the updated field value dynamically
      };
  
      // Call the update API to update the place on the backend
      const updatedPlace = await updatePlace(id, "671590cc00553989f62a041f", updatedData);
  
      // Update the data, ensuring the result is of type `Place | null`
      setData((prevData) => {
        if (prevData) {
          return { ...prevData, [field]: updatedData[field] }; // Merge the updated field with existing data
        }
        return prevData; // In case prevData is null, return it as is
      });
  
      // Exit edit mode for the field and display success alert
      handleToggleEdit(field);
      alert(`${field} updated successfully.`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      alert(`Failed to update ${field}.`);
    }
  };
  

  if (!data) return <div>Loading...</div>;
  return (
    <>
      <section className="bd-tour-details-area section-space">
        {data?._id && (
          <div className="container">
            <div className="row gy-24 justify-content-center">
              <div className="col-xxl-12 col-xl-12 col-lg-12">
                <div className="tour-details-wrapper">
                  <div className="tour-details mb-25">
                    <div className="tour-details-thumb details-slide-full mb-30">
                      <Image
                        src={data.pictures[0]}
                        loader={imageLoader}
                        style={{ width: "100%", height: "auto" }}
                        alt="image"
                      />
                    </div>
                    <div className="tour-details-content">
                      <h3 className="tour-details-title mb-15">
                        {editMode.name ? (
                          <>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                            <button onClick={() => handleFieldSave("name")}>Save</button>
                          </>
                        ) : (
                          <>
                            {data.name}
                            <button onClick={() => handleToggleEdit("name")}>Edit</button>
                          </>
                        )}
                      </h3>

                      {/* Description */}
                      <p className="tour-details-description">
                        {editMode.description ? (
                          <>
                            <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            />
                            <button onClick={() => handleFieldSave("description")}>Save</button>
                          </>
                        ) : (
                          <>
                            {data.description}
                            <button onClick={() => handleToggleEdit("description")}>Edit</button>
                          </>
                        )}
                      </p>

                      {/* Location */}
                      <div className="tour-details-destination-info">
                        <p>Location</p>
                        {editMode.location ? (
                          <>
                            <input
                              type="text"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                            />
                            <button onClick={() => handleFieldSave("location")}>Save</button>
                          </>
                        ) : (
                          <>
                            {data.location}
                            <button onClick={() => handleToggleEdit("location")}>Edit</button>
                          </>
                        )}
                      </div>

                      {/* Opening Hours */}
                      <div className="tour-details-destination-info">
                        <p>Opening Hours</p>
                        {editMode.openingHours ? (
                          <>
                            <input
                              type="text"
                              value={openingHours}
                              onChange={(e) => setOpeningHours(e.target.value)}
                            />
                            <button onClick={() => handleFieldSave("openingHours")}>Save</button>
                          </>
                        ) : (
                          <>
                            {data.openingHours}
                            <button onClick={() => handleToggleEdit("openingHours")}>Edit</button>
                          </>
                        )}
                      </div>

                      {/* Ticket Prices */}
                      <div className="tour-details-destination-info">
                        <p>Ticket Prices</p>
                        {editMode.ticketPrices ? (
                          <>
                            {["foreigner", "native", "student"].map((type) => (
                          <div key={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}:
                            <input
                              type="number"
                              value={ticketPrices[type as keyof typeof ticketPrices]} // Type assertion for key access
                              onChange={(e) =>
                                setTicketPrices((prev) => ({
                                  ...prev,
                                  [type]: Number(e.target.value), // Update the specific field
                                }))
                              }
                            />
                          </div>
                        ))}
                            <button onClick={() => handleFieldSave("ticketPrices")}>Save</button>
                          </>
                        ) : (
                          <>
                            Foreigner: ${data.ticketPrices.foreigner}, Native: ${data.ticketPrices.native}, Student: ${data.ticketPrices.student}
                            <button onClick={() => handleToggleEdit("ticketPrices")}>Edit</button>
                          </>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="tour-details-destination-info">
                        <p>Tags</p>
                        {editMode.tagss ? (
                          <>
                            <input
                              type="text"
                              value={tagss.join(", ")}
                              onChange={(e) =>
                                setTagss(e.target.value.split(",").map((tag) => tag.trim()))
                              }
                            />
                            <button onClick={() => handleFieldSave("tagss")}>Save</button>
                          </>
                        ) : (
                          <>
                            {data.tagss.join(", ")}
                            <button onClick={() => handleToggleEdit("tagss")}>Edit</button>
                          </>
                        )}
                      </div>

                      <TourDetailTabArea id={id} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      <BookingFormModal />
    </>
  );
};

export default TourDetails;
