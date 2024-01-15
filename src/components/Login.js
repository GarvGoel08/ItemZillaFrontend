import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const authtoken = localStorage.getItem('iz-auth-token');
  const [Loading, setLoading] = useState(false);
  const [Email, setEmail] = useState("");
  const Navigate = useNavigate();
  const baseURL = "https://itemzillabackend.onrender.com/";
  const [Pass, setPass] = useState("");
  useEffect(() => {
    if (authtoken) {
        Navigate('/');
    }
}, [])
  const EmailOnChange = (event) => {
    setEmail(event.target.value);
  }
  const PassOnChange = (event) => {
    setPass(event.target.value);
  }
  const LoginHandler = async () => {
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email) || !Pass) {
      alert("Please enter all Details");
      setLoading(false);
    }
    else if (!(Pass.length >= 8)) {
      alert("Minimum Pass lenght is 8");
      setLoading(false);
    }
    else {
      const data = {
        pass: Pass,
        email: Email,
      }
      const url = `${baseURL}api/auth/Login`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      const jsonData = await response.json();
      console.log(jsonData);
      setLoading(false);
      if (jsonData.error) {
        alert(jsonData.error);
      }
      else if (jsonData.authtoken) {
        localStorage.setItem('iz-auth-token', jsonData.authtoken);
        Navigate('/');
      }
      else {
      setLoading(false);
      alert("An issue occured, Pls report");
      }
    }
  }
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
        className={`col-6 ${Loading ? "" : "Collapsed"}`}
        id="LoginMain"
        style={{
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
        }}
      >
        <div className="spinner-border text-primary "  role="status" >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      <div
        className={`col-6 ${Loading ? "Collapsed" : ""}`}
        id="LoginMain"
        style={{
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
        }}
      >
        <div style={{width: '60%'}}>
          <div>
            <label className="authMain">Log in to ItemZilla</label>
          </div>
          <div>
            <label className="authSub">Enter your details below</label>
          </div>
          <div>
            <div><input type="text" value={Email} onChange={EmailOnChange} className="authInput" placeholder="Email"/></div>
            <div><input type="text" className="authInput" value={Pass} onChange={PassOnChange} placeholder="Password"/></div>
          </div>
          <button className="authButton" onClick={LoginHandler} style={{marginTop: '40px'}}>Log in</button>
          <div style={{marginTop: '26px', textAlign: 'center'}} >
            <label>Dont have an account yet??</label>
            <Link to="/SignUp" className="authAhref"><b>SignUp</b></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
