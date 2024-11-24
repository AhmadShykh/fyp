import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

const HistoryPage = () => {
  const companies = [
    "Devathon",
    "Ibex",
    "Devsinc",
    "Google",
    "Facebook",
    "Twitter",
    "Amazon",
    "Netflix",
    "Microsoft",
    "Apple",
  ];

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-white">
      <h1 className="mb-4 text-dark">History</h1>
      <div className="container">
        <div className="row">
          {companies.map((company, index) => (
            <div
              key={index}
              className="col-2 mb-3 d-flex justify-content-center"
            >
              <div
                className="card text-dark text-center"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "10px",
                  backgroundColor: "#AFAFAF33",
                }}
              >
                <div className="card-body d-flex align-items-center justify-content-center">
                  <h5 className="card-title">{company}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
