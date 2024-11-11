"use client";
import Image, { StaticImageData } from "next/image";
import React , {useState} from "react";
import { imageLoader } from "@/hooks/image-loader";
import Link from "next/link";
import { teamData } from "@/data/team-data";
import { format } from 'date-fns';
import { deleteTouristProfile } from "@/api/ProfileApi";
import { useRouter } from "next/router";
import { TbUpload } from "react-icons/tb";
import { requestAccountDeletion, uploadSellerLogo } from "@/api/SellerProfileApi";




interface ProfileDetailsProps {
    id: string,
    profileData: any,
    logo: any,
    setRefreshLogo: any
  }

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ id , profileData, logo, setRefreshLogo}) => {

    
    const filterData = teamData.find((item) => item?.id == 1);
    const advertiser = profileData;
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
  
    
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'yyyy-MM-dd');
    };

    

    const handleDelete = async () => {
        try {
            const response = await requestAccountDeletion(id);
            console.log('Delete response:', response);
            
            window.location.href = '/';
            
          } catch (error) {
            console.error('Error deleting profile:', error);
            // Handle error (e.g., show an error message)
          }
    }


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          setSelectedFile(event.target.files[0]);
        }
      };

      const handleUpload = async () => {
        if (!selectedFile) {
          console.error('No file selected');
          return;
        }
    
        const formData = new FormData();
        formData.append('file', selectedFile);

        //formData.append('IDdocument', selectedFile);
        //formData.append('certificate', selectedFile2);
    
        try {
          const response = await uploadSellerLogo(id, formData);
          console.log('Upload response:', response);
            setRefreshLogo(true);
            setSelectedFile(null);
          // Handle success (e.g., show a success message or update the UI)
        } catch (error) {
          console.error('Error uploading file:', error);
          // Handle error (e.g., show an error message)
        }
      };

    

  return (advertiser ?
    <>
      <section className="bd-team-details-area section-space position-relative">
        <div className="container">
          <div className="row justify-content-between gy-24">
            <div className="col-xxl-3 col-xl-5 col-lg-5 col-md-5">
              <div className="team-details-thumb sidebar-sticky">
              {logo && (
                  <Image
                  src={logo?.imageUrl}
                  alt="Product Image"
                  width={500} // Adjust width as needed
                  height={500} // Adjust height as needed
                  unoptimized
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
                )}

                <div className="file-upload mt-3">
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleUpload} className="btn btn-primary mt-2">
                      <TbUpload size={20} />
                    </button>
                  </div>
              </div>
            </div>
            <div className="col-xxl-9 col-xl-7 col-lg-7 col-md-7">
              <div className="team-single-wrapper">
                <div className="team-contents mb-30">
                  <div className="team-heading mb-15">
                    <h2 className="team-single-title">{advertiser?.companyName}</h2>
                    <h6 className="designation theme-text">
                      Advertiser
                    </h6>
                  </div>
                  
                  <div className="team-info mb-20">
                    <h4 className="mb-15">Information:</h4>
                    <ul>
                    <li>
                        <span className="team-label">Contact Person : </span>
                        {advertiser?.contactPerson}
                      </li>
                      <li>
                        <span className="team-label">Hotline : </span>
                        {advertiser?.hotline}
                      </li>

                      
                      <li>
                        <span className="team-label">Email : </span>
                        {advertiser?.contactEmail}
                      </li>
                      
                        <li>
                        <span className="team-label">Our Website : </span>
                        <a href={advertiser?.website}> {advertiser?.website} </a>
                      </li>
                    </ul>
                  </div>
                  
                </div>
                

                
              <Link
                href={`/seller/change-password/${id}`} 
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
