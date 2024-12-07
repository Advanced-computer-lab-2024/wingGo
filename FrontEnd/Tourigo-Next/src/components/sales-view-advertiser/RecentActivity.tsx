'use client';
import { loadAdvertiserSalesReport } from '@/data/sales-report'; // Correct path for the advertiser sales report
import { AdvertiserSales } from '@/interFace/interFace'; // Ensure the interface path is correct
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
  const [salesReport, setSalesReport] = useState<AdvertiserSales | null>(null);
  const advertiserId = '6748d83cda04f07884aba0fe'; // Example Advertiser ID, replace as needed

  useEffect(() => {
    loadAdvertiserSalesReport(advertiserId).then(setSalesReport);
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
                      <th>Item</th>
                      <th>Sales</th>
                      <th>Revenue</th>
                      <th>Sold Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesReport ? (
                      <>
                        {/* Activities Section */}
                        <tr className="section-header">
                          <td colSpan={4} className="text-center">
                            <strong>Activities</strong>
                          </td>
                        </tr>
                        {salesReport.data.activities.details.map((activity, index) => (
                          <tr key={index} className="data-row">
                            <td>{activity.name}</td>
                            <td>{activity.sales}</td>
                            <td>
                              {activity.revenue !== null ? `$${activity.revenue}` : 'N/A'}
                            </td>
                            <td>
                              {activity.soldDate ? formatDate(activity.soldDate) : 'N/A'}
                            </td>
                          </tr>
                        ))}
                        {/* Activities Totals */}
                        <tr className="totals-row">
                          <td><strong>Total</strong></td>
                          <td>{salesReport.data.activities.totalSales}</td>
                          <td>
                            {salesReport.data.activities.totalRevenue !== null
                              ? `$${salesReport.data.activities.totalRevenue}`
                              : 'N/A'}
                          </td>
                          <td>N/A</td>
                        </tr>

                        {/* Grand Totals */}
                        <tr className="grand-total">
                          <td><strong>Grand Total</strong></td>
                          <td>{salesReport.data.totals.totalSales}</td>
                          <td>
                            {salesReport.data.totals.totalRevenue !== null
                              ? `$${salesReport.data.totals.totalRevenue}`
                              : 'N/A'}
                          </td>
                          <td>N/A</td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center">
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

        .custom-table .section-header {
          background-color: #f2f2f2;
          font-weight: bold;
          font-size: 18px;
          position: sticky;
          top: 56px;
          z-index: 1;
        }

        .custom-table .totals-row {
          background-color: #f8f9fa !important;
          font-weight: bold;
        }

        .custom-table .grand-total {
          background-color: #000000 !important;
          color: white !important;
          font-weight: bold;
        }
      `}</style>
    </>
  );
};

export default RecentActivity;
