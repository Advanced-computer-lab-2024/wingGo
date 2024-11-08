"use client";
import { imageLoader } from '@/hooks/image-loader';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { getPurchasedProducts } from '@/data/prod-data'; // Change to product data fetching function
import { Product } from '@/interFace/interFace';
import Link from 'next/link';
import RateCommentModal from './RateCommentModal';


const BookingHistory = () => {
    const [bookedProducts, setBookedProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [activeTab, setActiveTab] = useState('Product'); // Update tab to reflect product history
    const touristId = "672a3a4001589d5085322e88";
    const currentDate = new Date();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPurchasedProducts(touristId);
                console.log("Fetched booked products:", data); // Check the structure
                setBookedProducts(data); // Access purchasedProducts array
            } catch (error) {
                console.error("Failed to load booked products:", error);
            }
        };
        fetchData();
    }, []);
    
    

    const handleRateCommentClick = (product: Product) => {
        setSelectedProduct(product);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    // const handleCancelProductClick = async (product: Product) => {
    //     const userConfirmed = window.confirm("Are you sure you want to cancel this product booking?");
    //     if (!userConfirmed) return;
    
    //     try {
    //         await cancelProductApi(touristId, product._id);
    //         alert('Booking canceled successfully');
    //         setBookedProducts((prev) =>
    //             prev.filter((item) => item._id !== product._id)
    //         );
    //     } catch (error: any) {
    //         alert('Failed to cancel the booking');
    //     }
    // };

    return (
        <>
            <section className="bd-recent-activity section-space-small-bottom">
                <div className="container" style={{ paddingTop: "40px" }}>
                    <div className="row">
                        <div className="col-xxl-12">
                            <div className="recent-activity-wrapper">
                                <div className="section-title-wrapper section-title-space">
                                    <h2 className="section-title">Product Purchased History</h2>
                                </div>
    
                                <div className="recent-activity-content">
                                    <div className="table-responsive">
                                        <table className="table mb-0">
                                            <tbody>
                                                {bookedProducts.map((product) => (
                                                    <tr key={product._id} className="table-custom">
                                                        <td>
                                                            <div className="dashboard-thumb-wrapper p-relative">
                                                                <div className="dashboard-thumb image-hover-effect-two position-relative">
                                                                    <Image
                                                                        src={product.image || "/images/default-image.jpg"}
                                                                        loader={imageLoader}
                                                                        style={{ width: '100%', height: "auto" }}
                                                                        alt="product image" 
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="recent-activity-title-box d-flex align-items-center gap-10">
                                                                <div>
                                                                    <h5 className="product-title fw-5 underline">
                                                                        <Link href={`/Product-details/${product._id}`}>
                                                                            {product.name || 'No name available'}
                                                                        </Link>
                                                                    </h5>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="recent-activity-price-box">
                                                                <h5 className="mb-10">
                                                                    ${product.price ? product.price.toLocaleString("en-US") : 'N/A'}
                                                                </h5>
                                                                <p>Total</p>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                {/* Display the purchase date */}
                                                                <p style={{ marginBottom: '8px', fontSize: '14px', color: '#555' }}>
                                                                    Purchased on: {new Date(product.purchaseDate).toLocaleDateString("en-US")}
                                                                </p>
                                                                <button
                                                                    onClick={() => handleRateCommentClick(product)}
                                                                    className="rate-comment-button"
                                                                    style={{
                                                                        backgroundColor: "blue",
                                                                        color: "white",
                                                                        padding: "8px 16px",
                                                                        fontSize: "14px",
                                                                        borderRadius: "4px",
                                                                        cursor: "pointer",
                                                                        marginBottom: "8px"
                                                                    }}
                                                                >
                                                                    Rate & Comment
                                                                </button>
                                                            </div>
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
    
            {selectedProduct && (
                <RateCommentModal
                    productId={selectedProduct._id || ''}
                    touristId={touristId}
                    product={selectedProduct}
                    onClose={closeModal}
                />
            )}
        </>
    );
};

export default BookingHistory;
