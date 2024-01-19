import React from "react";

export default function CartItem(props) {
  const cartJSON = props.JSON;
  const { addToCart, removeFromCar, DataJSON } = props;
  console.log(DataJSON);
  return (
    <>
    
    <div className="CartItemDiv row row-ow PCCart" style={{ justifyContent: "center", alignItems: "center" }}>
      <div className="col-3 CartItems d-flex" style={{alignItems: 'center', overflow: 'hidden', textWrap: 'nowrap'}}>
        <img src={`https://firebasestorage.googleapis.com/v0/b/ecommerce-95870.appspot.com/o/${DataJSON?.image}?alt=media&token=15e82622-c526-49ce-8086-a1679de0adf6`} style={{maxHeight: '46px'}}></img>
        <label style={{marginLeft: '10px'}}>{DataJSON?.ItemName}</label>
      </div>
      <div className="col-3 CartItems">₹‎{DataJSON?.price - DataJSON?.price*DataJSON?.discount/100}</div>
      <div className="col-3 CartItems">
        <div className="AddCardtDiv1" style={{ margin: "0", fontSize: '12px!important' }}>
          <button className="AddCartPageBtn1 bgw">
            <span className="material-symbols-outlined"  onClick={() => removeFromCar(cartJSON)}>remove</span>
          </button>
          <label className="LabelPageInfroAC1">{Math.min(cartJSON.quantity, DataJSON?.quantity)}</label>
          <button className="AddCartPageBtn1 bgdb" disabled={cartJSON.quantity >= DataJSON?.quantity}  onClick={() => addToCart(cartJSON)}>
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>
      <div className="col-3 CartItems">₹‎{(DataJSON?.price - DataJSON?.price*DataJSON?.discount/100)*Math.min(cartJSON.quantity, DataJSON?.quantity)}</div>
    </div>
    <div
      className="CartItemDiv row row-ow MobileCart"
      style={{ justifyContent: "center", display: 'none',alignItems: "center" }}
    >
      <div
        className="col-3  d-flex"
        style={{ alignItems: "center", overflow: "hidden", textWrap: "nowrap", padding: '0' }}
      >
        <img
          src={`https://firebasestorage.googleapis.com/v0/b/ecommerce-95870.appspot.com/o/${DataJSON?.image}?alt=media&token=15e82622-c526-49ce-8086-a1679de0adf6`}
          style={{ maxWidth: "100%"}}
        ></img>
      </div>

      <div style={{ paddingLeft: "30px" }} className="col-9 CartItems">
        <label>{DataJSON?.ItemName}</label>
        <div className=" CartItems">
        ₹‎{DataJSON?.price - (DataJSON?.price * DataJSON?.discount) / 100}
      </div>
      <div className=" CartItems">
        <div
          className="AddCardtDiv1"
          style={{ margin: "0", fontSize: "12px!important" }}
        >
          <button className="AddCartPageBtn1 bgw">
            <span
              className="material-symbols-outlined"
              onClick={() => removeFromCar(cartJSON)}
            >
              remove
            </span>
          </button>
          <label className="LabelPageInfroAC1">
            {Math.min(cartJSON.quantity, DataJSON?.quantity)}
          </label>
          <button
            className="AddCartPageBtn1 bgdb"
            disabled={cartJSON.quantity >= DataJSON?.quantity}
            onClick={() => addToCart(cartJSON)}
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>
      <div className=" CartItems">
        ₹‎
        {(DataJSON?.price - (DataJSON?.price * DataJSON?.discount) / 100) *
          Math.min(cartJSON.quantity, DataJSON?.quantity)}
      </div>
      </div>
    </div></>
  );
}
