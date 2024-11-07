"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";
import UploadSingleImg from "./UploadSingleImg";
import TourGallery from "./TourGallary";
import TourContent from "./TourContent";
import NiceSelect from "@/elements/NiceSelect";
import ErrorMessage from "@/elements/error-message/ErrorMessage";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { createPlace } from "@/api/placesApi";
import { selectLocationData } from "@/data/nice-select-data";
import { File } from "@/interFace/interFace";

interface NewPlace {
  governorId: string;
  name: string;
  description: string;
  pictures: string[];
  location: string,
  openingHours: string;
  ticketPrices: {
    foreigner: number;
    native: number;
    student: number;
  };
  flagged: boolean;
  tagss: string[];
}

const TourDetailsArea = () => {
  const [largeImg, setlargeImg] = useState<string>("");
  const selectHandler = () => {};
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const toastId = toast.loading("");
    const formData = { ...data, largeImg };
    toast.success("Message Send Successfully", { id: toastId, duration: 1000 });
    reset();
  };
  const [newPlace, setNewPlace] = useState<NewPlace>({
    governorId: "1",
    name: "",
    description: "",
    pictures: [],
    location:"",
    openingHours: "",
    ticketPrices: {
      foreigner: 0,
      native: 0,
      student: 0,
    },
    flagged: false,
    tagss: [],
  });
  const [pictureUrl, setPictureUrl] = useState<string>("");

  const handleAddPicture = () => {
    if (pictureUrl.trim()) {
      setNewPlace((prevState) => ({
        ...prevState,
        pictures: [...prevState.pictures, pictureUrl],
      }));
      setPictureUrl("");
    }
  };

  const handleRemovePicture = (index: number) => {
    setNewPlace((prevState) => ({
      ...prevState,
      pictures: prevState.pictures.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [outerKey, innerKey] = name.split(".");
      setNewPlace((prevState) => {
        const outerObject = prevState[outerKey as keyof NewPlace];
        if (typeof outerObject === "object" && outerObject !== null) {
          return {
            ...prevState,
            [outerKey]: {
              ...outerObject,
              [innerKey]: value,
            },
          };
        }
        return prevState;
      });
    } else {
      setNewPlace((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleAddPlace = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await createPlace(newPlace);
      toast.success(response.message || "Place added successfully", {
        duration: 1000,
      });
    } catch (error) {
      console.error("Error adding place:", error);
      toast.error("Failed to add place.");
    }
  };

  return ( 
    <>
      <section className="bd-tour-details-area section-space">
        <form onSubmit={handleAddPlace}>
          <div className="container">
            <div className="row gy-24 justify-content-center">
              <div className="col-xxl-12 col-xl-12 col-lg-12">
                <div className="tour-details-wrapper">
                  <div className="tour-details mb-25">
                    {/* Upload Img */}
                    <UploadSingleImg setlargeImg={setlargeImg} />
                    <div className="form-input-box mb-15">
                      <div className="form-input-title">
                        <label htmlFor="placeTitle">
                          Place Title <span>*</span>
                        </label>
                      </div>
                      <div className="form-input">
                        <input type="text" name="name" onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className="tour-details-content">
                      <div className="mb-20">
                        <div className="tour-details-meta mb-20">
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="tour-details-price">
                                <div className="form-input-box">
                                  <div className="form-input-title">
                                    <label htmlFor="ticketPrice">
                                      Ticket Price<span>*</span>
                                    </label>
                                  </div>
                                  <div className="form-input">
                                    <input type="number" name="ticketPrices.foreigner" value={newPlace.ticketPrices.foreigner} onChange={handleInputChange} required />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-input-box">
                                <div className="form-input-title">
                                  <label htmlFor="ticketPriceNative">
                                    Native Ticket Price
                                  </label>
                                </div>
                                <div className="form-input">
                                  <input type="number" name="ticketPrices.native" value={newPlace.ticketPrices.native} onChange={handleInputChange} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tour-details-destination-wrapper tour-input-wrapp">
                        <div className="tour-details-destination-info">
                          <div className="tour-details-destination-info-title">
                            <div className="form-input-box">
                              <div className="form-input-title">
                                <label htmlFor="openingHours">
                                  Opening Hours<span>*</span>
                                </label>
                              </div>
                              <div className="form-input">
                                <input type="text" name="openingHours" value={newPlace.openingHours} onChange={handleInputChange} required />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tour-details-destination-info">
                          <div className="tour-details-destination-info-title">
                            <div className="form-input-box">
                              <div className="form-input-title">
                                <label htmlFor="placeDescription">
                                  Place Description<span>*</span>
                                </label>
                              </div>
                              <div className="form-input">
                                <input type="text" name="description" value={newPlace.description} onChange={handleInputChange} required />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-35">
                        <h4 className="mb-20">Tour Content</h4>
                        <TourContent />
                      </div>
                      <div className="tour-details-gallery mb-35">
                        <h4 className="mb-20">Tour Gallery</h4>
                        <TourGallery />
                      </div>
                      <div className="tour-details-location mb-35">
                        <h4 className="mb-20">Location</h4>
                        <div className="row gy-24">
                          <div className="col-lg-6">
                            <div className="row gy-24">
                              <div className="col-md-12">
                                <div className="form-input-box">
                                  <div className="form-input-title">
                                    <label htmlFor="address">Address: </label>
                                  </div>
                                  <div className="form-input">
                                    <input type="text" name="location.address" value={newPlace.location} onChange={handleInputChange} required />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="input-box-select w-100">
                                  <NiceSelect
                                    options={selectLocationData}
                                    defaultCurrent={0}
                                    onChange={selectHandler}
                                    name="country"
                                    className="country-select"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="tour-details-location-map">
                              <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d89245.36062680863!2d25.596462799999998!3d45.652478099999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b35b862aa214f1%3A0x6cf5f2ef54391e0f!2sBra%C8%99ov%2C%20Romania!5e0!3m2!1sen!2sbd!4v1707640089632!5m2!1sen!2sbd"
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                              ></iframe>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tour-edit-btn text-start">
                <button type="submit" className="bd-btn btn-style radius-4">
                  Add Place
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
  };
  
export default TourDetailsArea;
