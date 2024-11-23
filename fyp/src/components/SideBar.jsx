import React from "react";
import HistoryIcon from "../assets/history-icon.svg";
import SettingsIcon from "../assets/settings-icon.svg";
import UserIcon from "../assets/user-icon.svg";
import "bootstrap/js/dist/dropdown";

const SideBar = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="bg-dark col-auto col-md-1 min-vh-100 d-flex flex-column align-items-center justify-content-center">
          <div>
            <ul className="nav nav-pills flex-column">
              <li className="nav-item">
                <a href="#" className="nav-link active" aria-current="page">
                  <img
                    src={HistoryIcon}
                    className="img-fluid"
                    style={{ width: "35px", height: "35px" }}
                  />
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <img
                    src={SettingsIcon}
                    className="img-fluid"
                    style={{ width: "35px", height: "35px" }}
                  />
                </a>
              </li>
              <li className="nav-item disabled">
                <a href="#" className="nav-link">
                  Disabled
                </a>
              </li>
            </ul>
          </div>
          <div class="dropdown dropup">
            <a
              class=" dropdown-toggle"
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
            <div class="dropdown-menu" aria-labelledby="triggerId">
              <a class="dropdown-item" href="#">
                Settings
              </a>
              <a class="dropdown-item " href="#">
                Account
              </a>
              <a class="dropdown-item " href="#">
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
