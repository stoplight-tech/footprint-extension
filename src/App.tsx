import * as React from "react";
import logo from "./logo.svg";
import "./App.css";

const App = () => {
  console.log('hi')
  const [currentSessionBytes, setCurrentSessionBytes] = React.useState(0)
  const [currentSessionCo2, setCurrentSessionCo2] = React.useState(0)
  React.useEffect(() => {
    
    // declare the async data fetching function
    const fetchData = async () => {
      // get the data from the api
      const { currentSessionBytes } = await chrome.storage.session.get(['currentSessionBytes'])
      const { currentSessionCo2 } = await chrome.storage.session.get(['currentSessionCo2'])
      // convert the data to json
  
      // set state with the result
      setCurrentSessionBytes(currentSessionBytes);
      setCurrentSessionCo2(currentSessionCo2)
    }
  
    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);;
  }, [])
  return (
    <div className="App">
      <header className="App-header">
      <h1>All time Bytes sent</h1>
    <p id="allTime"></p>

    <h1>All time CO2 in KG</h1>
    <p id="allTimeCO2"></p>

    <h1>Current session bytes</h1>
    <p id="currentSessionBytes"> {currentSessionBytes}</p>

    <h1>Current session CO2 in KG</h1>
    <p id="currentSessionCO2"> {currentSessionCo2 * 1000}</p>
      </header>
    </div>
  );
};

export default App;
