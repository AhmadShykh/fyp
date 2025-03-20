import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProcessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scanData = location.state?.scanResult;

  const [progress, setProgress] = useState(0);
  const [headerText, setHeaderText] = useState("Processing Scan...");
  const scrollRef = useRef(null);
  const [scanResults, setScanResults] = useState({
    metasploit: "",
    nmap: "",
    owaspZap: null,
  });
  const [pdfUrl, setPdfUrl] = useState("");
  const [zapData, setZapData] = useState(null);

  const extractZapData = (owaspZapOutput) => {
    const alerts = owaspZapOutput.site[0].alerts;

    const alertDistribution = {
      High: alerts.filter((alert) => alert.riskcode === "3").length,
      Medium: alerts.filter((alert) => alert.riskcode === "2").length,
      Low: alerts.filter((alert) => alert.riskcode === "1").length,
      Informational: alerts.filter((alert) => alert.riskcode === "0").length,
    };

    const riskScore =
      alertDistribution.High * 3 +
      alertDistribution.Medium * 2 +
      alertDistribution.Low * 1;

    const topVulnerabilities = alerts
      .sort((a, b) => b.riskcode - a.riskcode)
      .slice(0, 3)
      .map((alert) => alert.name);

    const alertDetails = alerts.map((alert) => ({
      rule: alert.name,
      severity: ["Informational", "Low", "Medium", "High"][alert.riskcode],
      riskScore: alert.riskcode * 10,
      reason: alert.desc,
      hostname: owaspZapOutput.site[0]["@host"],
    }));

    return {
      alertDistribution,
      riskScore,
      topVulnerabilities,
      alertDetails,
    };
  };

  useEffect(() => {
    if (!scanData) {
      setHeaderText("No scan data available.");
      return;
    }

    let progressSteps = 0;
    const totalSteps = 3;

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const processScanResults = async () => {
      if (scanData.scan_results?.metasploit_output) {
        setScanResults((prev) => ({
          ...prev,
          metasploit: scanData.scan_results.metasploit_output,
        }));
        progressSteps++;
        setProgress(((progressSteps / totalSteps) * 100).toFixed(0));
        await delay(1000);
      }

      if (scanData.scan_results?.nmap_output) {
        setScanResults((prev) => ({
          ...prev,
          nmap: scanData.scan_results.nmap_output,
        }));
        progressSteps++;
        setProgress(((progressSteps / totalSteps) * 100).toFixed(0));
        await delay(1000);
      }

      if (scanData.scan_results?.owasp_zap_json_output) {
        const zapOutput = scanData.scan_results.owasp_zap_json_output;
        setScanResults((prev) => ({
          ...prev,
          owaspZap: zapOutput,
        }));
        const extractedZapData = extractZapData(zapOutput);
        setZapData(extractedZapData);
        progressSteps++;
        setProgress(((progressSteps / totalSteps) * 100).toFixed(0));
        await delay(1000);
      }

      if (scanData.pdf_url) {
        setPdfUrl(scanData.pdf_url);
      }

      setHeaderText("Scan Completed Successfully!");
    };

    processScanResults();
  }, [scanData]);

  const handleNavigateToDashboard = () => {
    if (zapData) {
      navigate("/DashboardPage", { state: { zapData } });
    } else {
      alert("ZAP data is not available yet.");
    }
  };

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
            background: scanResults.owaspZap?.site?.[0]?.alerts?.some(
              (alert) => alert.riskcode === "3",
            )
              ? "#ffe6e6"
              : "#f3f3f3",
            padding: "10px",
            borderRadius: "5px",
            color: scanResults.owaspZap?.site?.[0]?.alerts?.some(
              (alert) => alert.riskcode === "3",
            )
              ? "red"
              : "black",
          }}
        >
          {JSON.stringify(scanResults.owaspZap, null, 2) || "Loading..."}
        </pre>

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

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={handleNavigateToDashboard}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4AA8FF",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessPage;
