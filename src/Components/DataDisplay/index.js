import React from "react";

export default function DataDisplay({ simplifiedData }) {
  const fuelTotal = simplifiedData.reduce(
    (acc, cur) => acc + Number(cur.value),
    0
  );

  function translucent(rgb) {
    return rgb.slice(0, -1) + ", 0.4)";
  }

  return (
    <div className="values-container">
      {simplifiedData.map((fuel, i) => {
        const percent = fuel.value / fuelTotal;
        return (
          <div className="fuel-container" key={i}>
            <div className="text-container">
              <div className="value">
                <span>
                  <b>{fuel.title}: </b>
                </span>
                <span>{fuel.value}</span>
                <span style={{ fontSize: "15px" }}>GW</span>
              </div>
              <div className="percentage">{Math.round(percent * 100)}%</div>
            </div>
            <div
              className="bar-background"
              style={{ backgroundColor: translucent(fuel.color) }}
            >
              <div
                className="bar-foreground"
                style={{
                  backgroundColor: fuel.color,
                  width: percent * 380,
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
