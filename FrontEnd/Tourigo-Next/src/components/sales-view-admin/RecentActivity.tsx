'use client'
import { loadSalesReport } from '@/data/sales-report';
import { SalesReport } from '@/interFace/interFace';
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
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null);

  useEffect(() => {
    loadSalesReport().then(setSalesReport);
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
                      <th>App Revenue</th>
                      <th>Date(s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesReport ? (
                      <>
                        {/* Activities Section */}
                        <tr className="section-header">
                          <td colSpan={5} className="text-center">
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
                              {activity.appRevenue !== null ? `$${activity.appRevenue}` : 'N/A'}
                            </td>
                            <td>{activity.soldDate ? formatDate(activity.soldDate) : 'N/A'}</td>
                          </tr>
                        ))}
                        {/* Activities Totals */}
                        <tr className="totals-row">
                          <td><strong>Total</strong></td>
                          <td>{salesReport.data.activities.totalSales}</td>
                          <td>
                            {salesReport.data.activities.totalRevenue !== null ? `$${salesReport.data.activities.totalRevenue}` : 'N/A'}
                          </td>
                          <td>
                            {salesReport.data.activities.totalAppRevenue !== null ? `$${salesReport.data.activities.totalAppRevenue}` : 'N/A'}
                          </td>
                          <td>N/A</td>
                        </tr>

                        {/* Itineraries Section */}
                        <tr className="section-header">
                          <td colSpan={5} className="text-center">
                            <strong>Itineraries</strong>
                          </td>
                        </tr>
                        {salesReport.data.itineraries.details.map((itinerary, index) => (
                          <tr key={index} className="data-row">
                            <td>{itinerary.name}</td>
                            <td>{itinerary.sales}</td>
                            <td>
                              {itinerary.revenue !== null ? `$${itinerary.revenue}` : 'N/A'}
                            </td>
                            <td>
                              {itinerary.appRevenue !== null ? `$${itinerary.appRevenue}` : 'N/A'}
                            </td>
                            <td>
                              {itinerary.soldDates.length > 0
                                ? itinerary.soldDates.map(formatDate).join(', ')
                                : 'N/A'}
                            </td>
                          </tr>
                        ))}
                        {/* Itineraries Totals */}
                        <tr className="totals-row">
                          <td><strong>Total</strong></td>
                          <td>{salesReport.data.itineraries.totalSales}</td>
                          <td>
                            {salesReport.data.itineraries.totalRevenue !== null ? `$${salesReport.data.itineraries.totalRevenue}` : 'N/A'}
                          </td>
                          <td>
                            {salesReport.data.itineraries.totalAppRevenue !== null ? `$${salesReport.data.itineraries.totalAppRevenue}` : 'N/A'}
                          </td>
                          <td>N/A</td>
                        </tr>

                        {/* Products Section */}
                        <tr className="section-header">
                          <td colSpan={5} className="text-center">
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
                              {product.appRevenue !== null ? `$${product.appRevenue}` : 'N/A'}
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
                            {salesReport.data.products.totalRevenue !== null ? `$${salesReport.data.products.totalRevenue}` : 'N/A'}
                          </td>
                          <td>N/A</td>
                          <td>N/A</td>
                        </tr>

                        {/* Grand Totals */}
                        <tr className="grand-total">
                          <td><strong>Grand Total</strong></td>
                          <td>{salesReport.data.totals.totalSales}</td>
                          <td>
                            {salesReport.data.totals.totalRevenue !== null ? `$${salesReport.data.totals.totalRevenue}` : 'N/A'}
                          </td>
                          <td>
                            {salesReport.data.totals.totalAppRevenue !== null ? `$${salesReport.data.totals.totalAppRevenue}` : 'N/A'}
                          </td>
                          <td>N/A</td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">
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

      {/* CSS styles for the component */}
      <style jsx>{`
  .custom-table {
    font-family: 'Poppins', sans-serif;
    border-collapse: collapse;
  }

  .custom-table th, .custom-table td {
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

  /* Totals row with light gray background */
  .custom-table .totals-row {
    background-color: #f8f9fa !important; /* Light gray for totals */
    font-weight: bold;
  }

  .custom-table .totals-row td {
    background-color: #f1f1f1 !important; /* Lighter gray for the cells */
  }

  /* Grand total with contrasting background */
  .custom-table .grand-total {
    background-color: #000000 !important; /* Green for grand total */
    color: white !important;  /* Ensuring white text */
    font-weight: bold;
  }

  .custom-table .data-row:hover {
    background-color: #f9f9f9;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .card-body {
    background-color: #f8f9fa;
    padding: 30px;
    border-radius: 15px;
  }

  .card-title {
    color: #007bff;
    font-size: 24px;
    margin-bottom: 20px;
  }

  .table-responsive {
    overflow-x: auto;
    max-height: 500px;
  }

  .card {
    background: #fff;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  }

  .table-header th {
    background-color: black;
  }
`}</style>
    </>
  );
};

export default RecentActivity;
