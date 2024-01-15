import logo from "./logo.svg";
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

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Categories/:categoryName" element={<CategoryFilter />} />
          <Route path="/Item/:ItemID" element={<ItemViewer />} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/SignUp" element={<SignUp/>} />
          <Route path="/Cart" element={<Cart/>} />
          <Route path="/Checkout" element={<Checkout/>} />
          <Route path="/Seller" element={<AddItem/>} />
          <Route path="/OTP" element={<OTP/>} />
        </Routes>
        <div className="NotificationDiv Collapsed">HWLLo</div>
      </Router>
    </>
  );
}

export default App;
