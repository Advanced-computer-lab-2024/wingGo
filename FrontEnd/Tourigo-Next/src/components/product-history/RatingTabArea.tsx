"use client";
import GetRatting from "@/hooks/GetRatting";
import { rateProduct, reviewProduct } from '@/api/productApi';
import { Product } from "@/interFace/interFace"; // Adjust the path to match your project structure
import { fetchPurchasedProducts } from '@/api/productApi';
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;  // Corresponds to the `sellerId` in the token
  username: string;
  role: string;
  mustChangePassword: boolean;
}

interface RatingTabAreaProps {
  productId: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

const RatingTabArea: React.FC<RatingTabAreaProps> = ({ productId, onSuccess, onError }) => {
  const [touristId, setTouristId] = useState<string | null>(null);
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);

  const [productRating, setProductRating] = useState<number>(0);
  const [productComment, setProductComment] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.role === "Tourist") {
          setTouristId(decodedToken.id);
        } else {
          console.error("User is not a Tourist.");
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      console.error("No token found. Please log in.");
    }
  }, []);
  

  useEffect(() => {
    const fetchProducts = async () => {
      if (touristId) {
        try {
          const fetchedProducts = await fetchPurchasedProducts(touristId);
          const validProducts = fetchedProducts.filter((product: Product) =>
            product._id &&
            product.name &&
            product.picture &&
            product.price
          );
          setPurchasedProducts(validProducts);
        } catch (error) {
          console.error("Error fetching purchased products:", error);
        }
      }
    };
    fetchProducts();
  }, [touristId]);
  
  

  const handleProductRatingChange = (rating: number) => {
    setProductRating(rating);
  };

  const handleSubmitProductReview = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!touristId) {
    setMessage("You must be logged in as a tourist to leave a review.");
    return;
  }

  if (!productId) {
    setMessage("Invalid product selected. Please try again.");
    return;
  }

  try {
    await rateProduct(touristId, productId, productRating);
    await reviewProduct(touristId, productId, productComment);
    const successMessage =
      "Your product rating and comment were submitted successfully.";
    setMessage(successMessage);
    if (onSuccess) onSuccess(successMessage);
  } catch (error) {
    const errorMessage =
      "Error submitting your product review. Please try again.";
    setMessage(errorMessage);
    if (onError) onError(errorMessage);
  }
};

  

  return (
  <div className="rating-tab mb-35" style={{ padding: '15px' }}>
    <h4 style={{ marginBottom: '15px' }}>Rate & Comment on Product</h4>
    {message && <div className="alert alert-info">{message}</div>}
    {purchasedProducts.length > 0 ? (
      <form onSubmit={handleSubmitProductReview} style={{ padding: '10px' }}>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label>Rating</label>
          <div className="rating-buttons" style={{ marginTop: '10px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleProductRatingChange(star)}
                style={{
                  color: star <= productRating ? "#ffd700" : "#e4e5e9",
                  fontSize: "20px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label>Comment</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Share your experience with the product..."
            value={productComment}
            onChange={(e) => setProductComment(e.target.value)}
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-3"
          disabled={!touristId}
        >
          Submit Product Review
        </button>
      </form>
    ) : (
      <p>No purchased products available for review.</p>
    )}
  </div>
);

};

export default RatingTabArea;
