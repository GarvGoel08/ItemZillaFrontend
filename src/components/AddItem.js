import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function AddItem() {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const authtoken = localStorage.getItem("iz-auth-token");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const baseURL = "https://item-zilla-backend.vercel.app/";
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const CheckUser = async () => {
      try {
        console.log(authtoken);
        if (!authtoken){
            navigate('/');
        }
        const url = `${baseURL}api/auth/GetUser`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'auth-token': authtoken,
          },
        });
        const jsonData = await response.json();
        console.log(jsonData);
        if (!jsonData.seller){
            navigate('/');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    CheckUser();
  }, []); 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const url = `${baseURL}api/categories/Get`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": {authtoken},
          },
        });
        const jsonData = await response.json();
        setCategoryOptions(jsonData); 
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("ItemName", itemName);
      formData.append("ItemDescription", itemDescription);
      formData.append("quantity", quantity);
      formData.append("price", price);
      formData.append("discount", discount);
      formData.append("type", selectedCategory);
      formData.append("itemImage", image);

      axios.defaults.headers.common["auth-token"] = authtoken;

      const response = await axios.post(
        `${baseURL}api/items/Add`,
        formData
      );

      setErrors([]);
      setSuccessMessage(response.data.message);
    } catch (error) {
      if (error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors([error.message]);
      }
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  return (
    <div className="app">
      <h1>Add Item</h1>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error) => (
            <p key={error.msg}>{error.msg}</p>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="itemName">Item Name:</label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="itemDescription">Item Description:</label>
          <textarea
            id="itemDescription"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="discount">Discount (%):</label>
          <input
            type="number"
            id="discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="itemImage">Item Image:</label>
          <input type="file" id="itemImage" onChange={handleImageChange} />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categoryOptions.map((category) => (
              <option key={category._id} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}
