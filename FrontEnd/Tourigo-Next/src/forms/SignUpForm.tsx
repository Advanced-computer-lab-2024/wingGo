"use client";
import ErrorMessage from "@/elements/error-message/ErrorMessage";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { registerUser } from "@/api/registerApi";
import NiceSelect from "@/elements/NiceSelect";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

interface FormData {
  name: string;
  userName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
  IDdocument?: File;
  certificate?: File;
}

interface Option {
  id: number;
  option: string | number;
}

const roleOptions: Array<Option> = [
  { id: 1, option: "Tourist" },
  { id: 2, option: "Advertiser" },
  { id: 3, option: "Seller" },
  { id: 4, option: "Tour Guide" },
];

const SignUpForm = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>("Tourist");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const toastId = toast.loading("");
    const response = await registerUser(data);
    if ("error" in response) {
      toast.error(`Error: ${response.error}`, { id: toastId });
    } else {
      toast.success("User registered successfully!", { id: toastId });
      reset();
      router.push("/home-two");
    }
  };

  const handleRoleChange = (item: Option ) => {
    setSelectedRole(item.option as string);
  };

  return (
    <>
      <form className="sign-up-form-wrapper" onSubmit={handleSubmit(onSubmit)}>
        <div className="row gy-24 align-items-center justify-content-between">
          <div className="col-12">
            <div className="from-input-box">
              <div className="form-input-title">
                <label htmlFor="userName">
                  User Name<span>*</span>
                </label>
              </div>
              <div className="form-input">
                <input
                  id="userName"
                  type="text"
                  placeholder="User Name"
                  {...register("userName", {
                    required: "User Name is required",
                    minLength: {
                      value: 2,
                      message: "User Name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 15,
                      message: "User Name cannot exceed 15 characters",
                    },
                  })}
                />
                {errors.userName && (
                  <ErrorMessage message={errors.userName.message as string} />
                )}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="from-input-box">
              <div className="form-input-title">
                <label htmlFor="email">
                  Email<span>*</span>
                </label>
              </div>
              <div className="form-input">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter Address"
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
          </div>

          <div className="col-12">
            <div className="from-input-box">
              <div className="form-input-title">
                <label htmlFor="phone">
                  Phone<span>*</span>
                </label>
              </div>
              <div className="form-input">
                <input
                  id="phone"
                  type="text"
                  placeholder="Phone"
                  {...register("phone", {
                    required: "Phone is required",
                    minLength: {
                      value: 2,
                      message: "Phone must be at least 2 characters",
                    },
                    maxLength: {
                      value: 15,
                      message: "Phone cannot exceed 15 characters",
                    },
                  })}
                />
                {errors.phone && (
                  <ErrorMessage message={errors.phone.message as string} />
                )}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="from-input-box">
              <div className="form-input-title">
                <label htmlFor="password">
                  Password<span>*</span>
                </label>
              </div>
              <div className="form-input">
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 2,
                      message: "Password must be at least 2 characters",
                    },
                    maxLength: {
                      value: 15,
                      message: "Password cannot exceed 15 characters",
                    },
                  })}
                />
                {errors.password && (
                  <ErrorMessage message={errors.password.message as string} />
                )}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="from-input-box">
              <div className="form-input-title">
                <label htmlFor="role">
                  Role<span>*</span>
                </label>
              </div>
              <div className="form-input">
                <NiceSelect
                  options={roleOptions}
                  defaultCurrent={1}
                  placeholder="Select Role"
                  className="full-width"
                  onChange={handleRoleChange}
                  name="role"
                />
              </div>
            </div>
          </div>

          {selectedRole !== "Tourist" && (
            <>
              <div className="col-12">
                <div className="from-input-box">
                  <div className="form-input-title">
                    <label htmlFor="IDdocument">
                      ID Document<span>*</span>
                    </label>
                  </div>
                  <div className="form-input">
                    <input
                      id="IDdocument"
                      type="file"
                      {...register("IDdocument", {
                        required: "ID Document is required",
                      })}
                      className="custom-file-input"
                    />
                    <label htmlFor="IDdocument" className="custom-file-label">
                      <FontAwesomeIcon icon={faUpload} /> Upload ID Document
                    </label>
                    {errors.IDdocument && (
                      <ErrorMessage message={errors.IDdocument.message as string} />
                    )}
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="from-input-box">
                  <div className="form-input-title">
                    <label htmlFor="certificate">
                      Certificate<span>*</span>
                    </label>
                  </div>
                  <div className="form-input">
                    <input
                      id="certificate"
                      type="file"
                      {...register("certificate", {
                        required: "Certificate is required",
                      })}
                      className="custom-file-input"
                    />
                    <label htmlFor="certificate" className="custom-file-label">
                      <FontAwesomeIcon icon={faUpload} /> Upload Certificate
                    </label>
                    {errors.certificate && (
                      <ErrorMessage message={errors.certificate.message as string} />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}           
        </div>
        <div className="sign-btn mt-20">
          <button
            type="submit"
            className="bd-primary-btn btn-style is-bg radius-60"
          >
            <span className="bd-primary-btn-text">Sign Up</span>
            <span className="bd-primary-btn-circle"></span>
          </button>
        </div>
      </form>
    </>
  );
};

export default SignUpForm;