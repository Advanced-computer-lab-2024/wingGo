"use client";
import useGlobalContext from "@/hooks/use-context";
import { Product } from "@/interFace/interFace";
import { useAppDispatch } from "@/redux/hooks";
import { cart_product } from "@/redux/slices/cartSliceproduct";
import { wishlist_product } from "@/redux/slices/wishlistSliceproduct";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import StarRating from "@/components/Products/StarRating"; 
import { calculateAverageRating } from "@/utils/utils"; // Adjust the import path as necessary

interface propsType {
  item: Product;
  classItem: string;
}

const ShopContentSingleCard = ({ item, classItem }: propsType) => {
  const { setModalData } = useGlobalContext();
  const dispatch = useAppDispatch();

  const handleAddToCart = (product: Product) => {
    dispatch(cart_product(product));
  };
  const handleAddToWishlist = (product: Product) => {
    dispatch(wishlist_product(product));
  };

  // Calculate the average rating
  const averageRating = calculateAverageRating(item.ratings);
 
  return (
    <>
      <div className={classItem}>
        <div className="product-wrapper">
          <div className="product-image-wrapper image-hover-effect">
            <Link href={`/Product-details/${item._id}`} className="product-image">
              <div className="product-image-one">
                <Image src={item.image} alt="image not found" />
              </div>
              <div className="product-image-two">
                {item.imageTwo && (
                  <Image src={item.imageTwo} alt="image not found" />
                )}
              </div>
            </Link>
            {item.name ? (
              <span className="product-label">
                <span className={`bd-badge fw-5 ${item.name}`}>
                  {item.name}
                </span>
              </span>
            ) : (
              ""
            )}
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
            <div className="product-rating">
              <StarRating rating={averageRating} />
            </div>
            <h5 className="product-title underline custom_mb-5">
             
              <Link href={`/Product-details/${item._id}`}>
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
      </div>
    </>
  );
};

export default ShopContentSingleCard;