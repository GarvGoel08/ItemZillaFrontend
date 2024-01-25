import React, { useRef, useState } from 'react'

const ScrollableContainer = ({ children }) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const itemListRef = useRef(null);
  
    const handleScroll = (direction) => {
      const scrollAmount = 160;
      const container = itemListRef.current;
  
      if (container) {
        if (direction === "left") {
          container.scrollLeft -= scrollAmount;
        } else if (direction === "right") {
          container.scrollLeft += scrollAmount;
        }
  
        setScrollPosition(container.scrollLeft);
      }
    };
  
    return (
      <div className="ItemList d-flex" style={{ overflowX: "hidden", position: "relative" }}>
        <button
          className={`scroll-button left ${scrollPosition > 0 ? "" : "Collapsed"}`}
          onClick={() => handleScroll("left")}
          style={{ left: "0", borderRadius: "0px 10px 10px 0px" }}
        >
          &lt;
        </button>
  
        <div
          ref={itemListRef}
          className="scroll-container"
          style={{
            overflowX: "hidden",
            scrollbarWidth: "thin",
            position: "relative",
            display: "flex",
          }}
        >
          {children}
        </div>
  
        <button
          className={`scroll-button right ${
            scrollPosition < itemListRef.current?.scrollWidth - itemListRef.current?.clientWidth
              ? ""
              : "Collapsed"
          }`}
          onClick={() => handleScroll("right")}
          style={{ right: "0" }}
        >
          &gt;
        </button>
      </div>
    );
  };
export default ScrollableContainer;
