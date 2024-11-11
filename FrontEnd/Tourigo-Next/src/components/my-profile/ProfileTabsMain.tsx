import React from 'react';
import Breadcrumb from "../common/breadcrumb/BreadCrumb";
import ProfileTabs from "./ProfileTabs";



const ProfileTabsMain = () => {
    return (
        <div className="profile-tabs-main">
            
        <Breadcrumb  titleOne='My Account' titleTwo='My Account' />  

        {/* <ProfileTabs id={"6732756e45dae024763e08c9"}/> */}
        {/* <ProfileTabs id={"6703fe21af26882204ffaffc"}/> */}
        <ProfileTabs id={"67240ed8c40a7f3005a1d01d"}/>
        
        </div>
    );
    }

export default ProfileTabsMain;