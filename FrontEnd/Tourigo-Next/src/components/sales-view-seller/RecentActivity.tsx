'use client';
import { loadSellerSalesReport } from '@/data/sales-report'; // Updated to correct path
import { SellerSales } from '@/interFace/interFace'; // Ensure the interface path is correct
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
  const [salesReport, setSalesReport] = useState<SellerSales | null>(null);
  const sellerId = '67158afc7b1ec4bfb0240575'; // Example Seller ID, replace as needed

  useEffect(() => {
    loadSellerSalesReport(sellerId).then(setSalesReport);
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
                      <th>Product</th>
                      <th>Sales</th>
                      <th>Revenue</th>
                      <th>Selling Dates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesReport ? (
                      <>
                        {/* Products Section */}
                        <tr className="section-header">
                          <td colSpan={4} className="text-center">
                            <strong>Products</strong>
                          </td>
                        </tr>
                        {salesReport.data.products.details.map((product, index) => (
                          <tr key={index} className="data-row">
                            <td>{product.name}</td>
                            <td>{product.sales}</td>
                            <td>
                              {product.revenue !== null ? `$${product.revenue}` : 'N/A'}
                            </td>
                            <td>
                              {product.sellingDates.length > 0
                                ? product.sellingDates.map(formatDate).join(', ')
                                : 'N/A'}
                            </td>
                          </tr>
                        ))}
                        {/* Products Totals */}
                        <tr className="totals-row">
                          <td><strong>Total</strong></td>
                          <td>{salesReport.data.products.totalSales}</td>
                          <td>
                            {salesReport.data.products.totalRevenue !== null
                              ? `$${salesReport.data.products.totalRevenue}`
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
