import React, { useEffect, useRef, useState } from "react";

const ProcessPage = () => {
  const lengthyText = `
  Searching on google.com.mx
----------------------------------------------------------- 100%
Analyzing results
Best responses
Domain: www.bluicesoftware.com
Whois: www.bluicesoftware.com
Gathering construction information for: www.bluicesoftware.com

Server Information
----------------------------------------------------------- 100%
Directory enumeration for: www.bluicesoftware.com
----------------------------------------------------------- 100%
Structure of: www.bluicesoftware.com
Relevant found addresses
Web scraping: gathering relevant information
External Links
Redirects
Analyzing downloadable files
Blog titles for SEO information
Structure of: www.store.bluicesoftware.com
Information on: www.store.bluicesoftware.com/products
Analyzing security
`;

  const [displayedText, setDisplayedText] = useState("");
  const [progress, setProgress] = useState(0);
  const [headerText, setHeaderText] = useState("Processing...");
  const scrollRef = useRef(null);

  useEffect(() => {
    let index = 0;
    const totalLength = lengthyText.length;
    const interval = setInterval(() => {
      if (index < totalLength) {
        setDisplayedText((prev) => prev + lengthyText[index]);
        index++;

        setProgress(((index / totalLength) * 100).toFixed(0));

        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        setHeaderText("Tech for you");
      }
    }, 30);
    return () => clearInterval(interval);
  }, [lengthyText]);

  return (
    <div
      style={{
        padding: "100px",
        fontFamily: "Arial, sans-serif",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1>{headerText}</h1>

      <div
        style={{
          margin: "20px 0",
          width: "100%",
          height: "10px",
          background: "#ddd",
          borderRadius: "5px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(90deg,rgb(74, 89, 255), #4AA8FF)",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
          {displayedText}
        </p>
      </div>
    </div>
  );
};

export default ProcessPage;
