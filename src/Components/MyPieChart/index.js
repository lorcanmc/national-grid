import React from "react";
import { PieChart } from "react-minimal-pie-chart";

const defaultLabelStyle = {
  fill: "white",
  fontSize: "3px",
  fontWeight: "bold",
  fontFamily: "sans-serif",
};

export default function index({ simplifiedData }) {
  return (
    <div className="pie-container">
      <PieChart
        data={simplifiedData}
        label={({ dataEntry }) => dataEntry.title}
        labelStyle={{
          ...defaultLabelStyle,
        }}
        labelPosition={60}
      />
    </div>
  );
}
