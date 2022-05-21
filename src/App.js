import './App.css';
import { useState, useEffect } from 'react';
import {Routes, Route} from 'react-router-dom'
import Header from './components/Header';
import Stock from './components/Stock';

const url = "https://cloud.iexapis.com/stable/stock/AAPL/quote?token=pk_348076a4671a4d4499147986cc6a52ef"

function App() {

  const [stockData, setstockData] = useState(null)

  useEffect( ()=> {
    fetch(url)
      .then(res => res.json())
      .then(data => setstockData(data))
  }, [])

  return (
    <>
    <Header />
    <Routes>
        <Route path='/' element={<Stock stock={stockData}/> } />
    </Routes>
    </>
  );
}

export default App;
