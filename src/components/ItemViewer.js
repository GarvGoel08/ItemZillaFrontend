import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ItemBox from "./ItemBox";

export default function ItemViewer() {
  const baseURL = "http://localhost:5000/";
  const [data, setData] = useState([]);
  const [category, setCategory] = useState([]);
  const [items, setItems] = useState([]);
  const { ItemID } = useParams();
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    console.log(cart);
    setCart(prevCart => {
      const existingItem = prevCart.find((cartItem) => cartItem._id === item._id);
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
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${baseURL}api/items/GetItem`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ItemID: ItemID,
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
        setItems(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const redDiv = document.querySelector(".col-6");
      const mainDiv = document.getElementById("ItemDetails");
      const mainDivFF = document.getElementById("ItemDetailsOF");
      const imgL = document.querySelector(".LoginImg");
      const rect = redDiv.getBoundingClientRect();
      const distanceFromTop = rect.top;
      const rect1 = mainDiv.getBoundingClientRect();
      const distanceFromTop1 = rect1.top;
      console.log(distanceFromTop);
      redDiv.style.height = `calc(100vh - ${distanceFromTop}px)`;
      mainDiv.style.height = `calc(100vh - ${distanceFromTop1}px)`;
      imgL.style.maxHeight = redDiv.style.height;
      console.log(redDiv.style.height);
    };

    handleResize(); // Run calculations initially
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on unmount
    };
  }, []);
  return (
    <>
      <div
        className="row row-ow"
        style={{
          marginTop: "26px",
          marginLeft: "26px",
          marginRight: "26px",
        }}
      >
        <div
          className="col-6"
          style={{
            height: "100%",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            Height: "80%",
            maxHeight: "80%",
          }}
        >
          <img
            src={`https://firebasestorage.googleapis.com/v0/b/ecommerce-95870.appspot.com/o/${data.image}?alt=media&token=15e82622-c526-49ce-8086-a1679de0adf6`}
            className="LoginImg"
            style={{
              Height: "80%",
              maxHeight: "80%",
              width: "94%",
              height: "94%",
              objectFit: "cover",
            }}
          />
        </div>
        <div
          className="col-6"
          id="ItemDetails"
          style={{
            alignContent: "center",
            justifyContent: "left",
            alignItems: "normal",
            display: "flex",
          }}
        >
          <div
            id="ItemDetailsOF"
            style={{ width: "100%", margin: "8px 0 0 0" }}
          >
            <div className="d-flex">
              <rect className="rectRed" />
              <div className="FeaturedDivText">Item Details:</div>
            </div>
            <div>
              <label className="ItemName">
                <b>{data.ItemName}</b>
              </label>
            </div>
            <div>
              <label className="Stock">In Stock: {data.quantity} Left</label>
            </div>
            <div className="DiscountItemDiv">-{data.discount}%</div>
            <div className="PriceDiv">
              <label>
                <s>₹‎{data.price}</s>
              </label>
              <label className="DiscountedPrice">
                ₹‎{data.price - (data.discount * data.price) / 100}
              </label>
            </div>
            <div>
              <label
                className="ItemDescription"
                style={{ whiteSpace: "pre-wrap", width: "98%" }}
              >
                {data.ItemDescription}
              </label>
            </div>
            <div className="SepLine" style={{ marginTop: "16px" }}></div>
            <div className="d-flex">
              <div className="AddCardtDiv">
                <button
                  className="AddCartPageBtn bgw"
                  disabled={cart.reduce((total, item) => (item._id === data._id) ? (total + item.quantity) : total, 0) === 0 ? true : false}
                  onClick={() => removeFromCart(data)}
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <label className="LabelPageInfroAC">
                {cart.reduce((total, item) => (item._id === data._id)?(total + item.quantity) : (total), 0)}
                </label>
                <button
                  className="AddCartPageBtn bgdb"
                  disabled={cart.reduce((total, item) => (item._id === data._id) ? (total + item.quantity) : total, 0) >= data.quantity ? true : false}
                  onClick={() => addToCart(data)}
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <Link to='/Cart' className="BuyNow">Buy Now</Link>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "18px" }} className="mx-3">
        <div className="d-flex">
          <rect className="rectRed" />
          <div className="FeaturedDivText">Similar Items:</div>
        </div>
        <div className="FeaturedDivSubText">
          <b>Browse Items Similar to this</b>
        </div>
        <div className="ItemList d-flex" style={{ overflowX: "auto" }}>
          {items.map((item) =>
            item.type === data.type ? <ItemBox JSON={item} /> : null
          )}
        </div>
      </div>
    </>
  );
}