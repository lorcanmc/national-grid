import "./App.css";
import { useEffect, useState } from "react";
import DataDisplay from "./Components/DataDisplay/index.js";
import MyPieChart from "./Components/MyPieChart/index.js";


import { XMLParser } from "fast-xml-parser";


function App() {
  const [recievedJson, setRecievedJson] = useState(null);
  const [recievedSolarJson, setRecievedSolarJson] = useState(null);
  let simplifiedData = null;


  useEffect(() => {
    async function loadData() {
      // Sheffield Solar
      const solarRes = await fetch(
        `https://api0.solar.sheffield.ac.uk/pvlive/v3/`
      );
      const solarData = await solarRes.json();
      setRecievedSolarJson(solarData)
      console.log(solarData)

      //Elexon
      const res = await fetch(
        `https://lorcancorsproxy.herokuapp.com/https://downloads.elexonportal.co.uk/fuel/download/latest?key=2eo5rjhgzwn4mm6`
      );
      const data = await res.text();
      const options = {
        ignoreAttributes: false,
      };
      const parser = new XMLParser(options);
      setRecievedJson(parser.parse(data));
    }
    loadData();
  }, []);

  function simplifyData() {
    if (recievedJson && recievedSolarJson) {
      const fuelList = recievedJson.GENERATION_BY_FUEL_TYPE_TABLE.HH.FUEL;

      const organisedData = [
        {
          title: "Solar",
          value: recievedSolarJson.data[0][3],
          color: "rgb(250, 213, 0)",
        },
        {
          title: "Gas",
          value: Number(fuelList[0]["@_VAL"]) + Number(fuelList[1]["@_VAL"]),
          color: "rgb(194, 53, 150)",
        },
        {
          title: "Wind",
          value: Number(fuelList[5]["@_VAL"]),
          color: "rgb(21, 167, 229)",
        },
        {
          title: "Coal",
          value: Number(fuelList[3]["@_VAL"]),
          color: "rgb(178, 178, 178)",
        },
        {
          title: "Biomass",
          value: Number(fuelList[13]["@_VAL"]),
          color: "rgb(255, 155, 50)",
        },
        {
          title: "Hydro",
          value: Number(fuelList[7]["@_VAL"]),
          color: "rgb(49, 105, 177)",
        },
        {
          title: "Nuclear",
          value: Number(fuelList[4]["@_VAL"]),
          color: "rgb(76, 174, 55)",
        },
        {
          title: "Imports",
          value:
            Number(fuelList[9]["@_VAL"]) +
            Number(fuelList[10]["@_VAL"]) +
            Number(fuelList[11]["@_VAL"]) +
            Number(fuelList[12]["@_VAL"]) +
            Number(fuelList[14]["@_VAL"]) +
            Number(fuelList[15]["@_VAL"]) +
            Number(fuelList[16]["@_VAL"]) +
            Number(fuelList[17]["@_VAL"]),
          color: "rgb(255, 80, 90)",
        },
        // {
        //       title: "Pumped Storage",
        //       value: Number(simplifiedData[6]["@_VAL"]),
        //       color: "rgb(255, 105, 180)",
        //     },
      ];
      const inGW = organisedData.map((fuel) => {
        return { ...fuel, value: Math.round(fuel.value / 10) / 100 };
      });
      simplifiedData = inGW.sort((a, b) => b.value - a.value);
      console.log(simplifiedData);
    }
  }
  simplifyData();

  return (
    <div className="App">
      <div>
        <h1>Current UK Electricity Grid Data</h1>
        {recievedJson && (
          <h2>
            {recievedJson.GENERATION_BY_FUEL_TYPE_TABLE.LAST_UPDATED[
              "@_AT"
            ].slice(0, 10) +
              "  " +
              recievedJson.GENERATION_BY_FUEL_TYPE_TABLE.HH["@_AT"]}
          </h2>
        )}
        {simplifiedData && (
          <>
            <MyPieChart simplifiedData={simplifiedData} />
            <DataDisplay simplifiedData={simplifiedData} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
