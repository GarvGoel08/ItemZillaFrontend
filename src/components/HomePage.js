import React, { useEffect, useRef, useState } from "react";
import ItemBox from "./ItemBox";
import CategoryBox from "./CategoryBox";
import ScrollableContainer from "./ScrollableContainer";


const HomePage = () => {
  const [Items, setItems] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [Loading, SetLoading] = useState(true);
  const [DealItems, setDealItems] = useState([]);
  const [OriginalItems, setOriginalItems] = useState([]);
  const baseURL = "https://item-zilla-backend.vercel.app/";
  const itemListRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${baseURL}api/categories/Get`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const jsonData = await response.json();
        console.log(jsonData);
        setCategories(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      SetLoading(true);
      try {
        const url = `${baseURL}api/items/Get`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const jsonData = await response.json();
        console.log(jsonData);
        setItems(jsonData);
        setDealItems(jsonData.filter((item) => item.discount >= 20));
        setOriginalItems(
          jsonData.filter(
            (item) => item.Seller.ID === "65a52a942f33053aa8c57633"
          )
        );
        SetLoading(false);
      } catch (error) {
        SetLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div>
        <div
          className={`spinner-border text-danger ${Loading ? "" : "Collapsed"}`}
          style={{ position: "fixed", top: "50%", right: "50%" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      <div className={`${Loading ? "Collapsed" : ""}`}>
        <div className="FeaturedDiv">
          <div className="d-flex">
            <rect />
            <div className="FeaturedDivText">Hot Deals:</div>
          </div>
          <div className="FeaturedDivSubText">
            <b>Browse Today's Deals</b>
          </div>
          <ScrollableContainer>
            {DealItems.map((item, index) => (
              <ItemBox key={index} JSON={item} />
            ))}
          </ScrollableContainer>
        </div>
        <div className="FeaturedDiv">
          <div className="d-flex">
            <rect />
            <div className="FeaturedDivText">Categories:</div>
          </div>
          <div className="FeaturedDivSubText">
            <b>Browse Top Categories</b>
          </div>
          <ScrollableContainer>
            {Categories.map((item) => (
              <CategoryBox key={item.id} JSON={item} />
            ))}
            
          </ScrollableContainer>
        </div>
        <div className="FeaturedDiv" style={{paddingBottom: '40px'}}>
          <div className="d-flex">
            <rect />
            <div className="FeaturedDivText">Our Items:</div>
          </div>
          <div className="FeaturedDivSubText">
            <b>Browse ItemZilla Originals</b>
          </div>
          <ScrollableContainer>
            {OriginalItems.map((item) => (
              <ItemBox key={item.id} JSON={item} />
            ))}
            </ScrollableContainer>
        </div>
      </div>
    </>
  );
};

export default HomePage;
