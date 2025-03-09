import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const RiskScoreChart = ({ percentage = 21 }) => {
  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage], // Filled and empty part
        backgroundColor: ["#6a5acd", "#e0e0e0"], // Purple and gray
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "70%", // Controls inner circle size
    rotation: 270, // Starts from top
    circumference: 180, // Creates a half-circle effect
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }, // Hide default tooltip
    },
  };

  return (
    <div style={{ position: "relative", width: 200, height: 200 }}>
      <Doughnut data={data} options={options} />
      {/* Centered Text */}
      <div
        style={{
          position: "absolute",
          top: "65%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          fontSize: 18,
          fontWeight: "bold",
          color: "#6a5acd",
        }}
      >
        {percentage}% <br />
        Good
      </div>
    </div>
  );
};

export default RiskScoreChart;
