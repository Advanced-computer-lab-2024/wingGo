import { idTypeNew } from "@/interFace/interFace";
import React from "react";
import Breadcrumb from "../common/breadcrumb/BreadCrumb";
import ShopDetailsArea from "./ShopDetailsArea";

const ShopDetailsMain = ({ id }: idTypeNew) => {
  return (
    <>
      <Breadcrumb titleOne="Shop Details" titleTwo="Shop Details" />
      <ShopDetailsArea id={id} />
    </>
  );
};

export default ShopDetailsMain;
