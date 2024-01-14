import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const authtoken = localStorage.getItem("iz-auth-token");
  const baseURL = "http://localhost:5000/";
  const [name, setName] = useState("");
  const [Pass, setPass] = useState("");
  const Navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Loading, setLoading] = useState(false);
  useEffect(() => {
    if (authtoken) {
      Navigate("/");
    }
  }, []);
  const NameOnChange = (event) => {
    setName(event.target.value);
  };
  const EmailOnChange = (event) => {
    setEmail(event.target.value);
  };
  const PassOnChange = (event) => {
    setPass(event.target.value);
  };
  const SignUpHandler = async () => {
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !emailRegex.test(Email) || !Pass) {
      alert("Please enter all Details");
      setLoading(false);
    } else if (!(Pass.length >= 8)) {
      alert("Minimum Pass lenght is 8");
      setLoading(false);
    } else {
      const data = {
        name: name,
        pass: Pass,
        email: Email,
      };
      const url = `${baseURL}api/auth/SignUp`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();
      console.log(jsonData);
      setLoading(false);

      if (jsonData.error) {
        alert(jsonData.error);
      } else if (jsonData.success) {
        Navigate("/OTP", { state: { Email: Email } });
      } else {
        alert("An issue occured, Pls report");
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    const handleResize = () => {
      const redDiv = document.querySelector(".col-6");
      const mainDiv = document.getElementById("LoginMain");
      const imgL = document.querySelector(".LoginImg");
      const rect = redDiv.getBoundingClientRect();
      const distanceFromTop = rect.top;
      const rect1 = mainDiv.getBoundingClientRect();
      const distanceFromTop1 = rect1.top;
      console.log(distanceFromTop);
      redDiv.style.height = `calc(100vh - ${distanceFromTop}px)`;
      mainDiv.style.height = `calc(100vh - ${distanceFromTop1}px)`;
      imgL.style.maxHeight = redDiv.style.height;
      console.log(redDiv.style.height);
    };

    handleResize(); // Run calculations initially
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on unmount
    };
  }, []);

  return (
    <div className="row row-ow">
      <div
        className="col-6"
        style={{
          background: "#CBE4E8",
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
        }}
      >
        <img
          src="shopping-transparent-background-13.png"
          className="LoginImg"
        />
      </div>
      <div
        className="col-6"
        id="LoginMain"
        style={{
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
        }}
      >
        <div style={{ width: "60%" }}>
          <div>
            <label className="authMain">Create a new Account</label>
          </div>
          <div>
            <label className="authSub">Enter your details below</label>
          </div>
          <div>
            <div>
              <input
                type="text"
                value={name}
                onChange={NameOnChange}
                className="authInput"
                placeholder="Name"
              />
            </div>
            <div>
              <input
                type="text"
                value={Email}
                onChange={EmailOnChange}
                className="authInput"
                placeholder="Email"
              />
            </div>
            <div>
              <input
                type="text"
                value={Pass}
                onChange={PassOnChange}
                className="authInput"
                placeholder="Password"
              />
            </div>
          </div>
          <button
            onClick={SignUpHandler}
            className="authButton"
            style={{ marginTop: "40px" }}
          >
            Sign Up
          </button>
          <div style={{ marginTop: "26px", textAlign: "center" }}>
            <label>Already have an account?</label>
            <Link to="/Login" className="authAhref">
              <b>Login</b>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
