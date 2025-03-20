import React from "react";
import { useLocation } from "react-router-dom";
import AlertDistributionChart from "../components/AlertDistributionChart";
import GraphLegend from "../components/GraphLegend";
import RiskScoreChart from "../components/RiskScoreChart";
import TopVulnerabilitiesChart from "../components/TopVulnerabilitiesChart";

const DashboardPage = () => {
  const location = useLocation();
  const { zapData } = location.state || {
    zapData: {
      alertDistribution: { High: 0, Medium: 0, Low: 0, Informational: 0 },
      riskScore: 0,
      topVulnerabilities: [],
      alertDetails: [],
    },
  };

  const { alertDistribution, riskScore, topVulnerabilities, alertDetails } =
    zapData;

  const highPercentage = Math.round(
    (alertDistribution.High / alertDetails.length) * 100,
  );
  const mediumPercentage = Math.round(
    (alertDistribution.Medium / alertDetails.length) * 100,
  );
  const lowPercentage = Math.round(
    (alertDistribution.Low / alertDetails.length) * 100,
  );
  const informationalPercentage = Math.round(
    (alertDistribution.Informational / alertDetails.length) * 100,
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

            <div
              style={{
                marginTop: 32,
              }}
            >
              Risk Score:
              <RiskScoreChart percentage={Math.round(riskScore)} />
            </div>
          </div>
        </div>

        <div style={{ width: "100%" }}>
          <div style={{ width: "100%", padding: 16 }}>
            <TopVulnerabilitiesChart data={topVulnerabilities} />
          </div>
          {/* 
          <div style={{ marginTop: 32 }}>Alerts:</div>

          <div
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              Timeline
              {alertDetails.map((alert, index) => (
                <div key={index}>{new Date().toLocaleDateString()}</div>
              ))}
            </div>

            <div style={{ marginLeft: 4, textAlign: "center" }}>
              Rule
              {alertDetails.map((alert, index) => (
                <div key={index}>{alert.rule}</div>
              ))}
            </div>

            <div style={{ textAlign: "center" }}>
              Severity
              {alertDetails.map((alert, index) => (
                <div key={index}>{alert.severity}</div>
              ))}
            </div>

            <div style={{ marginLeft: 4, textAlign: "center" }}>
              Risk Score
              {alertDetails.map((alert, index) => (
                <div key={index}>{alert.riskScore}</div>
              ))}
            </div>

            <div style={{ marginLeft: 4, textAlign: "center" }}>
              Reason
              {alertDetails.map((alert, index) => (
                <div key={index}>{alert.reason}</div>
              ))}
            </div>

            <div style={{ marginLeft: 4, textAlign: "center" }}>
              Hostname
              {alertDetails.map((alert, index) => (
                <div key={index}>{alert.hostname}</div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
