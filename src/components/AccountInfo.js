import React, { useEffect, useState } from "react";

export default function AccountInfo() {
  const authtoken = localStorage.getItem("iz-auth-token");
  const baseURL = "https://item-zilla-backend.vercel.app/";
  const [user, setUser] = useState("");

  useEffect(() => {
    if (authtoken) {
      const getUser = async () => {
        try {
          const response = await fetch(`${baseURL}api/auth/GetUser`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": authtoken,
            },
          });
          const ResponseJSON = await response.json();
          setUser(ResponseJSON);
        } catch {
          console.log("Error Fetching User");
        }
      };
      getUser();
    }
  }, [authtoken]);
  return (
    <div className="AccountInfoDiv">
      <div className="d-flex" style={{ marginTop: "24px" }}>
        <rect className="rectRed" />
        <div className="FeaturedDivText">Your Account:</div>
      </div>

      <div className="FeaturedDivSubText">
        <b>Your Account Info</b>
      </div>
      <div className="AcccontInfoSubDiv">
        <div style={{ display: "flex" }}>
          <span style={{display: 'flex', alignItems: 'center'}}>
            <b>Name</b>
          </span>
          <button className="EditButton">Edit</button>
        </div>
        <div>{user.name}</div>
      </div>
      <div className="AcccontInfoSubDiv">
        <div style={{ display: "flex" }}>
          <span style={{display: 'flex', alignItems: 'center'}}>
            <b>Email</b>
          </span>
          <button className="EditButton">Edit</button>
        </div>
        <div>{user.email}</div>
      </div>
      <div className="AcccontInfoSubDiv">
        <div style={{ display: "flex" }}>
          <span style={{display: 'flex', alignItems: 'center'}}>
            <b>Password</b>
          </span>
          <button className="EditButton">Edit</button>
        </div>
      </div>
    </div>
  );
}
