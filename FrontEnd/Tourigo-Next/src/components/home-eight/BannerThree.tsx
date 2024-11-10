"use client";
import Image from "next/image";
import React, { useState } from "react";
import bannerThree from "../../../public/assets/images/shapes/banner-three-map.png";
import shapeAirline from "../../../public/assets/images/shapes/airline.png";
import bannerModel from "../../../public/assets/images/banner/banner-3/banner-model.png";
import bgVideo from "../../../public/assets/images/bg/video-bg-2.png";
import bgImg from "../../../public/assets/images/shapes/banner-three-bg.png";
import { imageLoader } from "@/hooks/image-loader";
import Link from "next/link";
import ModalVideo from "react-modal-video";

const BannerThree = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openVideoModal = () => setIsOpen(!isOpen);
  return (
    <>
      <section
        className="banner-area banner-height-2 p-relative z-index-11 fix image-bg fix"
        style={{ backgroundImage: `url(${bgImg.src})` }}
      >
        <div className="banner-three-shape">
          <div className="banner-three-shape-one">
            <Image
              src={bannerThree}
              loader={imageLoader}
              style={{ width: "auto", height: "auto" }}
              alt="image"
            />
          </div>
          <div className="banner-three-shape-two">
            <Image
              src={shapeAirline}
              loader={imageLoader}
              style={{ width: "auto", height: "auto" }}
              alt="image"
            />
          </div>
        </div>
        <div className="swiper banner__active overflow-visible p-relative">
          <div className="swiper-wrapper">
            <div className="swiper-slide banner_more_item">
              <div className="container">
                <div className="row gy-24 align-items-center justify-content-between">
                  <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12">
                    <div
                      className="banner-content-three p-relative wow bdFadeInLeft"
                      data-wow-delay=".2s"
                    >
                      <span
                        className="section-subtitle mb-25 wow bdFadeInLeft"
                        data-wow-delay=".3s"
                      >
                        Digital Excellence
                      </span>
                      <h1
                        className="banner-title mb-15 wow bdFadeInLeft"
                        data-wow-delay=".4s"
                      >
                        Uncover Your Dream Tour on{" "}
                        <span className="theme-text">Tourigo!</span>
                      </h1>
                      <p className="mb-45">
                        Lorem ipsum dolor sit amet consectetur adipiscing elit
                        Ut et massa mi. Aliquam in hendrerit urna. Pellentesque
                        sit amet sapien fringilla, mattis ligula consec.
                      </p>
                      <div className="banner-btn">
                        <Link
                          href="/contact"
                          className="bd-primary-btn btn-style has-arrow is-bg radius-60"
                        >
                          <span className="bd-primary-btn-arrow arrow-right">
                            <i className="fa-regular fa-arrow-right"></i>
                          </span>
                          <span className="bd-primary-btn-text">Know More</span>
                          <span className="bd-primary-btn-circle"></span>
                          <span className="bd-primary-btn-arrow arrow-left">
                            <i className="fa-regular fa-arrow-right"></i>
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-5 col-xl-5 col-lg-6 col-md-12">
                    <div className="banner-thumb-three p-relative">
                      <div className="banner-thumb-three-wrapper p-relative">
                        <div className="banner-thumb-three">
                          <Image
                            src={bannerModel}
                            loader={imageLoader}
                            style={{ width: "auto", height: "auto" }}
                            alt="image"
                          />
                        </div>
                        <div className="banner-social">
                          <div className="theme-social">
                            <Link href="https://www.facebook.com/">
                              <i className="icon-facebook"></i>
                            </Link>
                            <Link href="https://www.twitter.com/">
                              <i className="icon-twitter-x"></i>
                            </Link>
                            <Link href="https://www.linkedin.com/">
                              <i className="icon-linkedin"></i>
                            </Link>
                            <Link href="https://www.youtube.com/">
                              <i className="icon-youtube"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="video-wrapper">
                        <div className="position-relative">
                          <div className="video-thumb">
                            <Image
                              src={bgVideo}
                              loader={imageLoader}
                              style={{ width: "auto", height: "auto" }}
                              alt="image"
                            />
                          </div>
                          <div className="pos-center">
                            <button
                              onClick={() => {
                                openVideoModal();
                              }}
                              className="bd-play-btn small white-bg popup-video animation-three"
                            >
                              <i className="icon-play"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*if you active slider then remove "d-none"*/}
          <div className="banner-nav-btn banner-one-navigation d-none">
            <div className="banner-navigation-btn">
              <button className="tourigo-navigation-prev">
                <i className="fa-regular fa-angle-left"></i>
              </button>
              <button className="tourigo-navigation-next">
                <i className="fa-regular fa-angle-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
      <ModalVideo
        channel="youtube"
        isOpen={isOpen}
        videoId="eUpwDAnkgSM"
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default BannerThree;
