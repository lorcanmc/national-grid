import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [xml, setXml] = useState(null);
  if (xml) {
    console.log(xml);
  }

  useEffect(() => {
    async function loadData() {
      const solarRes = await fetch(
        `https://api0.solar.sheffield.ac.uk/pvlive/v3/`
      );
      const solarData = await solarRes.json();
      console.log(solarData);

      const res = await fetch(
        `https://lorcancorsproxy.herokuapp.com/https://downloads.elexonportal.co.uk/fuel/download/latest?key=2eo5rjhgzwn4mm6`
      );
      const data = await res.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      setXml([
        ...xmlDoc
          .getElementsByTagName("LAST24H")[0]
          .getElementsByTagName("FUEL"),
      ]);
      console.log(xmlDoc);
    }
    loadData();
  }, []);

  return (
    <div className="App">
      <div>
        <h1>Current Grid Data</h1>
        {xml &&
          xml.map((fuel) => {
            return (
              <div>
                <span>
                  <b>{fuel.getAttribute("TYPE")}: </b>
                </span>
                <span>{fuel.getAttribute("VAL")} MW</span>
              </div>
            );
          })}
        {/* {xml &&
          xml.getElementsByTagName("FUEL").map((item) => {
            return <span>{item.getAttribute("TYPE")}</span>;
          })} */}
      </div>
    </div>
  );
}

export default App;
