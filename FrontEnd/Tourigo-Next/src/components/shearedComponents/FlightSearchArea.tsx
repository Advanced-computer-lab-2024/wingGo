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

interface FlightSearchAreaProps {
    origin: string;
    setOrigin: (value: string) => void;
    destination: string;
    setDestination: (value: string) => void;
    departureDate: Date | null;
    setDepartureDate: (date: Date | null) => void;
    setSearchTriggered: (value: boolean) => void;
  }

const FlightSearchArea: React.FC<FlightSearchAreaProps> = ({
    origin,
  setOrigin,
  destination,
  setDestination,
  departureDate,
  setDepartureDate,
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
            <h6 className="sidebar-widget-title small mb-15">Origin</h6>
            <div className="sidebar-search">
              <InputBox
                placeHolder="Origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
          </div>

          <div className="sidebar-widget widget">
            <h6 className="sidebar-widget-title small mt-15 mb-15">Destination</h6>
            <div className="sidebar-search">
            <InputBox
                placeHolder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          <div className="sidebar-widget-divider"></div>

          <div className="sidebar-widget widget">
            <h6 className="sidebar-widget-title small mb-15">
                Select Departure Date
            </h6>
            <DatePicker
                selected={departureDate}
                onChange={(date) => {setDepartureDate(date); console.log(date?.toISOString().split('T')[0] || '')}}
                dateFormat="yyyy-MM-dd"
                placeholderText="YYYY-MM-DD"
                className="form-control"
            />
          </div>

          <div className="col-lg-2 mt-30" onClick={handleSearchClick}>
              <Link
                href="#"
                className="bd-primary-btn btn-style has-arrow is-bg btn-quaternary radius-60"
              >
                <span className="bd-primary-btn-arrow arrow-right">
                  <i className="fa-regular fa-arrow-right"></i>
                </span>
                <span className="bd-primary-btn-text">Search Flights</span>
                <span className="bd-primary-btn-circle"></span>
                <span className="bd-primary-btn-arrow arrow-left">
                  <i className="fa-regular fa-arrow-right"></i>
                </span>
              </Link>
            </div>
          
          
          
        </div>
        
      </aside>
    </>
  );
};

export default FlightSearchArea;
