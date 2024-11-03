"use client";
import { bannerFiveData } from "@/data/homeFive/banner-five-data";
import { selectLocationData, selectTourData } from "@/data/nice-select-data";
import NiceSelect from "@/elements/NiceSelect";
import NiceSelectTwo from "@/elements/NiceSelectTwo";
import Link from "next/link";
import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperReact, SwiperSlide } from "swiper/react";

const BannerAreaFive = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const selectHandler = () => {};
  return (
    <>
      <section className="bd-banner-area banner-style-five fix">
        <div className="booking-search">
          <form action="#">
            <div className="banner-booking-wrapper">
              <div className="row gy-24">
                <div className="col-12">
                  <div className="banner-booking-form-select style-two">
                    <NiceSelectTwo
                      options={selectLocationData}
                      defaultCurrent={0}
                      onChange={selectHandler}
                      name=""
                      className="banner-booking-form-input style-two"
                      placeholder="Select Location"
                      isIcon={true}
                      spanClass="banner-booking-form-icon"
                      iconClass="icon-location-fill"
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="banner-booking-form-select">
                    <div className="banner-form-input-select style-two">
                      <ReactDatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(date: any) => {
                          setDateRange(date);
                        }}
                        isClearable={true}
                        placeholderText="Select Your Date"
                      />

                      <span className="banner-booking-form-date-icon">
                        <i className="fa-light fa-calendar-days"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="banner-booking-form-select">
                    <NiceSelectTwo
                      options={selectTourData}
                      defaultCurrent={0}
                      onChange={selectHandler}
                      name=""
                      className="banner-booking-form-input style-two"
                      placeholder="Tour Type"
                      isIcon={true}
                      spanClass="banner-booking-form-icon"
                      iconClass="icon-flag-wave"
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="banner-search-button">
                    <button
                      type="submit"
                      className="banner-btn banner-square-btn bd-btn btn-style radius-10 w-100"
                    >
                      <span>
                        <i className="fa-regular fa-magnifying-glass"></i>
                      </span>{" "}
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="swiper bd-slider-active p-relative">
          <SwiperReact
            modules={[EffectFade, Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            effect={"fade"}
            navigation={{
              nextEl: ".banner-navigation-next",
              prevEl: ".banner-navigation-prev",
            }}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: true,
            }}
            pagination={{
              el: ".bd-pagination",
              clickable: true,
            }}
          >
            {bannerFiveData &&
              bannerFiveData.map((item) => (
                <SwiperSlide key={item.id} className="custom-swiper-slide">
                  <div className="banner-slider-wrapper">
                    <div
                      className="banner-bg-image"
                      style={{ backgroundImage: `url(${item.img.src})` }}
                    ></div>
                    <div className="container">
                      <div className="row">
                        <div className="col-xxl-7 col-xl-9 col-lg-8">
                          <div className="banner-five-content">
                            <div className="banner-subtitle mb-10">
                              {item.subTitle}
                            </div>
                            <h1 className="banner-title large white-text mb-25">
                              {item.title}
                              <span className="warning-text">
                                {item.warningText}
                              </span>
                            </h1>
                            <p className="banner-description white-text mb-40">
                              {item.description}
                              <span className="warning-text">Book Now</span>
                            </p>
                            <div className="banner-btn">
                              <Link
                                href="/tour-details-right"
                                className="bd-primary-btn btn-style has-arrow is-bg radius-60"
                              >
                                <span className="bd-primary-btn-arrow arrow-right">
                                  <i className="fa-regular fa-arrow-right"></i>
                                </span>
                                <span className="bd-primary-btn-text">
                                  More Packages
                                </span>
                                <span className="bd-primary-btn-circle"></span>
                                <span className="bd-primary-btn-arrow arrow-left">
                                  <i className="fa-regular fa-arrow-right"></i>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </SwiperReact>
          {/**navigation button start**/}
          <div className="banner-nav-btn banner-five-navigation d-none d-xxl-block">
            <div className="banner-navigation-btn-2">
              <button className="banner-navigation-prev">
                <i className="fa-regular fa-angle-left"></i>
              </button>
              <button className="banner-navigation-next">
                <i className="fa-regular fa-angle-right"></i>
              </button>
            </div>
          </div>
          {/**navigation button end**/}
        </div>
      </section>
    </>
  );
};

export default BannerAreaFive;
