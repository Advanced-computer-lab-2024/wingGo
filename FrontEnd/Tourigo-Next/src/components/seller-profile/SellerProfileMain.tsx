import React from 'react';
import Breadcrumb from "../common/breadcrumb/BreadCrumb";
import SellerProfile from "./SellerProfile";



const SellerProfileMain = () => {
    return (
        <div className="profile-tabs-main">
            
        <Breadcrumb  titleOne='My Account' titleTwo='My Account' />  
        <SellerProfile id={"6707ab8915816ab90e19401d"}/>
        
        </div>
    );
    }

export default SellerProfileMain;