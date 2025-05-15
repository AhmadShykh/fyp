import React from "react";
import { useLocation } from "react-router-dom";
import AlertDistributionChart from "../components/AlertDistributionChart";
import GraphLegend from "../components/GraphLegend";
import RiskScoreChart from "../components/RiskScoreChart";
import TopVulnerabilitiesChart from "../components/TopVulnerabilitiesChart";

const DashboardPage = () => {
  const location = useLocation();
  const { scanResult } = location.state || {};

  const parseZapData = (zapJson) => {
    const alerts = zapJson?.site?.[0]?.alerts || [];

    const alertDistribution = {
      High: 0,
      Medium: 0,
      Low: 0,
      Informational: 0,
    };

    const alertDetails = alerts.map((alert) => {
      const risk = alert.riskdesc?.toLowerCase();
      if (risk.includes("high")) alertDistribution.High++;
      else if (risk.includes("medium")) alertDistribution.Medium++;
      else if (risk.includes("low")) alertDistribution.Low++;
      else alertDistribution.Informational++;

      return {
        rule: alert.name,
        severity: alert.riskdesc,
        riskScore: parseInt(alert.riskcode) * 25, // Example conversion
        reason: alert.desc?.replace(/<[^>]*>?/gm, "").slice(0, 100),
        hostname: alert.instances?.[0]?.uri || "Unknown",
      };
    });

    const riskScore =
      alertDetails.reduce((sum, a) => sum + a.riskScore, 0) /
      (alertDetails.length || 1);

    const topVulnerabilities = alertDetails
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5)
      .map((vuln) => ({
        name: vuln.rule,
        value: vuln.riskScore,
      }));

    return {
      alertDistribution,
      riskScore,
      topVulnerabilities,
      alertDetails,
    };
  };

  const zapData = parseZapData(
    scanResult?.scan_results?.owasp_zap_json_output || {},
  );

  const { alertDistribution, riskScore, topVulnerabilities, alertDetails } =
    zapData;

  const highPercentage = Math.round(
    (alertDistribution.High / (alertDetails.length || 1)) * 100,
  );
  const mediumPercentage = Math.round(
    (alertDistribution.Medium / (alertDetails.length || 1)) * 100,
  );
  const lowPercentage = Math.round(
    (alertDistribution.Low / (alertDetails.length || 1)) * 100,
  );
  const informationalPercentage = Math.round(
    (alertDistribution.Informational / (alertDetails.length || 1)) * 100,
  );

  return (
    <div
      style={{
        backgroundColor: "#EDECFE",
        width: "100%",
        padding: 32,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 56,
        }}
      >
        <div>
          <div style={{ width: "100%", padding: 16 }}>
            <AlertDistributionChart data={alertDistribution} />

            <div
              style={{ flexDirection: "row", display: "flex", marginTop: 16 }}
            >
              <GraphLegend
                percentage={highPercentage}
                label="High"
                count={alertDistribution.High}
                width={120}
              />
              <div style={{ width: "3%" }} />
              <GraphLegend
                percentage={mediumPercentage}
                label="Medium"
                count={alertDistribution.Medium}
                width={120}
              />
              <div style={{ width: "3%" }} />
              <GraphLegend
                percentage={lowPercentage}
                label="Low"
                count={alertDistribution.Low}
                width={120}
              />
              <div style={{ width: "3%" }} />
            </div>

            <div style={{ flexDirection: "row", display: "flex" }}>
              <GraphLegend
                percentage={informationalPercentage}
                label="Informational"
                count={alertDistribution.Informational}
                width={180}
              />
            </div>

            <div style={{ marginTop: 32 }}>
              Risk Score:
              <RiskScoreChart percentage={Math.round(riskScore)} />
            </div>
          </div>
        </div>

        <div style={{ width: "100%" }}>
          <div style={{ width: "100%", padding: 16 }}>
            <TopVulnerabilitiesChart data={topVulnerabilities} />
          </div>
        </div>
      </div>

      {/* Bonus: Raw scan outputs */}
      <div
        style={{
          background: "#fff",
          padding: 24,
          marginTop: 32,
          borderRadius: 8,
        }}
      >
        <h5>Metasploit Output</h5>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            maxHeight: 200,
            overflowY: "auto",
            backgroundColor: "#f8f9fa",
            padding: 16,
            borderRadius: 6,
          }}
        >
          {scanResult?.scan_results?.metasploit_output || "No output available"}
        </pre>

        <h5 style={{ marginTop: 24 }}>Nmap Output</h5>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            maxHeight: 200,
            overflowY: "auto",
            backgroundColor: "#f8f9fa",
            padding: 16,
            borderRadius: 6,
          }}
        >
          {scanResult?.scan_results?.nmap_output || "No output available"}
        </pre>
      </div>
    </div>
  );
};

export default DashboardPage;
