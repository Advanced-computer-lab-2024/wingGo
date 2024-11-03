"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
interface FormData {
  inputOne: string;
  inputTwo: string;
  inputThree: string;
  inputFour: string;
}

const OtpForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const toastId = toast.loading("");
    toast.success("Message Send Successfully", { id: toastId, duration: 1000 });
    reset();
    router.push("/home-two");
  };
  return (
    <>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="otp-input mb-15">
          <div className="input-box">
            <input
              type="text"
              className="input"
              placeholder=""
              maxLength={1}
              {...register("inputOne")}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              className="input"
              placeholder=""
              maxLength={1}
              {...register("inputTwo")}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              className="input"
              placeholder=""
              maxLength={1}
              {...register("inputThree")}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              className="input"
              placeholder=""
              maxLength={1}
              {...register("inputFour")}
            />
          </div>
        </div>
        <div className="sign-btn mb-20">
          <button
            type="submit"
            className="bd-primary-btn btn-style is-bg radius-60"
          >
            <span className="bd-primary-btn-text">Verify</span>
            <span className="bd-primary-btn-circle"></span>
          </button>
        </div>
      </form>
    </>
  );
};

export default OtpForm;
