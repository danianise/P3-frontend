
import './App.css';
import { useState, useEffect } from 'react';

const url = "https://cloud.iexapis.com/stable/stock/AAPL/quote?token=pk_348076a4671a4d4499147986cc6a52ef"

function App() {
  const [data, setData] = useState(null)
  useEffect( ()=> {
    fetch(url)
      .then(res => res.json())
      .then(data => setData(data))
  }, [])

  return (
    <div className="App">
        {data ? <div>{data.iexVolume}</div> : "" }
    </div>
  );
}

export default App;
