"use client";
import CheckoutForm from "@/forms/CheckoutFormProduct";
import OrderDetails from "./OrderDetails";
import CheckoutLogin from "./CheckoutLogin";
import AddCuponMain from "./AddCuponMain";
import { getProductById } from '@/api/productApi';
import SelectPaymentType from "./SelectPaymentType";
import React, { useState, useEffect } from "react";
interface CheckoutMainProps {
  promoCode: string | null; // Accept promoCode as a prop
  orderId:string | null
}
const CheckoutArea: React.FC<CheckoutMainProps> = ({ promoCode ,orderId}) => {
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "stripe" | "creditCard">("wallet");
   // const [price, setPrice] = useState(0);
   const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });
  return (
    <>
      <section className="checkout-area section-space">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">

              <div className="checkout-bill-area">
                <h3 className="checkout-bill-title">Billing Details</h3>
                <div className="checkout-bill-form">
                  <CheckoutForm promoCode={promoCode} />
                </div>
                 {/* Payment Methods */}
                 <div className="sidebar-widget-divider"></div>
        <div className="sidebar-widget widget">
                 <h5 className="booking-form-title mt-25">Payment Methods</h5>
                <div className="checkout-payment mb-25">
                <SelectPaymentType setPaymentMethod={(method) => setPaymentMethod(method)} promoCode={promoCode}  />

                {paymentMethod === "creditCard" && (
                <div
                  className="credit-card-form"
                  style={{
                    marginTop: "25px", // Space above the form
                    marginBottom: "15px", // Space below the form
                    display: "flex",
                    flexDirection: "column", // Arrange inputs vertically
                    gap: "10px", // Space between fields
                  }}
                >
                  <h6 style={{ marginBottom: "10px" }}>Enter Card Details:</h6>
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                    required
                    style={{
                      width: "250px", // Reduced width
                      height: "30px", // Reduced height
                      padding: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Expiry Date (MM/YY)"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    required
                    style={{
                      width: "250px", // Reduced width
                      height: "30px", // Reduced height
                      padding: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    required
                    style={{
                      width: "250px", // Reduced width
                      height: "30px", // Reduced height
                      padding: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    }}
                  />
                </div>
              
              
                   )}


                </div>
                </div>
                <button className="nextBtn-2 bd-primary-btn btn-style is-bg radius-60" type="submit">
                  <span className="bd-primary-btn-text">Place Order</span>
                  <span className="bd-primary-btn-circle"></span>
                </button>
              </div>
            </div>
            <OrderDetails  promoCode={promoCode} orderId={orderId}   /> 
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckoutArea;
