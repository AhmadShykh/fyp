import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/app-logo.svg";

const HomePage = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const isValidUrl = (string) => {
    const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    return regex.test(string.trim());
  };

  const handleScanClick = () => {
    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL.");
      return;
    }

    setError("");
    navigate("/ProcessPage");
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center w-100">
      <img src={Logo} alt="App Logo" className="img-fluid" />
      <input
        type="text"
        className="form-control w-50 text-center mb-3"
        placeholder="Paste URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      {error && <p className="text-danger mb-3">{error}</p>}{" "}
      <button className="btn btn-primary w-50" onClick={handleScanClick}>
        Scan
      </button>
    </div>
  );
};

export default HomePage;
