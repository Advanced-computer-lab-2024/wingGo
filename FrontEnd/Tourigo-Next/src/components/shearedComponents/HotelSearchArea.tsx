"use client";
import { imageLoader } from "@/hooks/image-loader";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import sideBarBg from "../../../public/assets/images/bg/sidebar-img.png";
import SidebarBookingForm from "@/forms/SidebarBookingForm";
import SidebarBlogList from "./SidebarBlogList";
import SidebarSearchInputBox from "./SidebarSearchInputBox";
import ReactDatePicker from "react-datepicker";
import DatePicker from 'react-datepicker';


import InputBox from "./InputBox";

interface HotelSearchAreaProps {
    cityCode: string;
    setCityCode: (value: string) => void;
    setSearchTriggered: (value: boolean) => void;
  }

const HotelSearchArea: React.FC<HotelSearchAreaProps> = ({
    cityCode,
    setCityCode,
    setSearchTriggered,
  
}) => {

    const handleSearchClick = () => {
        setSearchTriggered(true);
      };

  return (
    <>
      <aside className="sidebar-wrapper sidebar-sticky">
        <div className="sidebar-widget-wrapper mb-30">
          <div className="sidebar-widget widget">
            <h6 className="sidebar-widget-title small mb-15">City Code</h6>
            <div className="sidebar-search">
              <InputBox
                placeHolder="City Code"
                value={cityCode}
                onChange={(e) => setCityCode(e.target.value)}
              />
            </div>
          </div>

          

          <div className="sidebar-widget-divider"></div>

          <div className="col-lg-2 mt-30 w-100" onClick={handleSearchClick}>
          <button className="bd-btn btn-style radius-4 w-100" type="submit">
              Search Hotels
              <span>
                <i className="fa-regular fa-arrow-right"></i>
              </span>
            </button>
          </div>
          
          
          
        </div>
        
      </aside>
    </>
  );
};

export default HotelSearchArea;
