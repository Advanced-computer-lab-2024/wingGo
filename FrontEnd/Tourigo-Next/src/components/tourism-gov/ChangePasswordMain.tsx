
import ResetPassword from "@/forms/ResetPassword";
import React from "react";
import ChangePassword from "./ChangePassword";


interface Props {
    id: string;
    }

const ChangePasswordMain: React.FC<Props> = ( {id}) => {
  return (
    <>
      <section className="bd-forgot-area section-space">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xxl-5">
              <div className="sign-form-wrapper text-center">
                <h4 className="title">Reset Password</h4>
                <p>Enter your email address to request password reset</p>
                <ChangePassword id={id} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChangePasswordMain;