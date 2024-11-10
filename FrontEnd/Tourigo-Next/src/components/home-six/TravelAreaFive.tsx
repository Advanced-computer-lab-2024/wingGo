"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import planeTwoImg from "../../../public/assets/images/shapes/plane-2.png";
import cameraImg from "../../../public/assets/images/shapes/camera.png";
import lineCircleImg from "../../../public/assets/images/shapes/line-circle.png";
import circleBgImg from "../../../public/assets/images/shapes/circle-bg-3.png";
import stoneImg from "../../../public/assets/images/shapes/stone.png";
import { imageLoader } from "@/hooks/image-loader";
import ModalVideo from "react-modal-video";
import LineDashIcon from "@/svg/LineDashIcon";

const TravelAreaFive = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openVideoModal = () => setIsOpen(!isOpen);
  return (
    <>
      <section className="bd-travel-area theme-bg-secondary section-space p-relative fix">
        <div className="container">
          <div className="travel-shape">
            <div className="travel-shape-one">
              <LineDashIcon />
            </div>
            <div className="travel-shape-two">
              <Image
                src={planeTwoImg}
                loader={imageLoader}
                style={{ width: "100%", height: "100%" }}
                alt="shape"
              />
            </div>
            <div className="travel-shape-three">
              <Image
                src={cameraImg}
                loader={imageLoader}
                style={{ width: "100%", height: "100%" }}
                alt="shape"
              />
            </div>
            <div className="travel-shape-four">
              <Image
                src={lineCircleImg}
                loader={imageLoader}
                style={{ width: "100%", height: "100%" }}
                alt="shape"
              />
            </div>
            <div className="travel-shape-five">
              <Image
                src={circleBgImg}
                loader={imageLoader}
                style={{ width: "100%", height: "100%" }}
                alt="shape"
              />
            </div>
            <div className="travel-shape-six">
              <Image
                src={stoneImg}
                loader={imageLoader}
                style={{ width: "100%", height: "100%" }}
                alt="shape"
              />
            </div>
          </div>
          <div className="row gy-24 align-items-center justify-content-between">
            <div className="col-xl-6 col-lg-6">
              <div className="travel-section">
                <div className="popup-vido mb-40">
                  <button
                    onClick={() => {
                      openVideoModal();
                    }}
                    className="bd-play-btn btn-tertiary popup-video animation-two theme-bg"
                  >
                    <i className="icon-play"></i>
                  </button>
                </div>
                <div className="section-title-wrapper is-white mb-35">
                  <span className="section-subtitle text-warning mb-10">
                    Are you ready to travel?
                  </span>
                  <h2 className="section-title mb-15">
                    Prepared for Real Adventure & Natural Delights
                  </h2>
                  <p>
                    Share the core values and principles that drive your company
                    Emphasize a commitment to customer satisfaction
                  </p>
                </div>
                <div className="travel-btn">
                  <Link
                    href="/booking"
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
            <div className="col-xl-6 col-lg-6">
              <div className="row gy-24">
                <div className="col-lg-6 col-sm-6">
                  <div className="travel-wrapper">
                    <div className="travel-item">
                      <div className="travel-icon">
                        <span>
                          <i className="icon-elephant"></i>
                        </span>
                      </div>
                      <h5 className="travel-title white-text underline-two">
                        <Link href={`/destinations-details`}>
                          Wild Life Tours
                        </Link>
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-6">
                  <div className="travel-wrapper">
                    <div className="travel-item">
                      <div className="travel-icon">
                        <span>
                          <i className="icon-gas-balloon"></i>
                        </span>
                      </div>
                      <h5 className="travel-title white-text underline-two">
                        <Link href={`/destinations-details`}>
                          Paragliding Tours
                        </Link>
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-6">
                  <div className="travel-wrapper">
                    <div className="travel-item">
                      <div className="travel-icon">
                        <span>
                          <i className="icon-skydive"></i>
                        </span>
                      </div>
                      <h5 className="travel-title white-text underline-two">
                        <Link href={`/destinations-details`}>
                          Hang Gliding Tours
                        </Link>
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-6">
                  <div className="travel-wrapper">
                    <div className="travel-item">
                      <div className="travel-icon">
                        <span>
                          <i className="icon-adventure"></i>
                        </span>
                      </div>
                      <h5 className="travel-title white-text underline-two">
                        <Link href={`/destinations-details`}>
                          Adventure Tours
                        </Link>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
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

export default TravelAreaFive;
