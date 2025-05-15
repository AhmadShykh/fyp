/* eslint-disable jsx-a11y/alt-text */
import "bootstrap/js/dist/dropdown";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "../assets/dashboard-icon.svg";
import HistoryIcon from "../assets/history-icon.svg";
import UserIcon from "../assets/user-icon.svg";
import { useAuth } from "../context/AuthContext";

const SideBar = () => {
  const [selected, setSelected] = useState("dashboard");
  const navigate = useNavigate();

  const { isAuthenticated, logout } = useAuth();

  const handleNavigation = (page) => {
    setSelected(page);
    navigate(`/${page === "dashboard" ? "DashboardPage" : "HistoryPage"}`);
  };

  const handleLogout = () => {
    logout(); // Call logout from context
    navigate("/LoginPage");
  };

  const handleLogin = () => {
    navigate("/LoginPage");
  };

  return (
    <div className="bg-dark col-auto col-md-1 min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <div>
        <ul className="nav nav-pills flex-column">
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link ${
                selected === "dashboard" ? "active" : ""
              }`}
              onClick={() => handleNavigation("dashboard")}
            >
              <img
                src={DashboardIcon}
                className="img-fluid"
                style={{ width: "35px", height: "35px" }}
              />
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link ${
                selected === "history" ? "active" : ""
              }`}
              onClick={() => handleNavigation("history")}
            >
              <img
                src={HistoryIcon}
                className="img-fluid"
                style={{ width: "35px", height: "35px" }}
              />
            </button>
          </li>
        </ul>
      </div>

      <div className="dropdown dropup mt-auto">
        <button
          className="dropdown-toggle btn btn-link"
          type="button"
          id="triggerId"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src={UserIcon}
            className="img-fluid"
            style={{ width: "35px", height: "35px" }}
          />
        </button>
        <div className="dropdown-menu" aria-labelledby="triggerId">
          {isAuthenticated ? (
            <button className="dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="dropdown-item" onClick={handleLogin}>
              Login
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="text-white mt-3">Anas</p>
      </div>
    </div>
  );
};

export default SideBar;
