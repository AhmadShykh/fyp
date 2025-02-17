import React from "react";

const GraphLegend = ({ percentage, label, count, width = 100 }) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        width: width, // Allow width to be dynamic
        height: 60,
        borderRadius: 8,
        marginTop: 16,
      }}
    >
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center", // Center content vertically
          padding: 8,
        }}
      >
        {/* Percentage Box */}
        <div
          style={{
            width: 40,
            height: 40,
            backgroundColor: "purple",
            color: "white",
            textAlign: "center",
            lineHeight: "40px",
            borderRadius: 8,
          }}
        >
          {percentage}%
        </div>

        {/* Label & Count */}
        <div>
          <div>{label}</div>
          <div>{count}</div>
        </div>
      </div>
    </div>
  );
};

export default GraphLegend;
