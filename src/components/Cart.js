import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";

export default function Cart() {
  const [data, setData] = useState([]);
  const baseURL = "http://localhost:5000/";
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${baseURL}api/items/Get`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    console.log(cart);
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem._id === item._id
      );
      console.log(item._id);

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (item) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((cartItem) =>
          cartItem._id === item._id
            ? {
                ...cartItem,
                quantity: Math.max(0, cartItem.quantity - 1),
              }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0);

      return updatedCart;
    });
  };
  const calculateSubtotal = () => {
  let subtotal = 0;

  cart.forEach((item) => {
    const availableStock = data.find((dataItem) => dataItem._id === item._id)?.quantity || 0;
    const quantity = Math.min(item.quantity, availableStock);

    subtotal += quantity * (item.price - (item.discount * item.price) / 100);
  });

  return `₹‎${subtotal.toFixed(2)}`;
};


  return (
    <>
      <div className="CartDiv row row-ow">
        <div className="col-3 CartHeadings">
          <b>Product</b>
        </div>
        <div className="col-3 CartHeadings">
          <b>Price</b>
        </div>
        <div className="col-3 CartHeadings">
          <b>Quantity</b>
        </div>
        <div className="col-3 CartHeadings">
          <b>Subtotal</b>
        </div>
      </div>
      <div>
        {cart.map((item) => (
          <CartItem
            key={item._id} // Make sure to add a unique key for each item
            JSON={item}
            DataJSON={data.find((itemmm) => itemmm._id === item._id)}
            addToCart={addToCart}
            removeFromCar={removeFromCart}
          />
        ))}
      </div>
      <div className="row row-ow CartProceed">
        <div className="col-6 d-flex">
          <input
            className="form-control me-2 flex-grow-1"
            style={{ fontSize: "14px", height: "36px" }}
            placeholder="Coupon Code"
          />
          <button className="CouponButton">Apply Coupon</button>
        </div>
        <div className="col-6 TotalPriceDiv" style={{ marginBottom: "12px" }}>
          <div className="TotalPriceSubDiv">
            <label className="CartTotalTxt">
              <b>Cart Total</b>
            </label>
            <div className="TotalDivv d-flex">
              <label className="flex-grow-1 mx-2">Subtotal:</label>
              <label className="mx-2">{calculateSubtotal()}</label>
            </div>
            <div className="TotalDivv d-flex">
              <label className="flex-grow-1 mx-2">Shipping:</label>
              <label className="mx-2">Free</label>
            </div>
            <div className="TotalDivv d-flex">
              <label className="flex-grow-1 mx-2">Total:</label>
              <label className="mx-2">{calculateSubtotal()}</label>
            </div>
            <div className="d-flex justify-content-center">
              <Link to="/Checkout" className="CheckoutButton">
                Proceed to checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
