// TourGridRight.tsx

"use client";
import React, { useEffect, useState } from "react";
import SidebarSearchArea from "../shearedComponents/SidebarSearchArea";
import PaginationWrapper from "../shearedComponents/PaginationWrapper";
import TourSingleCard from "../common/tourElements/ActivitySingleCard";
import { Activity } from "@/interFace/interFace";
import { getActivitiesData,getActivities_Adv } from "@/data/act-data";
import BookingFormModal from "@/elements/modals/BookingFormModal";

const TourGridRight = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const data = await getActivities_Adv();
      setActivities(data || []);  // Fallback to an empty array if data is undefined
    };
    fetchActivities();
  }, []);

  return (
    <>
      <section className="bd-tour-grid-area section-space">
        <div className="container">
          <div className="row gy-24">
            <div className="col-xxl-8 col-xl-8 col-lg-7">
              <div className="row gy-24">
                {/* Conditional rendering to ensure activities is an array */}
                {activities?.length > 0 ? (
                  activities.map((item) => (
                    <TourSingleCard
                      tour={item}
                      key={item._id}
                      className="col-xxl-4 col-xl-6 col-lg-6 col-md-6"
                      tourWrapperClass="tour-wrapper style-one"
                      isparentClass={true}
                      isAdvertiser={true}
                    />
                  ))
                ) : (
                  <p>No activities found.</p>
                )}
              </div>
            </div>
            <div className="col-xxl-4 col-xl-4 col-lg-5">
              <SidebarSearchArea placeHolderTextData="Tour Place" />
            </div>
          </div>
          <PaginationWrapper />
        </div>
      </section>
      <BookingFormModal />
    </>
  );
};

export default TourGridRight;
