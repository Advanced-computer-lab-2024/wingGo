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
import React, { useState, useEffect } from "react";
import StarRating from "@/components/Products/StarRating";
import { calculateAverageRating } from "@/utils/utils"; // Adjust the import path as necessary
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ArchiveUnarchiveProduct, ArchiveUnarchiveProductAdmin, fetchProductImage } from "@/api/productApi";
import { useCurrency } from "@/contextApi/CurrencyContext"; // Import the currency con


interface propsType {
  item: Product;
  classItem: string;
  userRole: "Tourist" | "Admin" | "Seller"; // Add userRole prop
}

const ShopContentSingleCard = ({ item, classItem, userRole }: propsType) => {
  const { setModalData } = useGlobalContext();
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const hardcodedSellerId = "67158afc7b1ec4bfb0240575"; // Hardcoded sellerId for now till the login
  const { currency } = useCurrency(); // Access the current currency from context

  useEffect(() => {
    const loadImage = async () => {
      try {
        if (item._id && item.picture) { // Check if the item has an image
          const url = await fetchProductImage(item._id);
          if (url) {
            console.log("Fetched Image URL:", url); // Verify if a valid URL is returned
            setImageUrl(url);
          }
        }
      } catch (error) {
        console.error("Failed to load image:", error);
      }
    };
    loadImage();
  }, [item._id, item.picture]);

  const handleAddToCart = (product: Product) => {
    dispatch(cart_product(product));
  };

  const handleAddToWishlist = (product: Product) => {
    dispatch(wishlist_product(product));
  };

  const handleEyeClick = async () => {
    const sellerId = userRole === "Seller" ? hardcodedSellerId : "Admin";
    try {
      if (userRole === "Seller") {
        if (item._id) {
          const response = await ArchiveUnarchiveProduct(item._id, sellerId, true);
          if (!item.archive)
            toast.success("Item archived successfully!");
          else
            toast.success("Item unarchived successfully!");
        } else {
          console.error('Error: item._id is undefined');
        }
      } else if (userRole === "Admin") {
        if (item._id) {
          const response = await ArchiveUnarchiveProductAdmin(item._id, true);
          if (!item.archive)
            toast.success("Item archived successfully!");
          else
            toast.success("Item unarchived successfully!");
        } else {
          console.error('Error: item._id is undefined');
        }
      }
    } catch (error) {
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
                {imageUrl ? (
                  <Image 
                    src={imageUrl} 
                    alt="Product image" 
                    width={300} 
                    height={300} 
                    unoptimized 
                    style={{ objectFit: "cover" }} // Apply objectFit directly for Next.js Image
                  />
                ) : (
                  <p>No image for this product...</p>
                )}
              </div>
              <div className="product-image-two">
                {item.imageTwo && <Image src={item.imageTwo} alt="Secondary image" width={300} height={300} />}
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
              {userRole === "Tourist" ? (
                <>
                 {currency} {item.price ? item.price.toFixed(2) : "Loading..."}
                </>
              ) : (
                <>
                  EUR {item.price ? item.price.toFixed(2) : "Loading..."}
                </>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>

      <style jsx>{`
        .product-image-one {
          width: 300px; /* Set the fixed width */
          height: 300px; /* Set the fixed height */
          overflow: hidden; /* Ensures that overflowing parts of images are hidden */
          position: relative; /* Required for the Next.js Image component */
        }

        .product-image-one :global(img) {
          object-fit: cover; /* Crop the image to fit within the container */
          width: 100%; /* Ensure it fills the container width */
          height: 100%; /* Ensure it fills the container height */
        }
      `}</style>
    </>
  );
};

export default ShopContentSingleCard;
