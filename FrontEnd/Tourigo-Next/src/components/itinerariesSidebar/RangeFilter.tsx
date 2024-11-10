// RangeFilter.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";

interface RangeFilterProps {
  min: number;
  max: number;
  onChange: (range: number[]) => void;
}

const STEP = 0.1;

const RangeFilter: React.FC<RangeFilterProps> = ({ min, max, onChange }) => {
  const [values, setValues] = useState([min, max]);

  useEffect(() => {
    setValues([min, max]); // Set initial slider values based on min and max
  }, [min, max]);

  const handleFilterByRange = (updatedValues: number[]) => {
    setValues(updatedValues);
    onChange(updatedValues); // Send updated range to the parent component
  };

  return (
    <div className="sidebar-widget-range">
      <div className="slider-range-wrap">
        <Range
          values={values}
          step={STEP}
          min={min}
          max={max}
          onChange={handleFilterByRange}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              ref={props.ref}
              style={{
                height: "6px",
                width: "100%",
                borderRadius: "4px",
                background: getTrackBackground({
                  values,
                  colors: ["#ccc", "#006CE4", "#ccc"],
                  min,
                  max,
                }),
                alignSelf: "center",
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div className="slider-range-button" {...props}></div>
          )}
        />
      </div>
      <div className="price-filter mt-10">
        <label htmlFor="amount">
          <input
            type="text"
            value={`$${values[0].toFixed(1)} - $${values[1].toFixed(1)}`}
            readOnly
            id="amount"
          />
        </label>
      </div>
    </div>
  );
};

export default RangeFilter;
