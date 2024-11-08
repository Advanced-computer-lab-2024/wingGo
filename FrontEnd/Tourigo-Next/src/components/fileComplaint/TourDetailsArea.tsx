"use client";
import React, { useState } from "react";
import NiceSelect from "@/elements/NiceSelect";
import { selectLocationData } from "@/data/nice-select-data";
import ErrorMessage from "@/elements/error-message/ErrorMessage";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { File } from "@/interFace/interFace";
import { fileComplaint } from "@/api/complaintsApi"; 

interface FormData {
  title: string;
  body: string;
  date: string;
}

const ComplaintForm = () => {
  const { register, handleSubmit, formState: { errors } , reset} = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // For testing, hardcode the touristId instead of getting it from localStorage
      const touristId = '67240ed8c40a7f3005a1d01d';  // Mock tourist ID for testing
  
      // Submit complaint to the backend
      await fileComplaint(touristId, { ...data, date: new Date(data.date) });
      toast.success("Complaint filed successfully!");
      reset();
    } catch (error) {
      toast.error("Error filing complaint. Please try again.");
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginLeft: "20px" }}>
        <div className="form-section">
          <h4 className="mb-20">Complaint Details</h4>

          {/* Complaint Title */}
          <div className="form-input-box">
            <div className="form-input-title">
              <label htmlFor="title">Complaint Title</label>
            </div>
            <div className="form-input">
              <input
                id="title"
                type="text"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && <ErrorMessage message={errors.title.message as string} />}
            </div>
          </div>

          {/* Complaint Body */}
          <div className="form-input-box">
            <div className="form-input-title">
              <label htmlFor="body">Complaint Body</label>
            </div>
            <div className="form-input">
              <textarea
                id="body"
                {...register("body", { required: "Body is required" })}
              />
              {errors.body && <ErrorMessage message={errors.body.message as string} />}
            </div>
          </div>

          {/* Complaint Date */}
          <div className="form-input-box">
            <div className="form-input-title">
              <label htmlFor="date">Date</label>
            </div>
            <div className="form-input">
              <input
                id="date"
                type="date"
                {...register("date", { required: "Date is required" })}
              />
              {errors.date && <ErrorMessage message={errors.date.message as string} />}
            </div>
          </div>

          <div className="submit-btn">
            <button type="submit" className="btn-style radius-4" style={{ backgroundColor: "#4CAF50", transition: "background-color 0.3s" }} 
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#45a049"} 
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4CAF50"}
           >
              Submit Complaint
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default ComplaintForm;
