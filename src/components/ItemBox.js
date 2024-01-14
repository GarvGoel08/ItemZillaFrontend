import React from "react";

export default function ItemBox(props) {
  const ITEMJson = props.JSON;
  return (
    <div class="product-card">
      <div>
        <div className="DiscountDiv">-{ITEMJson.discount}%</div>
        <a href={`/Item/${ITEMJson._id}`} className="InfoBtnDiv">
          <span class="material-symbols-outlined">info</span>
        </a>
        <img
          src={`https://firebasestorage.googleapis.com/v0/b/ecommerce-95870.appspot.com/o/${ITEMJson.image}?alt=media&token=15e82622-c526-49ce-8086-a1679de0adf6`}
          alt="Product image"
        />

        <button class="add-to-cart" >Add To Cart</button>
      </div>
      <div class="product-info">
        <h3>{ITEMJson.ItemName}</h3>
        <div>
          <span class="ActualPrice">
            <s>₹‎{ITEMJson.price}</s>
          </span>
          <span class="SellingPrice">₹‎{ITEMJson.price - ITEMJson.price*ITEMJson.discount/100}</span>
        </div>
      </div>
    </div>
  );
}
