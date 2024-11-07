import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function (props) {
  const OrderJSON = props.order;
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  }, [cart]);

  const BuyNowHandle = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem._id === item._id
      );

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
    setTimeout(() => {
      navigate('/Cart');
    }, 0);
  };
  const calculateTotalPrice = () => {
    const totalPrice = OrderJSON.Items.reduce((total, item) => {
      return total + item.quantity * item.pricePerItem;
    }, 0);
    return totalPrice;
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const [itemDetailsList, setItemDetailsList] = useState([]);

  useEffect(() => {
    const fetchItemDetails = async () => {
      const promises = OrderJSON.Items.map(async (item) => {
        const response = await fetch(
          `https://item-zilla-backend.vercel.app/api/items/GetItem`,
          {
            headers: {
              "Content-Type": "application/json",
              ItemID: item.item,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        return data;
      });

      // Wait for all promises to resolve
      const detailsList = await Promise.all(promises);
      setItemDetailsList(detailsList);
    };

    fetchItemDetails();
  }, [OrderJSON]);

  const SellerContact = async (UserID) => {
    try {
      const response = await fetch(`https://item-zilla-backend.vercel.app/api/auth/GetSeller`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "UserID": UserID,
        },
      });
      const ResponseJSON = await response.json();
      window.location.href = `mailto:${ResponseJSON.email}`;
    } catch {
      console.log("Error Fetching User");
    }
  }

  return (
    <div className="OrderBoxMain">
      <div className="OrderBoxSub">
        <div className="OrderDate">
          <div className="OrderPlaced">ORDER PLACED</div>
          <div className="OrderPlacedDate">
            {formatDate(OrderJSON.OrderDate)}
          </div>
        </div>
        <div className="OrderDate OrderNext">
          <div className="OrderPlaced">TOTAL</div>
          <div className="OrderPlacedDate">₹‎{calculateTotalPrice()}</div>
        </div>
        <div style={{ marginLeft: "auto" }} className="OrderDate OrderNext">
          <div className="OrderPlaced">Order Number</div>
          <div className="OrderPlacedDate">{OrderJSON._id}</div>
        </div>
      </div>
      <div className="OrderDetailsMain">
        <div className="OrderDetailsStatus">{OrderJSON.OrderStatus}</div>
        <div className="PaymentStatus">
          {OrderJSON.COD ? "Pay Via Cash on Delivery" : "Paid Online"}
        </div>
        {itemDetailsList.map((itemDetails, index) => {
          return (
            <div>
              <div
                className="SepLine"
                style={{
                  margin: "16px -26px",
                  background: "rgb(169, 169, 169)",
                }}
              />
              <div className="row row-ow">
                <div
                  className="col-md-1 col-sm-3 col-7"
                  style={{ alignItems: "center", display: "flex" }}
                >
                  <img
                    className="OrderImg"
                    src={`https://firebasestorage.googleapis.com/v0/b/ecommerce-95870.appspot.com/o/${itemDetails.image}?alt=media&token=15e82622-c526-49ce-8086-a1679de0adf6`}
                    alt={itemDetails.itemName}
                  />
                </div>
                <div
                  className="col-md-9 col-sm-9 col-5"
                  style={{ alignItems: "center", display: "flex" }}
                >
                  <div className="OrderDetailss">
                    <a href={`/Item/${itemDetails._id}`} className="OrderDetailsName">
                      {itemDetails.ItemName}
                    </a>
                    <div className="SellerName">
                      Sold By: {itemDetails.Seller.Name}
                    </div>
                  </div>
                </div>
                <div
                  className="col-md-2 col-sm-9 col-12"
                  style={{ alignItems: "center", display: "flex" }}
                >
                  <div className="OrderDetailss">
                    <div className="ButtonDiv">
                      <Link
                        className="OrderBoxButtons"
                        to={`/Item/${itemDetails._id}`}
                      >
                        View Item Details
                      </Link>
                    </div>
                    <div className="ButtonDiv">
                      <button className="OrderBoxButtons" onClick={() => SellerContact(itemDetails.Seller.ID)}>
                        Contact Seller
                      </button>
                    </div>
                    <div
                      className="ButtonDiv"
                      onClick={() => BuyNowHandle(itemDetails)}
                    >
                      <button className="OrderBoxButtons">Buy Again</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
