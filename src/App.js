import "./App.css";
import { useEffect, useState } from "react";

import { PieChart } from "react-minimal-pie-chart";
import { XMLParser } from "fast-xml-parser";

const defaultLabelStyle = {
  fill: "white",
  fontSize: "3px",
  fontWeight: "bold",
  fontFamily: "sans-serif",
};

function App() {
  const [dataTime, setDataTime] = useState(null);
  console.log(dataTime);
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
      setDataTime(
        elexonJsonObj.GENERATION_BY_FUEL_TYPE_TABLE.LAST_UPDATED["@_AT"].slice(
          0,
          10
        ) +
          "  " +
          elexonJsonObj.GENERATION_BY_FUEL_TYPE_TABLE.HH["@_AT"]
      );
      let lastHalfHour = elexonJsonObj.GENERATION_BY_FUEL_TYPE_TABLE.HH.FUEL;
      setHalfHourJson(lastHalfHour);
    }
    loadData();
  }, []);

  return (
    <div className="App">
      <div>
        <h1>Current UK Grid Data</h1>
        {dataTime && <h2>{dataTime}</h2>}
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
                {
                  title: "Biomass",
                  value: Number(halfHourJson[13]["@_VAL"]),
                  color: "rgb(255, 155, 50)",
                },
                {
                  title: "Coal",
                  value: Number(halfHourJson[4]["@_VAL"]),
                  color: "rgb(178, 178, 178)",
                },
                {
                  title: "Imports",
                  value:
                    Number(halfHourJson[9]["@_VAL"]) +
                    Number(halfHourJson[10]["@_VAL"]) +
                    Number(halfHourJson[11]["@_VAL"]) +
                    Number(halfHourJson[12]["@_VAL"]) +
                    Number(halfHourJson[14]["@_VAL"]) +
                    Number(halfHourJson[15]["@_VAL"]) +
                    Number(halfHourJson[16]["@_VAL"]) +
                    Number(halfHourJson[17]["@_VAL"]),
                  color: "rgb(255, 80, 90)",
                },
                {
                  title: "Pumped Storage",
                  value: Number(halfHourJson[6]["@_VAL"]),
                  color: "rgb(255, 105, 180)",
                },
                {
                  title: "Wind",
                  value: Number(halfHourJson[5]["@_VAL"]),
                  color: "rgb(21, 167, 229)",
                },
                {
                  title: "Hydro",
                  value: Number(halfHourJson[8]["@_VAL"]),
                  color: "rgb(49, 105, 177)",
                },
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
