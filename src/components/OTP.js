import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OTP() {
  const state = useLocation().state;
  const { Email } = state;
  const authtoken = localStorage.getItem("iz-auth-token");
  const [otp, setotp] = useState("");
  const [Loading, setLoading] = useState(false);
  const baseURL = "https://item-zilla-backend.vercel.app/";
  const Navigate = useNavigate();
  useEffect(() => {
    if (authtoken) {
      Navigate("/");
    }
  }, []);
  const otpOnChange = (event) => {
    setotp(event.currentTarget.value);
  };
  const SignUpHandler = async () => {
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!otp) {
      alert("Please enter all Details");
      setLoading(false);
    } else {
      const data = {
        otp: otp,
        email: Email,
      };
      const url = `${baseURL}api/auth/VerifyOTP`;

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
      } else if (jsonData.authtoken) {
        localStorage.setItem("iz-auth-token", jsonData.authtoken);
        Navigate("/");
      } else {
        alert("An issue occured, Pls report");
        setLoading(false);
      }
    }
  };
  return (
    <div>
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
              <label className="authMain">Verify Account</label>
            </div>
            <div>
              <label className="authSub">Enter OTP Sent to your Email</label>
            </div>
            <div>
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={otpOnChange}
                  className="authInput"
                  placeholder="OTP"
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
          </div>
        </div>
      </div>
    </div>
  );
}
