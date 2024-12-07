'use client';
import { loadTouristReportofAdvertiser } from '@/data/sales-report'; // Ensure the correct path is used
import { TouristReportOfAdvertiser } from '@/interFace/interFace'; // Ensure the interface path is correct
import React, { useEffect, useState } from 'react';

// Helper function to format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const RecentActivity = () => {
  const [touristReport, setTouristReport] = useState<TouristReportOfAdvertiser | null>(null);
  const advertiserId = '66fb37dda63c04def29f944e'; // Example Advertiser ID, replace as needed

  useEffect(() => {
    loadTouristReportofAdvertiser(advertiserId).then(setTouristReport);
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg rounded-lg border-0">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered custom-table mb-0">
                  <thead className="table-header">
                    <tr>
                      <th>Activity Name</th>
                      <th>Total Tourists</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {touristReport ? (
                      <>
                        {touristReport.data.activities.details.map((activity, index) => (
                          <tr key={index} className="data-row">
                            <td>{activity.name}</td>
                            <td>{activity.totalTourists}</td>
                            <td>
                              {activity.details.map((detail, idx) => (
                                <div key={idx}>
                                  <strong>People:</strong> {detail.numberOfPeople}, 
                                  <strong> Date:</strong> {formatDate(detail.soldDate)}
                                </div>
                              ))}
                            </td>
                          </tr>
                        ))}
                        {/* Totals */}
                        <tr className="totals-row">
                          <td><strong>Total Tourists</strong></td>
                          <td>{touristReport.data.activities.totalTourists}</td>
                          <td></td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center">
                          <strong>Loading data...</strong>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS styles */}
      <style jsx>{`
        .custom-table {
          font-family: 'Poppins', sans-serif;
          border-collapse: collapse;
        }

        .custom-table th,
        .custom-table td {
          padding: 14px;
          text-align: center;
          border: 2px solid #ddd;
        }

        .custom-table th {
          background-color: black;
          color: white;
          font-size: 16px;
          font-weight: bold;
          position: sticky;
          top: 0;
          z-index: 2;
        }

        .custom-table .data-row:hover {
          background-color: #f9f9f9;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .custom-table .totals-row {
          background-color: #000000 !important; /* Black background */
          color: white !important; /* White text */
          font-weight: bold;
        }
      `}</style>
    </>
  );
};

export default RecentActivity;
