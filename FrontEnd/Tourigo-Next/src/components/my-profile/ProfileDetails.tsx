"use client";
import Image, { StaticImageData } from "next/image";
import React from "react";
import { imageLoader } from "@/hooks/image-loader";
import Link from "next/link";
import { teamData } from "@/data/team-data";
import { format } from 'date-fns';
import { deleteTouristProfile } from "@/api/ProfileApi";
import { useRouter } from "next/router";


interface ProfileDetailsProps {
    id: string,
    profileData: any
  }

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ id , profileData}) => {

    console.log('Profile Data:', profileData);
    const filterData = teamData.find((item) => item?.id == 1);
    const tourist = profileData;
    console.log('Tourist:', tourist);
  
    
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'yyyy-MM-dd');
    };

    const handleDelete = async () => {
        try {
            const response = await deleteTouristProfile(id);
            console.log('Delete response:', response);
            
            window.location.href = '/';
            
          } catch (error) {
            console.error('Error deleting profile:', error);
            // Handle error (e.g., show an error message)
          }
    }

  return (tourist ?
    <>
      <section className="bd-team-details-area section-space position-relative">
        <div className="container">
          <div className="row justify-content-between gy-24">
            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5">
              <div className="team-details-thumb sidebar-sticky">
                <Image
                  src={filterData?.img as StaticImageData}
                  loader={imageLoader}
                  style={{ width: "100%", height: "auto" }}
                  alt="image"
                />
              </div>
            </div>
            <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7">
              <div className="team-single-wrapper">
                <div className="team-contents mb-30">
                  <div className="team-heading mb-15">
                    <h2 className="team-single-title">{tourist?.username}</h2>
                    <h6 className="designation theme-text">
                      Tourist
                    </h6>
                  </div>
                  
                  <div className="team-info mb-20">
                    <h4 className="mb-15">Information:</h4>
                    <ul>
                      <li>
                        <span className="team-label">Phone : </span>
                        {tourist?.mobileNumber}
                      </li>
                      <li>
                        <span className="team-label">Nationality : </span>
                        {tourist?.nationality}
                      </li>
                      <li>
                        <span className="team-label">Email : </span>
                        {tourist?.email}
                      </li>
                      <li>
                        <span className="team-label">Date of Birth : </span>
                        {tourist?.DOB && formatDate(tourist.DOB)}
                      </li>
                        <li>
                            <span className="team-label">Occupation : </span>
                            {tourist?.jobOrStudent}
                        </li>
                    </ul>
                  </div>
                  
                </div>
                

                
              <Link
                href={`/change-password/${id}`} 
                className="bd-primary-btn btn-style has-arrow radius-60 ">
                <span className="bd-primary-btn-arrow arrow-right">
                  <i className="fa-regular fa-arrow-right"></i>
                </span>
                <span className="bd-primary-btn-text">Change Password</span>
                <span className="bd-primary-btn-circle"></span>
                <span className="bd-primary-btn-arrow arrow-left">
                  <i className="fa-regular fa-arrow-right"></i>
                </span>
              </Link>

              <button
                onClick={handleDelete}
                className="bd-primary-btn btn-style bd-danger has-arrow radius-60 mx-3"
              >
                <span className="bd-primary-btn-arrow arrow-right">
                  <i className="fa-regular fa-arrow-right"></i>
                </span>
                <span className="bd-primary-btn-text">Delete My Account</span>
                <span className="bd-primary-btn-circle"></span>
                <span className="bd-primary-btn-arrow arrow-left">
                  <i className="fa-regular fa-arrow-right"></i>
                </span>
              </button>
            

                



                  
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
 :
    <div>
        <h1>Loading...</h1>
    </div>
    );
};

export default ProfileDetails;
