"use client";
import Image from "next/image";
import React, { useState } from "react";
import { imageLoader } from "@/hooks/image-loader";
import testiImg from "../../../../public/assets/images/testimonial/testimonial-img-3.png";
import testiQuoteImg from "../../../../public/assets/images/testimonial/quot-shape.png";
import { testimonialData } from "@/data/testimonial-data";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import ModalVideo from "react-modal-video";

const TestimonialElementOne = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openVideoModal = () => setIsOpen(!isOpen);
  return (
    <>
      <section className="bd-testimonial-area section-space-bottom p-relative">
        <div className="container">
          <div className="row gy-24 justify-content-between">
            <div className="col-xxl-5 col-xl-5 col-lg-5">
              <div className="testimonial-thumb-video p-relative">
                <Image
                  src={testiImg}
                  loader={imageLoader}
                  style={{ width: "100%", height: "100%" }}
                  alt="image"
                />
                <div className="post-details-video-btn pos-center">
                  <button
                    onClick={() => {
                      openVideoModal();
                    }}
                    className="bd-play-btn popup-video animation-three"
                  >
                    <i className="icon-play"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-xxl-7 col-xl-7 col-lg-7">
              <div className="testimonial-wrapper testimonial-style-six">
                <div className="section-title-wrapper section-title-space">
                  <span className="section-subtitle mb-10">Testimonials</span>
                  <h2 className="section-title mb-15">Customer Review</h2>
                </div>
                <div className="swiper testimonial_active_2">
                  <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                      delay: 2500,
                      disableOnInteraction: true,
                    }}
                    pagination={{
                      el: ".testimonial-pagination",
                      clickable: true,
                    }}
                  >
                    {testimonialData &&
                      testimonialData.slice(0, 3).map((item) => (
                        <SwiperSlide
                          key={item.id}
                          className="custom-swiper-slide"
                        >
                          <div className="testimonial-wrapper">
                            <div className="testimonial-content p-relative has-transparent">
                              <div className="bd-rating fs-14 d-flex rating-color justify-content-center mb-10">
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                              </div>
                              <p>{item.description}</p>
                              <div className="testimonial-avatar-wrap justify-content-center">
                                <div className="avatar-thumb">
                                  <Image
                                    src={item.avatarImg}
                                    loader={imageLoader}
                                    style={{ width: "100%", height: "auto" }}
                                    alt=""
                                  />
                                </div>
                                <div className="avatar-meta">
                                  <h6 className="avatar-meta-title">
                                    {item.avatarTitle}
                                  </h6>
                                  <p>{item.info}</p>
                                </div>
                              </div>
                              <div className="testimonial-quot">
                                <Image
                                  src={testiQuoteImg}
                                  loader={imageLoader}
                                  style={{ width: "100%", height: "auto" }}
                                  alt="shape"
                                />
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                  </Swiper>
                  <div className="testimonial-pagination"></div>
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

export default TestimonialElementOne;
