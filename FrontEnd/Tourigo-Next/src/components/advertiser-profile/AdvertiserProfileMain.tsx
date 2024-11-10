import React from 'react';
import Breadcrumb from "../common/breadcrumb/BreadCrumb";
import AvertiserProfile from "./AdvertiserProfile";



const AvertiserProfileMain = () => {
    return (
        <div className="profile-tabs-main">
            
        <Breadcrumb  titleOne='My Account' titleTwo='My Account' />  
        <AvertiserProfile id={"66fb37dda63c04def29f944e"}/>
        
        </div>
    );
    }

export default AvertiserProfileMain;