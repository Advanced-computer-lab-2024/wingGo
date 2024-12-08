import React from "react";
import Breadcrumb from "../common/breadcrumb/BreadCrumb";
import WishlistArea from "./WishlistArea";

const WishlistMain = () => {
  return (
    <>
      <Breadcrumb titleOne="Wishlist" titleTwo="Wishlist" />
      <WishlistArea 
      userRole="Tourist" />
    </>
  );
};

export default WishlistMain;
