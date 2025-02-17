import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import AlertDistributionChart from "../components/AlertDistributionChart";
import GraphLegend from "../components/GraphLegend";
import RiskScoreChart from "../components/RiskScoreChart";
import TopVulnerabilitiesChart from "../components/TopVulnerabilitiesChart";

const DashboardPage = () => {
  return (
    <div
      style={{
        backgroundColor: "black",
        width: "100%",
        padding: 32,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ width: "100%", padding: 16 }}>
            {/* Imported Component */}
            <AlertDistributionChart />
            <div style={{ flexDirection: "row", display: "flex" }}>
              <GraphLegend percentage={12} label="High" count={2} width={120} />
              <GraphLegend
                percentage={29}
                label="Medium"
                count={5}
                width={120}
              />
              <GraphLegend percentage={35} label="Low" count={6} width={120} />
            </div>
            <div style={{ flexDirection: "row", display: "flex" }}>
              <GraphLegend
                percentage={6}
                label="Informational"
                count={2}
                width={180}
              />
              <GraphLegend
                percentage={18}
                label="False Positive"
                count={5}
                width={180}
              />
            </div>
            Risk Score:
            <RiskScoreChart percentage={21} />
          </div>
        </div>

        <div>
          <TopVulnerabilitiesChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
