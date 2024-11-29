// ItinerariesSidebarMain.tsx
import React, { useState, useEffect } from "react";
import SidebarCategories from "./SidebarCategories";
import SidebarTags from "./SidebarTags";
import SidebarSearchInputBox from "../shearedComponents/SidebarSearchInputBoxIt";
import RangeFilter from "./RangeFilter";


interface ItinerariesSidebarMainProps {
    applyFilters: (filters: { budgetMin?: number; budgetMax?: number; date?: string; preferences?: string; language?: string }) => void;
    applySearch: (query: string) => void;  // New prop for search functionality
  }

  const ItinerariesSidebarMain: React.FC<ItinerariesSidebarMainProps> = ({ applyFilters, applySearch }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(500); // Example max; adjust based on your data
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");


    // useEffect(() => {
    //   // Replace with real data fetching for min and max values
    //   const fetchPrices = async () => {
    //     const prices = [0, 500]; // Simulated prices for min and max
    //     setMinPrice(Math.min(...prices));
    //     setMaxPrice(Math.max(...prices));
    //   };
    //   fetchPrices();
    // }, []);
  
  // ItinerariesSidebarMain.tsx

const handlePriceChange = (range: number[]) => {
  applyFilters({ budgetMin: range[0], budgetMax: range[1], language: selectedLanguage }); // Send both min and max prices
};

const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const language = event.target.value;
  setSelectedLanguage(language);
  applyFilters({ budgetMin: minPrice, budgetMax: maxPrice, language });
  console.log("minPrice "+minPrice);
  console.log("maxPrice "+maxPrice);
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
          <RangeFilter min={minPrice} max={maxPrice} onChange={handlePriceChange} />
        </div>
        <div className="sidebar-widget-divider"></div>
                {/* Language Filter */}
                <div className="sidebar-widget widget">
                    <h6 className="sidebar-widget-title small mb-15">Language Filter</h6>
                    <select
        className="sidebar-select"
        value={selectedLanguage}
        onChange={handleLanguageChange}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ced4da",
          fontSize: "16px",
          color: "#495057",
          backgroundColor: "#fff",
          marginBottom: "15px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23999999' d='M2 0L0 2h4zM2 5L0 3h4z'/></svg>")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
          backgroundSize: "10px",
        }}
      >
        <option value="">All Languages</option>
        <option value="English">English</option>
        <option value="Arabic">Arabic</option>
        <option value="French">French</option>
        {/* Add more languages as needed */}
      </select>
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
