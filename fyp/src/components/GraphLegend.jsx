import React from "react";

const GraphLegend = ({ percentage, label, count, width = 100 }) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        width: width,
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
          alignItems: "center",
          padding: 8,
        }}
      >
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

        <div>
          <div>{label}</div>
          <div>{count}</div>
        </div>
      </div>
    </div>
  );
};

export default GraphLegend;
