import React, { useEffect } from "react";


export default function () {
    useEffect(() => {
        const handleResize = () => {
          const redDiv = document.querySelector(".HeightOW");
          const rect = redDiv.getBoundingClientRect();
          const distanceFromTop = rect.top;
          redDiv.style.height = `calc(100vh - ${distanceFromTop}px)`;
          console.log(redDiv.style.height);
        };
    
        handleResize(); 
        window.addEventListener("resize", handleResize);
    
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);
  return (
    <div
      className={`HeightOW`}
      id="LoginMain"
      style={{
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexGrow: 1,
      }}
    >
        <div style={{background: 'white', padding: '80px', borderRadius: '10px'}}>
            
          <div>
            <label className="authMain">Edit Details</label>
          </div>
          <div>
            <label className="authSub">Enter your Name below</label>
          </div>
          <div>
            <div><input type="text"  className="authInput" placeholder="New Name"/></div>
          </div>
          <button className="authButton" style={{marginTop: '40px'}}>Save Changes</button>
        </div>
    </div>
  );
}
