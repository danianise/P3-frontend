
import './App.css';
import { useState, useEffect } from 'react';

const url = process.env.NODE_ENV === 'production'
    ? "https://cloud.iexapis.com/stable/stock/AAPL/quote?token=pk_348076a4671a4d4499147986cc6a52ef"
    : "http://localhost:4000/"


function App() {

  const [data, setData] = useState(null)

  useEffect( ()=> {
    fetch(url)
      .then(res => res.json())
      .then(data => setData(data))
  }, [])

  return (
    <div className="App">
        {data ? <div>{data.symbol}</div> : "" }
    </div>
  );
}

export default App;
