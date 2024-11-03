"use client";
import Image from "next/image";
import React from "react";
import { imageLoader } from "@/hooks/image-loader";
import shapeOne from "../../../public/assets/images/shapes/circle-bg.png";
import shapeTwo from "../../../public/assets/images/shapes/sky.png";
import shapeThree from "../../../public/assets/images/shapes/circle.png";
import shapeFour from "../../../public/assets/images/shapes/circle-bg2.png";
import shapeFive from "../../../public/assets/images/shapes/half-circle.png";
import shapeSix from "../../../public/assets/images/shapes/plane.png";
import shapeSeven from "../../../public/assets/images/shapes/plane-line.png";
import shapeEight from "../../../public/assets/images/shapes/dot-square.png";
import shapeYellow from "../../../public/assets/images/shapes/yellow-shape.png";
import bgImage from "../../../public/assets/images/bg/banner-bg.png";
import bannerThumbOne from "../../../public/assets/images/banner/banner-1-img-1.png";
import bannerThumbTwo from "../../../public/assets/images/banner/banner-1-img-2.png";
import SearchFilterTwo from "../shearedComponents/SearchFilterTwo";

const BannerOne = () => {
  return (
    <>
      <section
        className="banner-area banner-height p-relative z-index-11 image-bg fix"
        style={{ backgroundImage: `url(${bgImage.src})` }}
      >
        <div className="banner-shape">
          <div className="banner-shape-one">
            <Image
              src={shapeOne}
              loader={imageLoader}
              style={{ width: "100%", height: "auto" }}
              alt="image"
            />
          </div>
          <div className="banner-shape-two">
            <Image
              src={shapeTwo}
              loader={imageLoader}
              style={{ width: "100%", height: "auto" }}
              alt="image"
            />
          </div>
          <div className="banner-shape-three">
            <Image
              src={shapeThree}
              loader={imageLoader}
              style={{ width: "100%", height: "auto" }}
              alt="image"
            />
          </div>
          <div className="banner-shape-four">
            <Image
              src={shapeFour}
              loader={imageLoader}
              style={{ width: "100%", height: "auto" }}
              alt="image"
            />
          </div>
          <div className="banner-shape-five">
            <Image
              src={shapeFive}
              loader={imageLoader}
              style={{ width: "100%", height: "auto" }}
              alt="image"
            />
          </div>
          <div className="banner-shape-six">
            <Image
              src={shapeSix}
              loader={imageLoader}
              style={{ width: "100%", height: "auto" }}
              alt="image"
            />
          </div>
          <div className="banner-shape-seven">
            <Image
              src={shapeSeven}
              loader={imageLoader}
              style={{ width: "100%", height: "auto" }}
              alt="image"
            />
          </div>
          <div className="banner-shape-eight">
            <Image
              src={shapeEight}
              loader={imageLoader}
              style={{ width: "100%", height: "auto" }}
              alt="image"
            />
          </div>
        </div>
        <div className="swiper banner__active overflow-visible p-relative">
          <div className="swiper-wrapper">
            {/**if ypu active slider then duplicate "swiper-slide**/}
            <div className="swiper-slide banner_more_item">
              <div className="container">
                <div className="row gy-24 align-items-center justify-content-between">
                  <div className="col-xxl-7 col-xl-6 col-lg-6">
                    <div className="mt-50">
                      <div
                        className="banner-content p-relative wow bdFadeInLeft"
                        data-wow-delay=".2s"
                      >
                        <span
                          className="section-subtitle mb-25 wow bdFadeInLeft"
                          data-wow-delay=".3s"
                        >
                          Digital Excellence
                        </span>
                        <h1
                          className="banner-title wow bdFadeInLeft"
                          data-wow-delay=".4s"
                        >
                          Explore Uncover Hidden Gems{" "}
                          <span className="yellow-shape">
                            Worldwide{" "}
                            <Image
                              src={shapeYellow}
                              loader={imageLoader}
                              style={{ width: "100%", height: "auto" }}
                              alt="yellow-shape"
                            />
                          </span>
                        </h1>
                      </div>
                      <div
                        className="banner-search-wrapper mt-45 wow bdFadeIn"
                        data-wow-delay=".5s"
                      >
                        <SearchFilterTwo />
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-5 col-xl-6 col-lg-6">
                    <div
                      className="banner-thumb-wrapper position-relative wow bdFadeInRight"
                      data-wow-delay=".3s"
                    >
                      <div
                        className="banner-thumb-one wow bdFadeInRight"
                        data-wow-delay=".4s"
                      >
                        <Image
                          src={bannerThumbOne}
                          loader={imageLoader}
                          style={{ width: "100%", height: "100%" }}
                          alt="image"
                        />
                      </div>
                      <div
                        className="banner-thumb-two wow bdFadeInRight"
                        data-wow-delay=".5s"
                      >
                        <Image
                          src={bannerThumbTwo}
                          loader={imageLoader}
                          style={{ width: "100%", height: "100%" }}
                          alt="image"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/******if you active slider then remove "d-none******/}
          <div className="banner-nav-btn banner-one-navigation d-none">
            <div className="banner-pagination">
              <div className="swiper-pagination bd-pagination justify-content-center"></div>
            </div>
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
    </>
  );
};

export default BannerOne;
