import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';


function App() {
  const [xml, setXml] = useState(null)
  if(xml) {
    console.log(xml.getElementsByTagName("FUEL")[0])
  }

  useEffect(() => {
    async function loadData() {
      const res = await fetch(`https://lorcancorsproxy.herokuapp.com/https://downloads.elexonportal.co.uk/fuel/download/latest?key=2eo5rjhgzwn4mm6`)
      console.log(res)
      const data = await res.text()
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data,"text/xml");
      setXml(xmlDoc)
      console.log(xmlDoc)
    }
    loadData()
  }, [])

  return (
    <div className="App">
      <div>
			Parse XML using ReactJS
      {xml && xml.getElementsByTagName("FUEL")[0].getAttribute("TYPE")}
			{/* {xml &&
        xml.getElementsByTagName("FUEL").map((item) => {
				return (
					<span>{item.TYPE}</span>
				)
			})
		} */}
		</div>
    </div>
  );
}

export default App;
