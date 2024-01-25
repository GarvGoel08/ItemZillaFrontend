import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import CategoryFilter from "./components/CategoryFilter";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import ItemViewer from "./components/ItemViewer";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import AddItem from "./components/AddItem";
import OTP from "./components/OTP";
import OrderPage from "./components/OrderPage";
import AccountInfo from "./components/AccountInfo";

function App() {
  const [notificationTitle, SetNotificationTitle] = useState("");
  const [notificationDesc, SetNotificationDesc] = useState("");
  const useNotification = (title, desc) => {
    SetNotificationDesc(desc);
    SetNotificationTitle(title);
    const timeoutId = setTimeout(() => {
      SetNotificationDesc("");
      SetNotificationTitle("");
    }, 5000);
  };
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage ShowNotif={useNotification}/>} />
          <Route
            path="/Categories/:categoryName"
            element={<CategoryFilter ShowNotif={useNotification} />}
          />
          <Route
            path="/Item/:ItemID"
            element={<ItemViewer ShowNotif={useNotification} />}
          />
          <Route
            path="/Login"
            element={<Login ShowNotif={useNotification} />}
          />
          <Route
            path="/SignUp"
            element={<SignUp ShowNotif={useNotification} />}
          />
          <Route
            path="/Cart"
            element={<Cart ShowNotif={useNotification} />}
          />
          <Route
            path="/Checkout"
            element={<Checkout ShowNotif={useNotification} />}
          />
          <Route
            path="/Seller"
            element={<AddItem ShowNotif={useNotification} />}
          />
          <Route
            path="/OTP"
            element={<OTP ShowNotif={useNotification} />}
          />
          <Route
            path="/Orders"
            element={<OrderPage ShowNotif={useNotification} />}
          />
          <Route
            path="/Account"
            element={<AccountInfo ShowNotif={useNotification} />}
          />
        </Routes>
        <div id="notification" className={`notification-container ${notificationTitle === "Error:"?("NotifError"):("")} ${notificationTitle === ""?("Collapsed"):("")}`} >
          <div className="notification-title">{notificationTitle}</div>
          <div className="notification-description">{notificationDesc}</div>
        </div>
      </Router>
    </>
  );
}

export default App;
