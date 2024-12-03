"use client";
import { ProductsType } from "@/interFace/interFace";
import {
  cart_product,
  clear_cart,
  decrease_quantity,
  remove_cart_product,
} from "@/redux/slices/cartSlice";
import { RootState } from "@/redux/store";
import CrossIcon from "@/svg/CrossIcon";
import MinusIcon from "@/svg/MinusIcon";
import PlusIcon from "@/svg/PlusIcon";
import Image from "next/image";
import Link from "next/link";
import React, { useState,useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {fetchCartItems,updateCartItemAmount,removeFromCart} from '@/api/cartApi'
import { Cart} from "@/interFace/interFace";

const CartArea = () => {

    const [items, setItems] = useState<Cart[]>([]); // Use Cart[] for the state type
    const dispatch = useDispatch();
    const [total, setTotal] = useState<number>(0); // Explicitly type total as number
  


    useEffect(() => {
      const fetchItems = async () => {
        try {
          const data = await fetchCartItems();
          setItems(data || []); // Fallback to an empty array if data is undefined
        } catch (error) {
          console.error("Error fetching cart items:", error);
          alert("Failed to fetch cart items. Please try again.");
        }
      };
  
      fetchItems();
    }, []);
    useEffect(() => {
      const calculateTotal = () => {
        const newTotal = items.reduce(
          (sum, item) => sum + (item.price || 0) * (item.amount || 1),
          0
        );
        setTotal(newTotal);
      };
  
      calculateTotal();
    }, [items]);



  const cartProducts = useSelector(
    (state: RootState) => state.cart.cartProducts
  );
  const totalPrice = cartProducts.reduce(
    (total, product) => total + (product.price ?? 0) * (product.quantity ?? 0),
    0
  );
  const handleUpdateAmount = async (cartItemId: string, newAmount: number) => {
    try {
     
      console.log('Updating cart item:', { cartItemId, newAmount }); // Debugging
      const updatedCartItem = await updateCartItemAmount(cartItemId, newAmount);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === cartItemId ? { ...item, amount: newAmount } : item
        )
      );
      console.log("Cart item updated:", updatedCartItem);
    } catch (error) {
      alert(" We're sorry, but the quantity you selected exceeds the available stock for this product");
      
    }
  };
 
  const handleDelete = (cartItemId: string) => {
    const userConfirmed = window.confirm(
      "Do you really want to remove this item from the cart?"
    );

    if (userConfirmed) {
      setItems((prevItems) => removeItemFromState(cartItemId, prevItems)); // Optimistically update the state
      removeFromCart(cartItemId)
        .then(() => {
          console.log("Item successfully removed.");
          // alert("Item successfully removed");
        })
        .catch((error) => {
          console.error("Error removing item:", error);
          alert("Failed to remove the item. Please try again.");
          // Revert state if backend call fails
          setItems((prevItems) => [
            ...prevItems,
            items.find((item) => item.productId === cartItemId)!,
          ]);
        });
    }
  };

  // Helper function to remove item from state
  const removeItemFromState = (cartItemId: string, prevItems: Cart[]) => {
    return prevItems.filter((item) => item.productId !== cartItemId);
  };

  const handleExtraMoney = (extra: number) => {
    setTotal(totalPrice + extra);
  };
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>, cartItemId: string) => {
  //   const newAmount = parseInt(e.target.value, 10);
  //   if (newAmount > 0) {
  //     handleUpdateAmount(cartItemId, newAmount); // Call the update handler
  //   }
  // };

 
  return (
    <>
  
    
    
      <section className="bd-cart-area section-space">
        <div className="container">
          {items?.length ? (
            <>
              <div className="row">
                <div className="col-xl-9 col-lg-8">
                  <div className="bd-cart-list mb-25 mr-30">
                    <table className="table">
                      <thead>
                        <tr>
                          <th colSpan={2} className="bd-cart-header-product">
                            Products
                          </th>
                          <th className="bd-cart-header-price"></th>
                          <th className="bd-cart-header-quantity"></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items?.map((item, index) => {
                          const totalAmount = item?.price * item?.amount;
                          return (
                            <tr key={index}>
                              

                              <td className="bd-cart-title">
                                <Link href={`/Product-details/${item.productId}/Tourist`}>{item?.name}</Link>
                              </td>

                              <td className="bd-cart-price">
                                <span>${totalAmount.toFixed(2)}</span>
                              </td>

                              <td className="bd-cart-quantity">
                                <div className="bd-product-quantity">
                                  <span
                                    className="bd-cart-minus"
                                    onClick={() => handleUpdateAmount(item._id,item.amount-1)}
                                  >
                                    <MinusIcon />
                                  </span>
                                  <input
                                    className="bd-cart-input"
                                    type="text"
                                   
                                    value={item.amount}
                                    readOnly
                                  />
                                  <span
                                    className="bd-cart-plus"
                                    onClick={() => handleUpdateAmount(item._id,item.amount+1)}
                                  >
                                    <PlusIcon />
                                  </span>
                                </div>
                              </td>

                              <td className="bd-cart-action">
                                <button
                                  className="bd-cart-action-btn"
                                  onClick={() => handleDelete(item.productId)}
                                >
                                  <CrossIcon />
                                  <span className="ml-1">Remove</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="bd-cart-bottom">
                    <div className="row align-items-end">
                      <div className="col-xl-6 col-md-4">
                        <div className="bd-cart-update">
                          <Link
                            href="/cart"
                            className="bd-primary-btn btn-style has-arrow is-bg radius-60"
                          >
                            <span className="bd-primary-btn-arrow arrow-right">
                              <i className="fa-regular fa-arrow-right"></i>
                            </span>
                            <span className="bd-primary-btn-text">
                              Proceed to Checkout
                            </span>
                            <span className="bd-primary-btn-circle"></span>
                            <span className="bd-primary-btn-arrow arrow-left">
                              <i className="fa-regular fa-arrow-right"></i>
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </>
          ) : (
            <>
              <h3 className="text-center">No Cart Product Found</h3>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default CartArea;
