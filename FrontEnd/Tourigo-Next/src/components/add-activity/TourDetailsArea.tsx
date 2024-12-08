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

import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
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
  name:string;
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
  specialDiscounts: string;
  isBookingOpen: boolean;
  advertiser: string;
  
}

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
interface Suggestion {
  label: string;
  x: number;
  y: number;
}

const TourDetailsArea = () => {
  const advertiserId ="67521d930982497fbe368837"; 
  const [newActivity, setNewActivity] = React.useState<NewActivity>({
    name:'',
    date: '',
    time: '',
    location: { type: 'Point', address: '', lat: 0, lng: 0 },
    price: 0,
    category: '',
    specialDiscounts: '',
    isBookingOpen: true,
    advertiser: advertiserId,  // Replace with actual advertiser ID
    
});
  
const [image, setImage] = useState<File | null>(null);
const [largeImg, setlargeImg] = useState<string>("");
  
  const [addressQuery, setAddressQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 45.652478, lng: 25.596463 });
  const [markerPosition, setMarkerPosition] = useState(mapCenter);

  const provider = new OpenStreetMapProvider();

  const searchAddress = async (query: string) => {
    const results: Suggestion[] = await provider.search({ query });
    setSuggestions(results);
  };

  const handleSelectAddress = (suggestion: Suggestion) => {
    setAddressQuery(suggestion.label); // Update the address query
    const newLatLng = { lat: suggestion.y, lng: suggestion.x }; // Use suggestion coordinates
    setMapCenter(newLatLng); // Update map center
    setMarkerPosition(newLatLng); // Update marker position
    setSuggestions([]); // Clear suggestions list
  };
  

  
  const handleAddActivity = async (e: FormEvent) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    // Append basic fields
    formData.append("name", newActivity.name);
    formData.append("date", newActivity.date);
    formData.append("time", newActivity.time);
    formData.append("price", String(newActivity.price));
    formData.append("category", newActivity.category);
    formData.append("specialDiscounts", newActivity.specialDiscounts);
    formData.append("isBookingOpen", String(newActivity.isBookingOpen));
    formData.append("advertiser", newActivity.advertiser);
  
    // Ensure correct location field
    const locationData = {
      type: "Point",
      address: addressQuery || newActivity.location.address,  // Correct address source
      lat: markerPosition.lat,
      lng: markerPosition.lng,
    };
    
    formData.append("location", String(locationData));
  
    // Append image if present
    if (image) {
      formData.append("file", image);
    }
  
    try {
      // Make the API call
      const response = await createActivity(formData);
      toast.success(response.message || "Activity added successfully");
  
      // Reset form after success
      setNewActivity({
        name: "",
        date: "",
        time: "",
        location: { type: "Point", address: "", lat: 0, lng: 0 },
        price: 0,
        category: "",
        specialDiscounts: "",
        isBookingOpen: true,
        advertiser: advertiserId,
      });
      setAddressQuery("");
      setMarkerPosition({ lat: 45.652478, lng: 25.596463 });
    } catch (error) {
      console.error("Error adding activity:", error);
      toast.error("Failed to add activity.");
    }
  };
  
  

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
  
    setNewActivity((prev) => ({
      ...prev,
      [name]: name === "tags"
        ? value.split(",").map((tag) => tag.trim()) // Handle tags as an array
        : name === "location.address"
        ? { ...prev.location, address: value } // Update nested location address
        : type === "checkbox"
        ? checked // Handle checkbox input
        : name === "price"
        ? Number(value) // Ensure price is a number
        : value, // Default assignment for other fields
    }));
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
                    <UploadSingleImg setlargeImg={setlargeImg} setImage={setImage}/>

                    <div className="form-input-box mb-15">
                        <div className="form-input-title">
                          <label htmlFor="tourTitle">
                            Activity Title <span>*</span>
                          </label>
                        </div>
                        <div className="form-input">
                          
                           <input type="text" name="name" value={newActivity.name} onChange={handleInputChange} required />
                          
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
                                      Activity Price<span>*</span>
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
                                  Activity Category<span>*</span>
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
                        <h4 className="mb-20">Activity Content</h4>
                        <TourContent />
                      </div>
                      <div className="tour-details-gallery mb-35">
                        <h4 className="mb-20">Activity Galley</h4>

                        <TourGallery />
                      </div>
                      <div className="tour-details-location mb-35">
        <h4 className="mb-20">Location</h4>
        <div className="form-input-box mb-20">
        <input
  type="text"
  name="location"
  value={addressQuery}
  onChange={(e) => {
    setAddressQuery(e.target.value); // Update the input value
    searchAddress(e.target.value); // Fetch suggestions for typed address
  }}
  placeholder="Type an address"
  className="form-input"
/>
{suggestions.length > 0 && (
  <ul className="suggestions-list">
    {suggestions.map((s, index) => (
      <li key={index} onClick={() => handleSelectAddress(s)}>
        {s.label}
      </li>
    ))}
  </ul>
)}
        </div>
        <div style={{ height: "400px", width: "100%" }}>
        <MapContainer
  center={mapCenter}
  zoom={13}
  style={{ height: "100%", width: "100%" }}
  key={JSON.stringify(mapCenter)} // Force re-render when center changes
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
  />
<Marker
  position={markerPosition}
  icon={customIcon}
  draggable={true} // Enable dragging
  eventHandlers={{
    dragend: (e) => {
      const marker = e.target as L.Marker; // Get the marker instance
      const position = marker.getLatLng(); // Get new position after dragging
      setMarkerPosition(position); // Update marker position state

      // Perform reverse geocoding to get the new address
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
      )
        .then((response) => response.json())
        .then((data) => {
          setAddressQuery(data.display_name || "Unknown location"); // Update the text box with the new address
        });
    },
  }}
></Marker>
  </MapContainer>
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
