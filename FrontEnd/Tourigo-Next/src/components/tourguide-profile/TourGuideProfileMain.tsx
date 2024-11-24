import React from 'react';
import Breadcrumb from "../common/breadcrumb/BreadCrumb";

import TourGuideProfile from './TourGuideProfile';



const TourGuideProfileMain = () => {
    return (
        <div className="profile-tabs-main">
            
        <Breadcrumb  titleOne='My Account' titleTwo='My Account' />  
        {/* <TourGuideProfile id={"67325c530b3e54ad8bfe1678"}/>  */}
        <TourGuideProfile id={"6735d18c79a63234aa6bc995"}/> 
        
        {/* <TourGuideProfile id={"67244655313a2a345110c1e6"}/> */}
       
        
        </div>
    );
    }

export default TourGuideProfileMain;