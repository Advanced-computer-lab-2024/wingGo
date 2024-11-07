//RecentActivity.tsx
'use client'
import { recentActivityData } from '@/data/recent-activity-data';
import { imageLoader } from '@/hooks/image-loader';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Complaint } from '@/interFace/interFace';
import { fetchComplaints } from '@/api/complaintsApi';
import { getComplaintsData } from '@/data/complaints-data';


const ComplaintsList = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved'>('all');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    useEffect(() => {
        const fetchComplaintsData = async () => {
            try {
                const response = await fetchComplaints();
                setComplaints(response);
            } catch (error) {
                console.error("Error fetching complaints:", error);
            }
        };

        fetchComplaintsData();
    }, []);

    // Filter complaints based on the selected status
    const filteredComplaints = complaints.filter((complaint) => 
        statusFilter === 'all' || complaint.state === statusFilter
    );

    // Sort the filtered complaints by date
    const sortedComplaints = [...filteredComplaints].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return (
        <section className="bd-recent-activity section-space-small-bottom">
            <div className="container" style={{ paddingTop: "40px" }}>
                
                
                <div className="row">
                    <div className="col-xxl-12">
                        <div className="recent-activity-wrapper">
                            <div className="section-title-wrapper section-title-space">
                                <h2 className="section-title">Complaints</h2>
                            </div>
                            <div className="row mb-3 d-flex align-items-center" style={{ gap: "20px", paddingBottom: "60px" }}>
                    <div className="col-auto">
                        <label htmlFor="statusFilter" className="me-2">Status:</label>
                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'resolved')}
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                    <div className="col-auto">
                        <label htmlFor="sortOrder" className="me-2">Sort by Date:</label>
                        <select
                            id="sortOrder"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>
                            <div className="recent-activity-content">
                                <div className="table-responsive">
                                    <table className="table mb-0">
                                        <tbody>
                                            {sortedComplaints.map((complaint) => (
                                                <tr key={complaint._id} className="table-custom">
                                                    <td>
                                                        <div className="dashboard-thumb-wrapper p-relative">
                                                            <div className="dashboard-thumb image-hover-effect-two position-relative">
                                                                {/* Add an image or thumbnail here if necessary */}
                                                            </div>
                                                            <div className="dashboard-date">
                                                                <div className="badge bg-primary">
                                                                    <div className="d-block">
                                                                        <h5 className="badge-title">{complaint.state}</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="recent-activity-title-box d-flex align-items-center gap-10">
                                                            <div>
                                                                <h5 className="complaint-title fw-5 underline">
                                                                    <a href="/complaint-details">{complaint.title}</a>
                                                                </h5>
                                                                <p>Status: {complaint.state}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <ul className="recent-activity-list">
                                                            <li className="trip-title" style={{ float: 'right' }}>Sent On: 
                                                            <span className="trip-date">
                                                                    {complaint.date ? new Date(complaint.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                                                                </span>
                                                            </li>
                                                        </ul>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ComplaintsList;
