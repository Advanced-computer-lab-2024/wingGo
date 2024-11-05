// ItinerariesSidebarMain.tsx
import React, { useState } from "react";
import SidebarCategories from "./SidebarCategories";
import SidebarTags from "./SidebarTags";
import SidebarSearchInputBox from "../shearedComponents/SidebarSearchInputBoxIt";
import RangeFilter from "./RangeFilter";

interface ItinerariesSidebarMainProps {
    applyFilters: (filters: { budget?: number; date?: string; preferences?: string; language?: string }) => void;
    applySearch: (query: string) => void;  // New prop for search functionality
  }

  const ItinerariesSidebarMain: React.FC<ItinerariesSidebarMainProps> = ({ applyFilters, applySearch }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");

  const handlePriceChange = (range: number[]) => {
    // setPriceRange(range);
    applyFilters({ budget: range[1] }); // Send max price as budget
  };

   // Handles search input change and applies search
   const handleSearch = (query: string) => {
    setSearchQuery(query);
    applySearch(query);
  };

  return (
    <aside className="sidebar-wrapper sidebar-sticky">
      <div className="sidebar-widget-wrapper mb-30">
        <div className="sidebar-widget widget">
          <h6 className="sidebar-widget-title small mb-15">Search Itineraries</h6>
          <div className="sidebar-search">
          <SidebarSearchInputBox placeHolder="Search Itineraries" onSearch={handleSearch} />
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
