import "./App.css";
import { useEffect, useState } from "react";

import { PieChart } from "react-minimal-pie-chart";
import { XMLParser } from "fast-xml-parser";

const defaultLabelStyle = {
  fill: "white",
  fontSize: "5px",
  fontWeight: "bold",
  fontFamily: "sans-serif",
};

function App() {
  const [halfHourJson, setHalfHourJson] = useState(null);

  useEffect(() => {
    async function loadData() {
      // sheffield solar
      // const solarRes = await fetch(
      //   `https://api0.solar.sheffield.ac.uk/pvlive/v3/`
      // );
      // const solarData = await solarRes.json();
      // console.log(solarData);

      //Elexon
      const res = await fetch(
        `https://lorcancorsproxy.herokuapp.com/https://downloads.elexonportal.co.uk/fuel/download/latest?key=2eo5rjhgzwn4mm6`
      );
      const data = await res.text();
      const options = {
        ignoreAttributes: false,
      };
      const parser = new XMLParser(options);
      let elexonJsonObj = parser.parse(data);
      console.log(elexonJsonObj);
      let lastHalfHour = elexonJsonObj.GENERATION_BY_FUEL_TYPE_TABLE.HH.FUEL;
      console.log(lastHalfHour);

      setHalfHourJson(lastHalfHour);
    }
    loadData();
  }, []);

  return (
    <div className="App">
      <div>
        <h1>Current UK Grid Data</h1>
        {halfHourJson && (
          <div className="pie-container">
            <PieChart
              data={[
                {
                  title: "Natural Gas",
                  value: Number(halfHourJson[0]["@_VAL"]),
                  color: "rgb(194, 53, 150)",
                },
                {
                  title: "Nuclear",
                  value: Number(halfHourJson[4]["@_VAL"]),
                  color: "rgb(76, 174, 55)",
                },
                // { title: "Three", value: 20, color: "#6A2135" },
              ]}
              label={({ dataEntry }) => dataEntry.title}
              labelStyle={{
                ...defaultLabelStyle,
              }}
              labelPosition={60}
            />
          </div>
        )}
        <div className="values-container">
          {halfHourJson &&
            halfHourJson.map((fuel, i) => {
              return (
                <div key={i}>
                  <span>
                    <b>{fuel["@_TYPE"]}: </b>
                  </span>
                  <span>{Math.round(fuel["@_VAL"] / 10) / 100} GW</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
