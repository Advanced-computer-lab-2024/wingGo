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

const TourDetails = ({ id }: idTypeNew) => {
  const [data, setData] = useState<Place | null>(null);

  // State for editable fields
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
  const handleUpdate = async () => {
    try {
      const updatedData = {
        name,
        description,
        location,
        openingHours,
        ticketPrices,
        tagss,
      };
      const updatedPlace = await updatePlace(id, '671590cc00553989f62a041f',updatedData);
      setData(updatedPlace); // Update the state with the new data
      alert("Place updated successfully.");
    } catch (error) {
      console.error("Error updating place:", error);
      alert("Failed to update place.");
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
                    {/* Image */}
                    <div className="tour-details-thumb details-slide-full mb-30">
                      <Image
                        src={data?.pictures[0]}
                        loader={imageLoader}
                        style={{ width: "100%", height: "auto" }}
                        alt="image"
                      />
                    </div>
                    <div className="tour-details-content">
                      
                      {/* Badges */}
                      <div className="tour-details-badge d-flex gap--5 mb-10">
                        <span className="bd-badge warning fw-5">Featured</span>
                        {data.flagged && <span className="bd-badge danger fw-5">Flagged</span>}
                      </div>
  
                      {/* Title and Description */}
                      <h3 className="tour-details-title mb-15">{data?.name}</h3>
                      <p className="tour-details-description">{data?.description}</p>
  
                      {/* Meta Section */}
                      <div className="tour-details-meta d-flex flex-wrap gap-10 align-items-center justify-content-between mb-20">
                        <div className="tour-details-meta-right d-flex flex-wrap gap-10 align-items-center justify-content-between">
                          <div className="theme-social">
                            <Link href="https://www.facebook.com/"><i className="icon-facebook"></i></Link>
                            <Link href="https://www.twitter.com/"><i className="icon-twitter-x"></i></Link>
                            <Link href="https://www.linkedin.com/"><i className="icon-linkedin"></i></Link>
                            <Link href="https://www.youtube.com/"><i className="icon-youtube"></i></Link>
                          </div>
                        </div>
                      </div>
  
                      {/* Details Info */}
                      <div className="tour-details-destination-wrapper">
                        
                        {/* Opening Hours */}
                        <div className="tour-details-destination-info">
                          <div className="search-icon-bg is-big">
                            <span><i className="fa-light fa-clock"></i></span>
                          </div>
                          <div className="tour-details-destination-info-title">
                            <p className="tour-details-destination-info-top mb-0">Opening Hours</p>
                            <span className="tour-details-destination-info-bottom small">{data?.openingHours}</span>
                          </div>
                        </div>
  
                        {/* Location */}
                        <div className="tour-details-destination-info">
                          <div className="search-icon-bg is-big">
                            <span><i className="fa-light fa-location-dot"></i></span>
                          </div>
                          <div className="tour-details-destination-info-title">
                            <p className="tour-details-destination-info-top mb-0">Location</p>
                            <span className="tour-details-destination-info-bottom">{data?.location}</span>
                          </div>
                        </div>
  
                        {/* Ticket Prices */}
                        <div className="tour-details-destination-info">
                          <div className="search-icon-bg is-big">
                            <span><i className="fa-light fa-ticket"></i></span>
                          </div>
                          <div className="tour-details-destination-info-title">
                            <p className="tour-details-destination-info-top mb-0">Ticket Prices</p>
                            <span className="tour-details-destination-info-bottom small">
                              Foreigner: ${data?.ticketPrices.foreigner}, Native: ${data?.ticketPrices.native}, Student: ${data?.ticketPrices.student}
                            </span>
                          </div>
                        </div>
  
                        {/* Tags */}
                        <div className="tour-details-destination-info">
                          <div className="search-icon-bg is-big">
                            <span><i className="icon-tags"></i></span>
                          </div>
                          <div className="tour-details-destination-info-title">
                            <p className="tour-details-destination-info-top mb-0">Tags</p>
                            <span className="tour-details-destination-info-bottom small">
                              {data?.tagss.join(", ")}
                            </span>
                          </div>
                        </div>
                      </div>
  
                      {/* Tab Area */}
                      <TourDetailTabArea id={id} />
  
                      {/* Related Tours */}
                      <div className="tour-details-related-tour mb-35">
                        <h4 className="mb-20">Related Places</h4>
                        {/* Add related places component here */}
                      </div>
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
