import React from "react";
import Logo from "../assets/app-logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center ">
      <img src={Logo} alt="App Logo" className="img-fluid" />
      <input
        type="text"
        className="form-control w-50 text-center mb-3"
        placeholder="Paste URL"
      />
      <button className="btn btn-primary w-50">Scan</button>
    </div>
  );
};

export default HomePage;
