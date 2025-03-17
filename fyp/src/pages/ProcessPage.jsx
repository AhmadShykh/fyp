import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const ProcessPage = () => {
  const location = useLocation();
  const scanData = location.state?.scanResult;

  const [progress, setProgress] = useState(0);
  const [headerText, setHeaderText] = useState("Processing Scan...");
  const scrollRef = useRef(null);
  const [scanResults, setScanResults] = useState({
    metasploit: "",
    nmap: "",
    owaspZap: "",
  });
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    if (!scanData) {
      setHeaderText("No scan data available.");
      return;
    }

    let progressSteps = 0;
    const totalSteps = 3; // Metasploit, Nmap, OWASP ZAP

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const processScanResults = async () => {
      // Process Metasploit Output
      if (scanData.scan_results?.metasploit_output) {
        setScanResults((prev) => ({
          ...prev,
          metasploit: scanData.scan_results.metasploit_output,
        }));
        progressSteps++;
        setProgress(((progressSteps / totalSteps) * 100).toFixed(0));
        await delay(1000);
      }

      // Process Nmap Output
      if (scanData.scan_results?.nmap_output) {
        setScanResults((prev) => ({
          ...prev,
          nmap: scanData.scan_results.nmap_output,
        }));
        progressSteps++;
        setProgress(((progressSteps / totalSteps) * 100).toFixed(0));
        await delay(1000);
      }

      // Process OWASP ZAP Output
      if (scanData.scan_results?.owasp_zap_output) {
        setScanResults((prev) => ({
          ...prev,
          owaspZap: scanData.scan_results.owasp_zap_output.includes("Failed")
            ? "⚠️ OWASP ZAP Scan Failed!"
            : scanData.scan_results.owasp_zap_output,
        }));
        progressSteps++;
        setProgress(((progressSteps / totalSteps) * 100).toFixed(0));
        await delay(1000);
      }

      // Set PDF URL if available
      if (scanData.pdf_url) {
        setPdfUrl(scanData.pdf_url);
      }

      setHeaderText("Scan Completed Successfully!");
    };

    processScanResults();
  }, [scanData]);

  return (
    <div
      style={{
        padding: "50px",
        fontFamily: "Arial, sans-serif",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h1>{headerText}</h1>

      {/* Progress Bar */}
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

      {/* Scan Results */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          background: "#fff",
        }}
      >
        <h3>🔍 Metasploit Scan</h3>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: "#f3f3f3",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {scanResults.metasploit || "Loading..."}
        </pre>

        <h3>🛠️ Nmap Scan</h3>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: "#f3f3f3",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {scanResults.nmap || "Loading..."}
        </pre>

        <h3>⚠️ OWASP ZAP Scan</h3>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: scanResults.owaspZap.includes("Failed")
              ? "#ffe6e6"
              : "#f3f3f3",
            padding: "10px",
            borderRadius: "5px",
            color: scanResults.owaspZap.includes("Failed") ? "red" : "black",
          }}
        >
          {scanResults.owaspZap || "Loading..."}
        </pre>

        {/* PDF Section */}
        {pdfUrl && (
          <div style={{ marginTop: "20px" }}>
            <h3>📄 Scan Report PDF</h3>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  color: "#4AA8FF",
                  fontWeight: "bold",
                }}
              >
                View PDF Report
              </a>
              <span>or</span>
              <iframe
                src={pdfUrl}
                width="100%"
                height="500px"
                style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                title="Scan Report PDF"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessPage;
