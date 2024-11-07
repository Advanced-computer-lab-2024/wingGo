import React from "react";


import ProductDetailsSection from "./ProductDetailsSection";
import { idTypeNew } from "@/interFace/interFace";

const ShopDetailsArea = ({ id }: idTypeNew) => {
  return (
    <>
      <section className="bd-shop-area section-space">
        <div className="container">
          <ProductDetailsSection id={id} />
        </div>
      </section>
    </>
  );
};

export default ShopDetailsArea;
