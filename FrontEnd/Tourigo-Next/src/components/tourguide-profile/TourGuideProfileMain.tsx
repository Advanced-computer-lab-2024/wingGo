import React from 'react';
import Breadcrumb from "../common/breadcrumb/BreadCrumb";

import TourGuideProfile from './TourGuideProfile';



const TourGuideProfileMain = () => {
    return (
        <div className="profile-tabs-main">
            
        <Breadcrumb  titleOne='My Account' titleTwo='My Account' />  
        <TourGuideProfile id={"67244655313a2a345110c1e6"}/>
        
        </div>
    );
    }

export default TourGuideProfileMain;