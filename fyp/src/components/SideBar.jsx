/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import "bootstrap/js/dist/dropdown";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "../assets/dashboard-icon.svg";
import HistoryIcon from "../assets/history-icon.svg";
import UserIcon from "../assets/user-icon.svg";

const SideBar = () => {
  const [selected, setSelected] = useState("dashboard");

  const navigate = useNavigate();

  const handleNavigation = (page) => {
    setSelected(page);

    if (page === "dashboard") {
      navigate("/DashboardPage");
    } else if (page === "history") {
      navigate("/HistoryPage");
    }
  };

  const handleLogout = () => {
    // Example: Clear auth tokens or user info

    navigate("/LoginPage"); // Navigate to login
  };

  return (
    <div className="bg-dark col-auto col-md-1 min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <div>
        <ul className="nav nav-pills flex-column">
          <li className="nav-item">
            <a
              href="/DashboardPage"
              className={`nav-link ${selected === "dashboard" ? "active" : ""}`}
              onClick={() => handleNavigation("dashboard")}
            >
              <img
                src={DashboardIcon}
                className="img-fluid"
                style={{ width: "35px", height: "35px" }}
              />
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/HistoryPage"
              className={`nav-link ${selected === "history" ? "active" : ""}`}
              onClick={() => handleNavigation("history")}
            >
              <img
                src={HistoryIcon}
                className="img-fluid"
                style={{ width: "35px", height: "35px" }}
              />
            </a>
          </li>
        </ul>
      </div>
      <div className="dropdown dropup">
        <a
          className="dropdown-toggle"
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
        </a>
        <div className="dropdown-menu" aria-labelledby="triggerId">
          <a className="dropdown-item" href="#" onClick={handleLogout}>
            Logout
          </a>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
