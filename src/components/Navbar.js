import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const pathname = useLocation().pathname;
  const authtoken = localStorage.getItem("iz-auth-token");
  const baseURL = "https://itemzillabackend.onrender.com/";
  const [Categories, setCategories] = useState([]);
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
  return (
    <div>
      <div className="TopSaleBar">
        Winter Sale! Get Upto 50% off on Latest Products
      </div>
      <div>
        <nav className="NavBarMain d-flex">
          <h1>ItemZilla</h1>
          <nav style={{ padding: "0 0px 0 176px" }}>
            <ul>
              <li className={`${pathname === "/" ? "selected" : ""}`}>
                <Link to="/">Home</Link>
              </li>
              <li className={`${pathname === "/Categories" ? "selected" : ""}`}>
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categories
                </a>
                <ul className="dropdown-menu">
                  <li>
                    {Categories.map((item) => (
                      <>
                        <a
                          className="dropdown-item"
                          href={`/Categories/${item.categoryName}`}
                        >
                          {item.categoryName}
                        </a>

                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                      </>
                    ))}
                  </li>
                </ul>
              </li>
              <li
                className={`${pathname === "/Login" ? "selected" : ""} ${
                  authtoken ? "Collapsed" : ""
                }`}
              >
                <Link to="/Login">Log In</Link>
              </li>
              <li
                className={`${pathname === "/SignUp" ? "selected" : ""} ${
                  authtoken ? "Collapsed" : ""
                }`}
              >
                <Link to="/SignUp">Sign Up</Link>
              </li>
            </ul>
          </nav>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              style={{ fontSize: "14px", height: "30px" }}
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button
              className="NavbarButtons"
              style={{
                fontSize: "14px",
                alignItems: "center",
                height: "30px",
              }}
              type="submit"
            >
              <span
                className="material-symbols-outlined"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                search
              </span>
            </button>
            <Link
              to="/Cart"
              className="NavbarButtons"
              style={{
                fontSize: "14px",
                textDecoration: 'none',
                alignItems: "center",
                height: "30px",
                marginLeft: "8px",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                shopping_cart
              </span>
            </Link>
          </form>
        </nav>
      </div>
      <div className="SepLine"></div>
    </div>
  );
}
