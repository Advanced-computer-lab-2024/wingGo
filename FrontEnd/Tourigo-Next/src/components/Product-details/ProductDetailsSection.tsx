//ProductDetailsSection.tsx
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs, Controller, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { idTypeNew, Product } from "@/interFace/interFace";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import {getProductData} from "@/data/prod-data";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling
import { ToastContainer, toast } from "react-toastify";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { cart_product, decrease_quantity } from "@/redux/slices/cartSliceproduct";
import { imageLoader } from "@/hooks/image-loader";
import Link from "next/link";
import ReviewComments from "./ReviewComments"; 
import StarRating from "@/components/Products/StarRating"; 
import { fetchSellerData,purchaseProduct} from "@/api/productApi"; // Adjust the import path as necessary
import { calculateAverageRating } from "@/utils/utils"; // Adjust the import path as necessary
const ProductDetailsSection = ({ id, userRole }: { id: string; userRole: string }) => {
  console.log("userRole:", userRole);
  const touristId = "672a3a4001589d5085322e88";
  const [products, setProducts] = useState<Product[]>([]);
  const [item, setItem] = useState<Product | null>(null);
  const [sellerName, setSellerName] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await getProductData();
        const product = products.find((item) => item._id === id);
        console.log("Productttt:", product);
        setItem(product || null);
        if (product && product.seller) {
          const sellerData = await fetchSellerData(product.seller);
          setSellerName(sellerData.name);
          console.log("Seller Data:", sellerData);
        } else {
          setSellerName("Admin");
        }
        console.log("Product:", products);

        // Assuming related tours can be the rest of the activities
        setProducts(products.filter((item) => item._id !== id));
      } catch (err) {
        console.error("Error fetching product or seller data:", err);
      }
    };
    fetchData();
  }, [id]);

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  //   =====

  const dispatch = useDispatch();
 

  // const cartProducts = useSelector(
  //   (state: RootState) => state.cart.cartProducts
  // );
  // const quantity = cartProducts.find((itm) => itm?._id === item?._id);
  // const totalCart = quantity?.totalCart ? quantity?.totalCart : 0;

  const handleAddToCart = (item: Product) => {
    dispatch(cart_product(item));
  };
  

  const img = item?.image;
  // ====

  const shopProducts = [
    {
      id: 1,
      imgData: img,
    },
    
  ];
  console.log("my item", item);
  
  const averageRating = item ? calculateAverageRating(item.ratings) : 0;
  const numberOfReviews = item ? item.reviews.length : 0;
  const handlePurchase = async () => {
    if (item?._id) {
      try {
        const response = await purchaseProduct(touristId, item._id);
        console.log("Purchase response:", response);

        toast.success("Product purchased successfully!");
        dispatch(decrease_quantity(item)); 

      } catch (error) {
        toast.error("Failed to purchase item.");
        console.error("Error during purchase:", error);
       
      }
    }
  };
  return (
    <>
      <div className="row gy-24 justify-content-between">
        <div className="col-xxl-6 col-xl-6 col-lg-6">
          <div className="product-details-thumb-wrap">
            <div className="product-details-thumb-top mb-24">
              <div className="swiper-container product-details-active p-relative">
                <div className="swiper-wrapper">
                  <Swiper
                    thumbs={{ swiper: thumbsSwiper }}
                    loop={true}
                    spaceBetween={0}
                    slidesPerView={1}
                    freeMode={false}
                    watchSlidesProgress={true}
                    modules={[Navigation, Controller, FreeMode, Thumbs]}
                    navigation={{
                      nextEl: ".product-details-button-next",
                      prevEl: ".product-details-button-prev",
                    }}
                  >
                    {products.map((item, index) => (
                      <SwiperSlide key={index}>
                        <div className="swiper-slides">
                          <div className="product-details-thumb">
                          <Image
                        src="/images/default-image.jpg" // Placeholder image
                        loader={imageLoader}
                        style={{ width: "100%", height: "auto" }}
                        alt="Product Image"
                      />
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="product-details-nav-button">
                    <div className="product-details-button-prev">
                      <i className="fa-solid fa-arrow-left"></i>
                    </div>
                    <div className="product-details-button-next">
                      <i className="fa-solid fa-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="product-details-thumb-bottom">
              <div className="product-details-slider-dot">
                <div className="swiper product-details-nav">
                  <div className="swiper-wrapper">
                    <Swiper
                      onSwiper={(swiper) => setThumbsSwiper(swiper)}
                      loop={true}
                      spaceBetween={0}
                      slidesPerView={6}
                      modules={[Controller, FreeMode, Thumbs]}
                      watchSlidesProgress={false}
                    >
                      {shopProducts.map((item, index) => (
                        <SwiperSlide key={index}>
                          <button className="custom-button">
                          <Image
                        src="/images/default-image.jpg" // Placeholder image
                        loader={imageLoader}
                        style={{ width: "100%", height: "auto" }}
                        alt="Product Image"
                      />
                          </button>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {item?._id && (
          <div className="col-xxl-6 col-xl-6 col-lg-6">
            <div className="product-details-wrapper">
              <h2 className="product-details-title small mb-10">
                {item?.name}
              </h2>
              <div className="product-details-rating d-flex align-items-center mb-15">
              <div className="product-rating">
              <StarRating rating={averageRating} />
            </div>
                <div className="product-details-rating-count ml-10">
                  <span> {numberOfReviews} {numberOfReviews === 1 ? 'review' : 'reviews'}</span>
                </div>
              </div>
              <div className="product-details-info mb-10">
              <p>Description:</p>
              <span>{item.description}</span>
              </div>
              <div className="product-details-price mb-10">
                <h4 className="product-details-ammount">${item?.price}</h4>
              </div>
              <div className="product-details-info mb-10">
                <p>Seller:</p>
                <span>{item.seller}</span>
              </div>
              {item && (userRole === "Seller" || userRole === "Admin") && (
                <div className="product-details-info mb-10">
                  <p>Available Quantity:</p>
                  <span>{item.quantity}</span>
                </div>
              )}
             
              {item && (userRole === "Seller" || userRole === "Admin") && (
                
                <div className="product-details-info mb-10">
                  <p>Sales:</p>
                  <span>{item.sales}</span>
                </div>
              )}
             {item && userRole === "Tourist" && (
                <div className="product-details-count-wrap d-flex flex-wrap gap-10 align-items-center">
                  <div className="product-details-action d-flex flex-wrap align-items-center ml-15">
                    <button
                      className="bd-primary-btn btn-style radius-60"
                      onClick={handlePurchase} // Call the purchase function
                    >
                      <span className="bd-primary-btn-text">Purchase</span>
                      <span className="bd-primary-btn-circle"></span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
       
       <h2>Reviews</h2>
       {item && <ReviewComments product={item} />}
      </div>
      <ToastContainer />
    </>
  );
};

export default ProductDetailsSection;
