import React from "react";
import TourDetails from "./TourDetails";
import Breadcrumb from "../common/breadcrumb/BreadCrumb";
import { idTypeNew } from "@/interFace/interFace";

const TourDetailsMain = ({ id }: idTypeNew) => {
  return (
    <>
      <Breadcrumb titleOne="Activity Details" titleTwo="Activity Details" />
      <TourDetails id={id} />
    </>
  );
};

export default TourDetailsMain;