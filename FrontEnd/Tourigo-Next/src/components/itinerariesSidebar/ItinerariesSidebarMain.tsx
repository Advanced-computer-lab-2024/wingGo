// ItinerariesSidebarMain.tsx
import React, { useState } from "react";
import SidebarCategories from "./SidebarCategories";
import SidebarTags from "./SidebarTags";
import SidebarSearchInputBox from "../shearedComponents/SidebarSearchInputBox";
import RangeFilter from "./RangeFilter";

interface ItinerariesSidebarMainProps {
    applyFilters: (filters: { budget?: number; date?: string; preferences?: string; language?: string }) => void;
  }

  const ItinerariesSidebarMain: React.FC<ItinerariesSidebarMainProps> = ({ applyFilters }) => {
//   const [priceRange, setPriceRange] = useState([0, 500]);

  const handlePriceChange = (range: number[]) => {
    // setPriceRange(range);
    applyFilters({ budget: range[1] }); // Send max price as budget
  };

  return (
    <aside className="sidebar-wrapper sidebar-sticky">
      <div className="sidebar-widget-wrapper mb-30">
        <div className="sidebar-widget widget">
          <h6 className="sidebar-widget-title small mb-15">Search Itineraries</h6>
          <div className="sidebar-search">
            <SidebarSearchInputBox placeHolder="Search Itineraries" />
          </div>
        </div>
        <div className="sidebar-widget-divider"></div>
        <div className="sidebar-widget widget">
          <h6 className="sidebar-widget-title small mb-15">Price Filter</h6>
          <RangeFilter onChange={handlePriceChange} /> {/* Pass handlePriceChange */}
        </div>
        <div className="sidebar-widget-divider"></div>
        <div className="sidebar-widget widget widget_categories">
          <h6 className="sidebar-widget-title small mb-15">Categories</h6>
          <SidebarCategories />
        </div>
        <div className="sidebar-widget-divider"></div>
        <div className="sidebar-widget widget widget_tag_cloud">
          <h6 className="sidebar-widget-title small mb-15">Popular Tags</h6>
          <SidebarTags />
        </div>
      </div>
    </aside>
  );
};

export default ItinerariesSidebarMain;
