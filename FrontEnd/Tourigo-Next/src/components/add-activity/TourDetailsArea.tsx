"use client";
import React, { useState,FormEvent,ChangeEvent} from "react";
import UploadSingleImg from "./UploadSingleImg";
import TourGallery from "./TourGallary";
import TourContent from "./TourContent";
import NiceSelect from "@/elements/NiceSelect";
import { selectLocationData } from "@/data/nice-select-data";
import ErrorMessage from "@/elements/error-message/ErrorMessage";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { createActivity } from "@/api/activityApi";
import { File } from "@/interFace/interFace";
// interface FormData {
//   tag: string;
//   discount: string;
//   tourTitle: string;
//   packagePrice: string;
//   tourPackageRating: string;
//   facebookLink: string;
//   twitterLink: string;
//   linkedInLink: string;
//   youtubeLink: string;
//   duration: string;
//   minAge: string;
//   tourType: string;
//   location: string;
//   address: string;
//   email: string;
//   phone: string;
//   website: string;
// }
interface NewActivity {
  date: string;
  time: string;
  location: {
      type: string;
      address: string;
      lat: number;
      lng: number;
  };
  price: number;
  category: string;
  tags: string[];
  specialDiscounts: string;
  bookingOpen: boolean;
  advertiser: string;
  ratings: number;
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

  const advertiserId ="67077683ab11089b0772dcb6"; 
  const [newActivity, setNewActivity] = React.useState<NewActivity>({
    date: '',
    time: '',
    location: { type: 'Point', address: '', lat: 0, lng: 0 },
    price: 0,
    category: '',
    tags: [],
    specialDiscounts: '',
    bookingOpen: true,
    advertiser: advertiserId,  // Replace with actual advertiser ID
    ratings: 0,
});
  

  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityId, setActivityId] = useState('');

  
  const handleAddActivity = async (e:FormEvent) => {
    e.preventDefault();
    try {
      const response = await createActivity(newActivity);
      
      alert(response.message || "Activity added successfully");

    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Failed to add activity.');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
        const [outerKey, innerKey] = name.split('.');
        
        setNewActivity(prevState => {
            const outerObject = prevState[outerKey as keyof NewActivity];
            
            // Check if outerObject is an object (to allow spreading)
            if (typeof outerObject === 'object' && outerObject !== null) {
                return {
                    ...prevState,
                    [outerKey]: {
                        ...outerObject,
                        [innerKey]: value
                    }
                };
            }

            return prevState;
        });
    } else {
        setNewActivity(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
};


  

  return (
    <>
      <section className="bd-tour-details-area section-space">
        <form onSubmit={handleAddActivity}>
          <div className="container">
            <div className="row gy-24 justify-content-center">
              <div className="col-xxl-12 col-xl-12 col-lg-12">
                <div className="tour-details-wrapper">
                  <div className="tour-details mb-25">
                    {/* Upload Img */}
                    <UploadSingleImg setlargeImg={setlargeImg} />
                    <div className="form-input-box mb-15">
                        <div className="form-input-title">
                          <label htmlFor="tourTitle">
                            Tour Title <span>*</span>
                          </label>
                        </div>
                        <div className="form-input">
                          
                           <input type="text" name="name"  onChange={handleInputChange} required />
                          
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
                                    <label htmlFor="packagePrice">
                                      Tour Package Price<span>*</span>
                                    </label>
                                  </div>
                                  <div className="form-input">
                                    
                                     <input type="number" name="price" value={newActivity.price} onChange={handleInputChange} required />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-input-box">
                                <div className="form-input-title">
                                  <label htmlFor="tourPackageRating">
                                    Discount
                                  </label>
                                </div>
                                <div className="form-input">
                                <input type="text" name="specialDiscounts" value={newActivity.specialDiscounts} onChange={handleInputChange} />
                                  
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
                                <label htmlFor="duration">
                                  Time<span>*</span>
                                </label>
                              </div>
                              <div className="form-input">
                              <input type="text" name="time" value={newActivity.time} onChange={handleInputChange} required />
                                
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="tour-details-destination-info">
                          <div className="tour-details-destination-info-title">
                            <div className="form-input-box">
                              <div className="form-input-title">
                                <label htmlFor="tourType">
                                  Tour Category<span>*</span>
                                </label>
                              </div>
                              <div className="form-input">
                              <input type="text" name="category" value={newActivity.category} onChange={handleInputChange} required />
                                
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tour-details-destination-info">
                          <div className="tour-details-destination-info-title">
                            <div className="form-input-box">
                              <div className="form-input-title">
                                <label htmlFor="location">
                                  Date<span>*</span>
                                </label>
                              </div>
                              <div className="form-input">
                              <input type="date" name="date" value={newActivity.date} onChange={handleInputChange} required />
                                
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
                        <h4 className="mb-20">Tour Galley</h4>

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
                                  <input type="text" name="location.address" value={newActivity.location.address} onChange={handleInputChange} required />
                                    
                                  </div>
                                </div>
                              </div>
                             
                              {/* <MultiSelect/> */}

                             
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
                  Add Activity
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
