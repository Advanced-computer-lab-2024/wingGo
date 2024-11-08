//ShopContentSingleCard.tsx
"use client";
import useGlobalContext from "@/hooks/use-context";
import { Product } from "@/interFace/interFace";
import { ToastContainer, toast } from "react-toastify";
import { useAppDispatch } from "@/redux/hooks";
import { cart_product } from "@/redux/slices/cartSliceproduct";
import { wishlist_product } from "@/redux/slices/wishlistSliceproduct";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import StarRating from "@/components/Products/StarRating"; 
import { calculateAverageRating } from "@/utils/utils"; // Adjust the import path as necessary
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ArchiveUnarchiveProduct,ArchiveUnarchiveProductAdmin } from "@/api/productApi";
interface propsType {
  item: Product;
  classItem: string;
  userRole: "Tourist" | "Admin" | "Seller"; // Add userRole prop
  
}

const ShopContentSingleCard = ({ item, classItem, userRole}: propsType) => {
  const { setModalData } = useGlobalContext();
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();
  const hardcodedSellerId = "67158afc7b1ec4bfb0240575"; // Hardcoded sellerId for now till the login
  console.log("userRole", userRole);
  console.log("item seller:", item.seller);
  console.log("hardcoded seller", hardcodedSellerId);
  console.log("item:", item);


  const handleAddToCart = (product: Product) => {
    dispatch(cart_product(product));
  };
  const handleAddToWishlist = (product: Product) => {
    dispatch(wishlist_product(product));
  };
  const handleEyeClick = async () => {
    const sellerId = userRole === "Seller" ? hardcodedSellerId : "Admin";
    try {
      if(userRole === "Seller"){
      if (item._id) {
        const response = await ArchiveUnarchiveProduct(item._id, sellerId, true);
        console.log('API response:', response);
        if(!item.archive)
          toast.success("Item archived successfully!");
        else
          toast.success("Item unarchived successfully!");
      } else {
        console.error('Error: item._id is undefined');
      }
    } else if (userRole === "Admin"){
      if (item._id) {
        const response = await ArchiveUnarchiveProductAdmin(item._id, true);
        console.log('API response:', response);
        if(!item.archive)
        toast.success("Item archived successfully!");
      else
        toast.success("Item unarchived successfully!");
      } else {
        console.error('Error: item._id is undefined');
    }
  }}
     catch (error) {
      console.error('Error:', error);
      toast.error("Failed to archive item.");
    }
  }
 
  // Calculate the average rating
  const averageRating = calculateAverageRating(item.ratings);
 
  return (
    <>
      <div className={classItem}>
        <div className="product-wrapper">
          <div className="product-image-wrapper image-hover-effect">
            <Link href={`/Product-details/${item._id}/${userRole}`} className="product-image">
            
            
              <div className="product-image-one">
                <Image src={item.image} alt="image not found" />
              </div>
              <div className="product-image-two">
                {item.imageTwo && (
                  <Image src={item.imageTwo} alt="image not found" />
                )}
              </div>
            </Link>
            
           
            <div className="product-links">
              <ul>
                <li>
                  <button onClick={() => handleAddToWishlist(item)}>
                    <i className="fa fa-heart"></i>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleAddToCart(item)}>
                    <i className="far fa-cart-plus"></i>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalData(item)}
                    data-bs-toggle="modal"
                    data-bs-target="#productModalId"
                  >

                    <i className="far fa-eye"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="product-content">
          {(userRole === "Admin" || (userRole === "Seller" && item.sellerID === hardcodedSellerId)) && (
            <div
              onClick={handleEyeClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ cursor: "pointer" }}
            >
              {isHovered ? <FaEyeSlash /> : <FaEye />}
            </div>
          )}
            <div className="product-rating">
              <StarRating rating={averageRating} />
              
            </div>
            
            <h5 className="product-title underline custom_mb-5">
             
              <Link href={`/Product-details/${item._id}/${userRole}`}>
                    {item.name}
                  </Link>
            </h5>
          


            <div className="product-price">
              {`$${item.price}.00`}{" "}
            </div>
           
            <div>
            
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
      
    </>
  );
};

export default ShopContentSingleCard;