import React from "react";

export default function CartItem(props) {
  const cartJSON = props.JSON;
  const {addToCart, removeFromCar, DataJSON} = props;
  console.log(DataJSON);
  return (
    <div className="CartItemDiv row row-ow" style={{ justifyContent: "center", alignItems: "center" }}>
      <div className="col-3 CartItems">
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
  );
}
