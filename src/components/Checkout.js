import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Checkout() {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const baseURL = "https://itemzillabackend.onrender.com/";
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const authtoken = localStorage.getItem("iz-auth-token");
  const [subtotal, setSubtotal] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressName, setAddressName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [town, setTown] = useState("");
  const [pincode, setPincode] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let total = 0;
    cart.forEach((item) => {
      total +=
        item.quantity * (item.price - (item.discount * item.price) / 100);
    });
    setSubtotal(total);
  }, [cart]);

  useEffect(() => {
    fetch(`${baseURL}api/address/Get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authtoken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAddresses(data);
      })
      .catch((error) => {
        console.error("Error fetching addresses:", error);
      });
  }, []);

  async function sendPaymentInfoToServer(payment_id, signature, orderID, dataa) {
    try {
      const response = await fetch(
        `${baseURL}api/orders/paymentverification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authtoken,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature,
            "razorpay_order_id": orderID,
          },
          body: dataa,
        }
      );
      if (response.status === 201) {
        navigate('/');
        localStorage.removeItem("cart");
        alert('Order Placed Successfully');
      }
    } catch (error) {
      console.error('Error sending payment information to the server:', error);
    }
  }

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const saveAddress = async () => {
    try {
      const response = await fetch(`${baseURL}api/address/Add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authtoken,
        },
        body: JSON.stringify({
          AddressName: addressName,
          StreetAdress: streetAddress,
          Apartment: apartment,
          Town: town,
          Pincode: pincode,
          Mobile: mobile,
          Email: email,
        }),
      });

      if (response.status === 200) {
        // Address saved successfully, you can fetch addresses again if needed.
        console.log("Address saved successfully");
      } else {
        // Handle error if address save fails.
        console.error("Error saving address:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handlePlaceOrder = async () => {
    await saveAddress();

    const dataaaa = JSON.stringify({
      items: cart,
      addressId: selectedAddress,
      paymentMethod: selectedPaymentMethod,
    });

    fetch(`${baseURL}api/orders/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authtoken,
      },
      body: dataaaa,
    })
      .then((response) => response.json())
      .then((data) => {
        if (selectedPaymentMethod === "razorpay") {
          const options = {
            key: "rzp_test_nROCwrFT4NjujG",
            amount: Math.round(data.razorpayOrder.amount * 100),
            currency: "INR",
            name: "ItemZilla",
            description: "Payment for your order",
            order_id: data.razorpayOrder.id,
            handler: function (response) {
              const razorpay_payment_id = response.razorpay_payment_id;
              const razorpay_signature = response.razorpay_signature;

              if (
                response.razorpay_payment_id &&
                response.razorpay_signature
              ) {
                sendPaymentInfoToServer(
                  razorpay_payment_id,
                  razorpay_signature,
                  data.razorpayOrder.id,
                  dataaaa
                );
              } else {
                console.error("Razorpay payment not successful");
              }
            },
            prefill: {
              name: "User Name",
              email: "user@example.com",
              contact: "1234567890",
            },
            notes: {
              address: "User Address",
            },
            theme: {
              color: "#F37254",
            },
          };

          const razorpayInstance = new window.Razorpay(options);
          razorpayInstance.open();
        } else {
          console.log("Order Placed Successfully");
        }
      })
      .catch((error) => {
        console.error("Error placing order:", error);
      });
  };

  return (
    <div className="row row-ow CheckOutDiv">
      <div className="col-7 CheckOutDivHeader">
        <b>Billing Details</b>
        <div className="inputs">
          <input
            type="text"
            className="form-control form-ow"
            placeholder="Name"
          />
          <textarea
            rows={4}
            type="text"
            className="form-control form-ow"
            id="Description"
            placeholder="Street Address"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
          />
          <input
            type="text"
            className="form-control form-ow"
            placeholder="Apartment, floor, etc. (optional)"
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
          />
          <input
            type="text"
            className="form-control form-ow"
            placeholder="Town/City"
            value={town}
            onChange={(e) => setTown(e.target.value)}
          />
          <input
            type="text"
            className="form-control form-ow"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <input
            type="text"
            className="form-control form-ow"
            placeholder="Phone Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <input
            type="email"
            className="form-control form-ow"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="col-5">
        <div className="CheckOutRightDiv">
          <div className="TotalPriceSubDiv1" style={{ marginTop: "60px" }}>
            <div className="TotalDivv1 d-flex">
              <label className="flex-grow-1 mx-2">Subtotal:</label>
              <label className="mx-2">{`₹‎${subtotal.toFixed(2)}`}</label>
            </div>
            <div className="TotalDivv1 d-flex">
              <label className="flex-grow-1 mx-2">Shipping:</label>
              <label className="mx-2">Free</label>
            </div>
            <div className="TotalDivv1 d-flex">
              <label className="flex-grow-1 mx-2">Total:</label>
              <label className="mx-2">{`₹‎${subtotal.toFixed(2)}`}</label>
            </div>

            <div className="mb-3">
              <label htmlFor="addressSelect" className="form-label">
                Select Address
              </label>
              <select
                className="form-select"
                id="addressSelect"
                onChange={(e) => setSelectedAddress(e.target.value)}
                value={selectedAddress}
              >
                {addresses &&
                  addresses.map((address) => (
                    <option key={address._id} value={address._id}>
                      {address.AddressName}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <div className="form-check form-m">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="cod"
                  value="cod"
                  checked={selectedPaymentMethod === "cod"}
                  onChange={handlePaymentMethodChange}
                />
                <label className="form-check-label" htmlFor="cod">
                  Cash On Delivery
                </label>
              </div>
              <div className="form-check form-m">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="razorpay"
                  value="razorpay"
                  checked={selectedPaymentMethod === "razorpay"}
                  onChange={handlePaymentMethodChange}
                />
                <label className="form-check-label" htmlFor="razorpay">
                  Pay Online (Razorpay)
                </label>
              </div>

              <button className="PlaceOrderButton" onClick={handlePlaceOrder}>
                Proceed to checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
