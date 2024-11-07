import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Checkout(props) {
  const { ShowNotif } = props;
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const baseURL = "https://item-zilla-backend.vercel.app/";
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const authtoken = localStorage.getItem("iz-auth-token");
  const [subtotal, setSubtotal] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressName, setAddressName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [town, setTown] = useState("");
  const [pincode, setPincode] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  if (!authtoken){
    ShowNotif("Error:", "Please SignUp before checkout.");
    navigate("/Login");
  }

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
        console.log(data);

        setAddresses(data);
      })
      .catch((error) => {
        console.error("Error fetching addresses:", error);
      });
  }, []);

  const OptionSelect = (address) => {
    console.log(address);
    if (address != null) {
      setAddressName(address.AddressName);
      setStreetAddress(address.StreetAdress);
      setApartment(address.Apartment);
      setTown(address.Town);
      setPincode(address.Pincode);
      setMobile(address.Mobile);
      setEmail(address.Email);
    }
  };

  async function sendPaymentInfoToServer(
    payment_id,
    signature,
    orderID,
    dataa
  ) {
    try {
      const response = await fetch(`${baseURL}api/orders/paymentverification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authtoken,
          razorpay_payment_id: payment_id,
          razorpay_signature: signature,
          razorpay_order_id: orderID,
        },
        body: dataa,
      });
      if (response.status === 201) {
        navigate("/");
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("storage"));
        ShowNotif(
          "Order Placed:",
          "Your Order was placed successfully, thanks for shopping with us"
        );
      }
    } catch (error) {
      ShowNotif("Error:", "Error sending payment information to the server");
    }
  }

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const isEmailValid = (email) => {
    // Simple email validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAddressFields = () => {
    const errors = [];

    if (addressName.length < 3) {
      errors.push("Name should be at least 3 characters");
    }

    if (streetAddress.length < 3) {
      errors.push("Street Address should be at least 3 characters");
    }

    if (town.length < 3) {
      errors.push("Town should be at least 3 characters");
    }

    if (!pincode || pincode.toString().length < 3) {
      errors.push("Pincode should be at least 3 characters");
    }

    if (!mobile || mobile.toString().length !== 10) {
      errors.push("Mobile number should be exactly 10 digits");
    }

    if (!isEmailValid(email)) {
      errors.push("Invalid email address");
    }

    return errors;
  };

  const saveAddress = async () => {
    try {
      const errors = validateAddressFields();

      if (Object.keys(errors).length > 0) {
        alert(errors[0]);
        return;
      }

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
        console.log("Address saved successfully");
        const data = await response.json();
        return data;
      } else {
        console.error("Error saving address:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handlePlaceOrder = async () => {
    const errors = validateAddressFields();

    if (Object.keys(errors).length > 0) {
      ShowNotif("Error:", "Please input Address correctly");
      return;
    }
    const AddressJSON = await saveAddress();

    const dataaaa = JSON.stringify({
      items: cart,
      addressId: AddressJSON._id,
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

              if (response.razorpay_payment_id && response.razorpay_signature) {
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
          ShowNotif(
            "Order Placed:",
            "Your Order was placed successfully, thanks for shopping with us"
          );
          window.dispatchEvent(new Event("storage"));
          localStorage.removeItem("cart");
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error placing order:", error);
      });
  };

  return (
    <div className="row row-ow CheckOutDiv">
      <div className="col-7 CheckOutDivHeader checkout-100">
        <b>Billing Details</b>
        <div className="inputs">
          <input
            type="text"
            className="form-control form-ow"
            placeholder="Name"
            value={addressName}
            onChange={(e) => setAddressName(e.target.value)}
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

      <div className="col-5 checkout-100">
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

            <div className="mb-3" style={{marginTop: '18px'}}>
              <label htmlFor="addressSelect" className="form-label">
                Select Address
              </label>
              <select
                className="form-select"
                id="addressSelect"
                onChange={(e) => {
                  setSelectedAddress(e.target.value);
                  OptionSelect(
                    addresses.find((address) => address._id === e.target.value)
                  );
                }}
                value={selectedAddress}
              >
                <option value={null}>AddNew</option>
                {addresses &&
                  addresses.map((address) => (
                    <option key={address._id} value={address._id}>
                      {address.AddressName}
                    </option>
                  ))}
              </select>
            </div>

            <div style={{marginTop: '18px'}}>
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
