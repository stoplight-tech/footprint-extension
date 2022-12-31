import { useState, useEffect } from 'react'
import { supabase } from './utils/supabaseClient'
import Account from './components/Accounts'
import {Authentication} from './components/Authentication'

import logo from "./logo.svg";
import "./App.css";

const App = () => {
  const [currentSessionBytes, setCurrentSessionBytes] = useState(0)
  const [currentSessionCo2, setCurrentSessionCo2] =useState(0)
  useEffect(() => {
    
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

    <h1>Current session bytes</h1>
    <p id="currentSessionBytes"> {currentSessionBytes}</p>

    <h1>Current session CO2 in KG</h1>
    <p id="currentSessionCO2"> {currentSessionCo2 * 1000}</p>

    <Authentication />
      </header>
    </div>
  );
};

export default App;
