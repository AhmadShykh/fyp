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
            {/* Imported Component */}
            <AlertDistributionChart />
            <div
              style={{ flexDirection: "row", display: "flex", marginTop: 16 }}
            >
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

            <div style={{ marginTop: 32 }}>
              Risk Score:
              <RiskScoreChart percentage={21} />
            </div>
          </div>
        </div>

        <div style={{ width: "100%" }}>
          <div style={{ width: "100%", padding: 16 }}>
            <TopVulnerabilitiesChart />
            <div
              style={{ flexDirection: "row", display: "flex", marginTop: 16 }}
            >
              <GraphLegend percentage={12} label="High" count={2} width={150} />
              <GraphLegend percentage={12} label="High" count={2} width={150} />
              <GraphLegend percentage={12} label="High" count={2} width={150} />
            </div>
          </div>

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
              <div>{new Date().toLocaleDateString()}</div>
              <div>{new Date().toLocaleDateString()}</div>
              <div>{new Date().toLocaleDateString()}</div>
              <div>{new Date().toLocaleDateString()}</div>
            </div>

            <div style={{ marginLeft: 4, textAlign: "center" }}>
              Rule
              <div>el solva</div>
              <div>el solva</div>
              <div>el solva</div>
              <div>el solva</div>
            </div>

            <div
              style={{
                textAlign: "center",
              }}
            >
              Severity
              <div>Low</div>
              <div>Low</div>
              <div>Low</div>
              <div>Low</div>
            </div>

            <div style={{ marginLeft: 4, textAlign: "center" }}>
              Risk Score
              <div>25</div>
              <div>25</div>
              <div>25</div>
              <div>25</div>
            </div>

            <div style={{ marginLeft: 4, textAlign: "center" }}>
              Reason
              <div>Elsa asduhnkasnj......</div>
              <div>Elsa asduhnkasnj......</div>
              <div>Elsa asduhnkasnj......</div>
              <div>Elsa asduhnkasnj......</div>
            </div>

            <div style={{ marginLeft: 4, textAlign: "center" }}>
              Hostname
              <div>El molesta</div>
              <div>El molesta</div>
              <div>El molesta</div>
              <div>El molesta</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
