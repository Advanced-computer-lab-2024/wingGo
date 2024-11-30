import React, { useState } from "react";
import SidebarCategories from "./SidebarCategories";
import SidebarTags from "./SidebarTags";
import SidebarSearchInputBox from "../shearedComponents/SidebarSearchInputBoxIt";
import RangeFilter from "./RangeFilter";
import RatingFilter from "./RatingFilter";
import DatePicker from "react-datepicker";

interface ItinerariesSidebarMainProps {
    applyFilters: (filters: { budget?: number; category?: string; date?: string ; averageRating?:number}) => void;
    applySearch: (query: string) => void;
}

const ItinerariesSidebarMain: React.FC<ItinerariesSidebarMainProps> = ({ applyFilters, applySearch }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handlePriceChange = (range: number[]) => {
        applyFilters({ budget: range[1] });
    };

    const handleCategoryChange = (category: string) => {
        applyFilters({ category });
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        applySearch(query);
    };
    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);

        // Apply the selected date to filters in 'YYYY-MM-DD' format
        if (date) {
            const formattedDate = date.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
            applyFilters({ date: formattedDate });
        } else {
            applyFilters({ date: undefined }); // Clear the date filter if no date is selected
        }
    };
    const handleRatingChange = (range: number[]) => {
        applyFilters({ averageRating: range[0] }); // Only send the minimum rating (range[0])
    };

    return (
        <aside className="sidebar-wrapper sidebar-sticky">
            <div className="sidebar-widget-wrapper mb-30">
                <div className="sidebar-widget widget">
                    <h6 className="sidebar-widget-title small mb-15">Search Activities</h6>
                    <div className="sidebar-search">
                        <SidebarSearchInputBox placeHolder="Search Itineraries" onSearch={handleSearch} />
                    </div>
                </div>
                <div className="sidebar-widget-divider"></div>
                <div className="sidebar-widget widget">
                    <h6 className="sidebar-widget-title small mb-15">Price Filter</h6>
                    <RangeFilter onChange={handlePriceChange} />
                </div>
                <div className="sidebar-widget-divider"></div>
                <div className="sidebar-widget widget">
                    <h6 className="sidebar-widget-title small mb-15">Rating Filter</h6>
                    <RatingFilter onChange={handleRatingChange} />
                </div>
                <div className="sidebar-widget-divider"></div>
                <div className="sidebar-widget widget">
                    <h6 className="sidebar-widget-title small mb-15">Date Filter</h6>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select a date"
                        className="form-control"
                        isClearable
                        showPopperArrow={false}
                    />
                </div>
                <div className="sidebar-widget-divider"></div>
                <div className="sidebar-widget widget widget_categories">
                    <h6 className="sidebar-widget-title small mb-15">Categories</h6>
                    <SidebarCategories onCategorySelect={handleCategoryChange} />
                </div>
                
                {/* <div className="sidebar-widget-divider"></div>
                <div className="sidebar-widget widget widget_tag_cloud">
                    <h6 className="sidebar-widget-title small mb-15">Popular Tags</h6>
                    <SidebarTags />
                </div> */}
            </div>
        </aside>
    );
};

export default ItinerariesSidebarMain;
