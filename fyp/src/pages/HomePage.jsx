import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/app-logo.svg";

const HomePage = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loader state

  const isValidUrl = (string) => {
    const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    return regex.test(string.trim());
  };

  const handleScanClick = async () => {
    console.log("Scan clicked");
    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true); // Start loading
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/api/scan", { url });

      if (res?.data) {
        console.log("Response Data:", res.data);
        navigate("/ProcessPage", { state: { scanResult: res.data } });
      }
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false); // Stop loading
    }
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
        disabled={loading} // Disable input while loading
      />
      {error && <p className="text-danger mb-3">{error}</p>}
      {message && <p className="text-danger mb-3">{message}</p>}

      {/* Show loader when API call is in progress */}
      {loading ? (
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <button
          className="btn btn-primary w-50"
          onClick={handleScanClick}
          disabled={loading}
        >
          Scan
        </button>
      )}
    </div>
  );
};

export default HomePage;
