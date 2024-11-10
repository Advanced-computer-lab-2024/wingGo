import React from 'react';
import Breadcrumb from "../common/breadcrumb/BreadCrumb";
import ProfileTabs from "./ProfileTabs";



const ProfileTabsMain = () => {
    return (
        <div className="profile-tabs-main">
            
        <Breadcrumb  titleOne='My Account' titleTwo='My Account' />  
        <ProfileTabs id={"6703fe21af26882204ffaffc"}/>
        
        </div>
    );
    }

export default ProfileTabsMain;