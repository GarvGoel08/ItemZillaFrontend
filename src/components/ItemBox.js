import React, { useEffect, useState } from "react";

export default function ItemBox(props) {
  const ITEMJson = props.JSON;
  const [imageLoaded, setImageLoaded] = useState(false);const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  }, [cart]);

  const addToCart = (item) => {
    console.log(cart);
    setCart(JSON.parse(localStorage.getItem("cart")));
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
    const AddcrtBtn = document.getElementById(`AddToCart${item._id}`);
    AddcrtBtn.innerText = "Added";
    AddcrtBtn.disabled = true;

    setTimeout(() => {
      AddcrtBtn.innerText = "Add to Cart";
      AddcrtBtn.disabled = false;
    }, 1500);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="product-card">
      <div >
        <div>
          {ITEMJson.discount > 0 && (
            <div className="DiscountDiv">-{ITEMJson.discount}%</div>
          )}
          <a href={`/Item/${ITEMJson._id}`} className="InfoBtnDiv">
            <span className="material-symbols-outlined">info</span>
          </a>
          {!imageLoaded && (
            <div
              className="loading-placeholder"
              style={{ height: "150px", width: "200px" }}
            ></div>
          )}
          <img
            src={`https://firebasestorage.googleapis.com/v0/b/ecommerce-95870.appspot.com/o/${ITEMJson.image}?alt=media&token=15e82622-c526-49ce-8086-a1679de0adf6`}
            alt={`Product image ${imageLoaded ? "" : "collapsed"}`}
            onLoad={handleImageLoad}
          />
          <button className="add-to-cart"
          id={`AddToCart${ITEMJson._id}`}
          onClick={() => addToCart(ITEMJson)}>Add To Cart</button>
        </div>
        <div className="product-info">
          <h3 style={{ textWrap: "nowrap", overflow: "hidden" }}>
            {ITEMJson.ItemName}
          </h3>
          <div>
            <span className="ActualPrice">
              <s>₹‎{ITEMJson.price}</s>
            </span>
            <span className="SellingPrice">
              ₹‎{ITEMJson.price - (ITEMJson.price * ITEMJson.discount) / 100}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
