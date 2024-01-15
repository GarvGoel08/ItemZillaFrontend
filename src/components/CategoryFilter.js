import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ItemBox from "./ItemBox";

export default function CategoryFilter() {
  const {categoryName} = useParams();

  const [Items, setItems] = useState([]);
  const baseURL = "https://itemzillabackend.onrender.com/";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${baseURL}api/items/Get`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const jsonData = await response.json();
        setItems(jsonData.filter((item) => item.type === categoryName));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <div className="FeaturedDiv">
        <div className="d-flex">
          <rect />
          <div className="FeaturedDivText">{categoryName}:</div>
        </div>
        <div className="FeaturedDivSubText">
          <b>Browse From Results</b>
        </div>
        <div className="ItemList">
          {Items.map((item) => (
            <ItemBox JSON={item} />
          ))}
        </div>
      </div>
    </>
  );
}
