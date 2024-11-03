"use client";
import ErrorMessage from "@/elements/error-message/ErrorMessage";
import Link from "next/link";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  specialRequirements: string;
  firstName2: string;
  lastName2: string;
  firstName3: string;
  lasName3: string;
  firstName4: string;
  lastName4: string;
}

const BookingComponentForm = () => {
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
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row setup-content" id="step-one">
          <div className="col-md-12">
            <div className="booking-form-wrapper mb-35">
              <h4 className="booking-form-title mb-15">
                Island Hopping in the Caribbean: Sun & Sea
              </h4>
              <div className="booking-form-input-wrapper">
                <div className="booking-form-input-box">
                  <div className="booking-form-input-title">
                    <label htmlFor="firstName">
                      First Name<span>*</span>
                    </label>
                  </div>
                  <div className="booking-form-input">
                    <input
                      id="firstName"
                      type="text"
                      {...register("firstName", {
                        required: "First Name is required",
                        minLength: {
                          value: 2,
                          message: "First Name must be at least 2 characters",
                        },
                        maxLength: {
                          value: 15,
                          message: "First Name cannot exceed 15 characters",
                        },
                      })}
                    />
                    {errors.firstName && (
                      <ErrorMessage
                        message={errors.firstName.message as string}
                      />
                    )}
                  </div>
                </div>
                <div className="booking-form-input-box">
                  <div className="booking-form-input-title">
                    <label htmlFor="lastName">Last Name</label>
                  </div>
                  <div className="booking-form-input">
                    <input
                      id="lastName"
                      type="text"
                      {...register("lastName")}
                    />
                  </div>
                </div>
                <div className="booking-form-input-box">
                  <div className="booking-form-input-title">
                    <label htmlFor="email">
                      Email address<span>*</span>
                    </label>
                  </div>
                  <div className="booking-form-input">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email address"
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
                </div>
                <div className="booking-form-input-box">
                  <div className="booking-form-input-title">
                    <label htmlFor="mobile">
                      Mobile Number<span>*</span>
                    </label>
                  </div>
                  <div className="booking-form-input">
                    <input
                      id="mobile"
                      type="text"
                      placeholder="Mobile Number"
                      {...register("mobile", {
                        required: "Mobile is required",
                        minLength: {
                          value: 8,
                          message: "Mobile must be at least 8 characters",
                        },
                        maxLength: {
                          value: 15,
                          message: "Mobile cannot exceed 15 characters",
                        },
                      })}
                    />
                    {errors.mobile && (
                      <ErrorMessage message={errors.mobile.message as string} />
                    )}
                  </div>
                </div>
                <div className="booking-form-info mt-25">
                  <h6 className="booking-form-info-tile mb-10">
                    Additional details:
                  </h6>
                  <div className="booking-form-input-box">
                    <div className="booking-form-input-title">
                      <label htmlFor="text">
                        Do you have special requirements?
                      </label>
                    </div>
                    <div className="booking-form-input">
                      <input
                        id="text"
                        type="text"
                        placeholder=""
                        {...register("specialRequirements")}
                      />
                    </div>
                  </div>
                  <div className="booking-form-adult-info mb-20">
                    <h6 className="booking-form-info-tile mb-10">Adult 1</h6>
                    <div className="booking-form-input-box">
                      <div className="booking-form-input-title">
                        <label htmlFor="firstName2">
                          First Name<span>*</span>
                        </label>
                      </div>
                      <div className="booking-form-input">
                        <input
                          id="firstName2"
                          type="text"
                          placeholder="First Name"
                          {...register("firstName2", {
                            required: "First Name is required",
                            minLength: {
                              value: 2,
                              message:
                                "First Name must be at least 2 characters",
                            },
                            maxLength: {
                              value: 15,
                              message: "First Name cannot exceed 15 characters",
                            },
                          })}
                        />
                        {errors.firstName2 && (
                          <ErrorMessage
                            message={errors.firstName2.message as string}
                          />
                        )}
                      </div>
                    </div>
                    <div className="booking-form-input-box">
                      <div className="booking-form-input-title">
                        <label htmlFor="lastName2">Last Name</label>
                      </div>
                      <div className="booking-form-input">
                        <input
                          id="lastName2"
                          type="text"
                          {...register("lastName2")}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="booking-form-adult-info mb-20">
                    <h6 className="booking-form-info-tile mb-10">Adult 2</h6>
                    <div className="booking-form-input-box">
                      <div className="booking-form-input-title">
                        <label htmlFor="firstName3">
                          First Name<span>*</span>
                        </label>
                      </div>
                      <div className="booking-form-input">
                        <input
                          id="firstName3"
                          type="text"
                          placeholder="First Name"
                          {...register("firstName3", {
                            required: "First Name is required",
                            minLength: {
                              value: 2,
                              message:
                                "First Name must be at least 2 characters",
                            },
                            maxLength: {
                              value: 15,
                              message: "First Name cannot exceed 15 characters",
                            },
                          })}
                        />
                        {errors.firstName3 && (
                          <ErrorMessage
                            message={errors.firstName3.message as string}
                          />
                        )}
                      </div>
                    </div>
                    <div className="booking-form-input-box">
                      <div className="booking-form-input-title">
                        <label htmlFor="lasName3">Last Name</label>
                      </div>
                      <div className="booking-form-input">
                        <input
                          id="lasName3"
                          type="text"
                          {...register("lasName3")}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="booking-form-infant-info mb-25">
                    <h6 className="booking-form-info-tile mb-10">Infant 1</h6>
                    <div className="booking-form-input-box">
                      <div className="booking-form-input-title">
                        <label htmlFor="firstName4">
                          First Name<span>*</span>
                        </label>
                      </div>
                      <div className="booking-form-input">
                        <input
                          id="firstName4"
                          type="text"
                          placeholder="First Name"
                          {...register("firstName4", {
                            required: "First Name is required",
                            minLength: {
                              value: 2,
                              message:
                                "First Name must be at least 2 characters",
                            },
                            maxLength: {
                              value: 15,
                              message: "First Name cannot exceed 15 characters",
                            },
                          })}
                        />
                        {errors.firstName4 && (
                          <ErrorMessage
                            message={errors.firstName4.message as string}
                          />
                        )}
                      </div>
                    </div>
                    <div className="booking-form-input-box">
                      <div className="booking-form-input-title">
                        <label htmlFor="lastName4">Last Name</label>
                      </div>
                      <div className="booking-form-input">
                        <input
                          id="lastName4"
                          type="text"
                          {...register("lastName4")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="booking-form-policy mb-25">
                <h5 className="booking-form-title mb-15">
                  Cancellation policy
                </h5>
                <p className="mb-10">
                  {`"By clicking 'Payment details' and finalizing your booking, you are  agreeing to the `}
                  <Link className="theme-text" href="/terms-conditions">
                    Terms and Conditions
                  </Link>{" "}
                  {`set forth by tourigo.com and the privacy policy of Viator. Take a moment to review our Privacy Statement to understand how we handle and protectyour personal information throughout your booking journey and beyond."`}
                </p>
                <span>
                  <Link className="theme-text" href="/privacy-policy">
                    Privacy Statement
                  </Link>
                </span>
              </div>
            </div>
            <button
              className="nextBtn-2 bd-primary-btn btn-style is-bg radius-60"
              type="submit"
            >
              <span className="bd-primary-btn-text">Payment details</span>
              <span className="bd-primary-btn-circle"></span>
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default BookingComponentForm;
