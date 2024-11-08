// TourGridRight.tsx

"use client";
import React, { useEffect, useState } from "react";
import SidebarCategories from "../activitiesSidebar/SidebarCategories";
import PaginationWrapper from "../shearedComponents/PaginationWrapper";
import TourSingleCard from "../common/tourElements/ActivitySingleCard";
import { Activity } from "@/interFace/interFace";
import { filterUpcomingActivities } from "@/api/activityApi";
import ActivitiesSidebarMain from "../activitiesSidebar/ItinerariesSidebarMain";
import { getActivitiesData } from "@/data/act-data";

interface FilterOptions {
  budget?: number;
  category?: string;
  
}

const TourGridRight = () => {
  const [allActivities, setAllActivities] = useState<Activity[]>([]);  // Stores all initial activities
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Load initial activities data with getActivitiesData
  const loadInitialActivities = async () => {
    try {
      const data = await getActivitiesData(); // Load data from getActivitiesData
      setAllActivities(data);
      setFilteredActivities(data); // Initialize filteredActivities with all data
    } catch (error) {
      console.error("Failed to fetch initial activities:", error);
    }
  };

  // Load filtered activities based on filters
  const loadFilteredActivities = () => {
    try {
      // Start with all activities loaded from getActivitiesData
      let filteredData = allActivities;
  
      // Apply category filter if it exists
      if (filters.category) {
        filteredData = filteredData.filter(activity => activity.category === filters.category);
      }
  
      // Apply budget filter only if budget has a value
      filteredData = filteredData.filter(activity =>
        filters.budget !== undefined ? activity.price <= filters.budget : true
      );
  
      // Apply search query filter
      if (searchQuery) {
        filteredData = filteredData.filter(activity =>
          activity.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
  
      // Update filtered activities
      setFilteredActivities(filteredData);
    } catch (error) {
      console.error("Failed to apply filters to activities:", error);
    }
  };

  // Load initial data on component mount
  useEffect(() => {
    loadInitialActivities();
  }, []);

  // Reload filtered data when filters or searchQuery change
  useEffect(() => {
    loadFilteredActivities();
  }, [filters, searchQuery]);

  const applyFilters = (newFilters: FilterOptions) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      category: newFilters.category || undefined // Set category to undefined if "All" is selected
    }));
  };

  const applySearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <section className="bd-tour-grid-area section-space">
      <div className="container">
        <div className="row gy-24">
          <div className="col-xxl-8 col-xl-8 col-lg-7">
            <div className="row gy-24">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((item) => (
                  <TourSingleCard
                    tour={item}
                    key={item._id}
                    className="col-xxl-4 col-xl-6 col-lg-6 col-md-6"
                    tourWrapperClass="tour-wrapper style-one"
                    isparentClass={true}
                  />
                ))
              ) : (
                <p>No activities found.</p>
              )}
            </div>
          </div>
          <div className="col-xxl-4 col-xl-4 col-lg-5">
            <ActivitiesSidebarMain 
              applyFilters={applyFilters} 
              applySearch={applySearch} 
            />
            <SidebarCategories onCategorySelect={(category) => applyFilters({ category })} />
          </div>
        </div>
        <PaginationWrapper />
      </div>
    </section>
  );
};

export default TourGridRight;
