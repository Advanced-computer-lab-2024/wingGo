"use client";
import ErrorMessage from "@/elements/error-message/ErrorMessage";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
interface FormData {
  email: string;
  password: string;
}

const ResetPassword = () => {
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
        <div className="input-box mb-15">
          <input
            type="email"
            className="input"
            placeholder="Email Address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage message={errors.email.message as string} />
          )}
        </div>
        <div className="sign-btn mb-20">
          <button
            type="submit"
            className="bd-primary-btn btn-style is-bg radius-60"
          >
            <span className="bd-primary-btn-text">Continue</span>
            <span className="bd-primary-btn-circle"></span>
          </button>
        </div>
      </form>
    </>
  );
};

export default ResetPassword;
