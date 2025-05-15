import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/history/functions/getUserWebsites",
          {
            withCredentials: true,
          },
        );
        setHistoryData(response.data); // Expecting [{ name, url, pdfLink }]
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-white">
      <h1 className="mb-4 text-dark">History</h1>
      <div className="container">
        <div className="row">
          {historyData.length === 0 ? (
            <p className="text-dark text-center">No history found.</p>
          ) : (
            historyData.map((entry, index) => (
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
                  <div
                    className="card-body d-flex align-items-center justify-content-center touchable"
                    onClick={() => window.open(entry.pdfLink, "_blank")}
                    role="button"
                    title={entry.url}
                  >
                    <h5 className="card-title">{entry.name}</h5>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
