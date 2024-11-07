// OrderPage.js

import React, { useState, useEffect } from "react";
import OrderBox from "./OrderBox";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const authtoken = localStorage.getItem("iz-auth-token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "https://item-zilla-backend.vercel.app/api/orders/get-orders",
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": authtoken,
            },
          }
        );

        const data = await response.json();
        setOrders(data.sort((a, b) => b._id.localeCompare(a._id)));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    <div className="d-flex" style={{ marginTop: "20px" }}>
      <rect className="rectRed" />
      <div className="FeaturedDivText">My Account:</div>
    </div>;

    fetchOrders();
  }, []);

  return (
    <div className="OrderPageDiv">
      <div className="d-flex" style={{marginTop: '24px'}}>
        <rect className="rectRed" />
        <div className="FeaturedDivText">Your Account:</div>
      </div>

      <div className="FeaturedDivSubText">
        <b>Your Orders</b>
      </div>
      {orders.map((order) => (
        <OrderBox key={order._id} order={order} />
      ))}
    </div>
  );
}
